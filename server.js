// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
require('dotenv').config();

// --- 1. API Keys & Secrets ---
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = "mongodb+srv://codewithsachin10_db_user:Aadya%40114251@cluster0.aojxubo.mongodb.net/?appName=Cluster0";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY; 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; 

// --- 2. Initialize Services ---
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);
// TWILIO REMOVED

// --- 3. Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- 4. Schemas ---
const AddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  room: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, 
  phone: { type: String, default: '' },
  googleId: { type: String }, 
  addresses: [AddressSchema],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true, default: 0 }
});
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now },
  deliveryRoom: { type: String, required: true },
  transactionId: { type: String, required: true },
  paymentProofUrl: { type: String, required: true },
});
const Order = mongoose.model('Order', OrderSchema);

// --- 5. App Setup & Passport Init ---
const app = express();
const PORT = 5001;
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// --- 6. File Upload (Multer) Setup ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadDir); },
  filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(uploadDir));


// --- 7. Auth Middleware (Unchanged) ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(403).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

// --- 8. API Routes ---

// Google Auth Routes (Unchanged)
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        } else {
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await newUser.save();
          return done(null, newUser);
        }
      }
    } catch (error) {
      return done(error, false);
    }
  }
));
app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/', session: false }), 
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, name: req.user.name, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const userString = JSON.stringify({ name: req.user.name, email: req.user.emails[0].value, role: req.user.role });
    res.redirect(`http://localhost:3000/auth/callback?token=${token}&user=${encodeURIComponent(userString)}`);
  }
);


// Standard Auth Routes (Unchanged)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists with that email' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
          name: name,
          email: email,
          password: hashedPassword,
        });
        await newUser.save();
        const token = jwt.sign(
          { userId: newUser._id, name: newUser.name, role: newUser.role },
          JWT_SECRET,
          { expiresIn: '1d' }
        );
        res.status(201).json({ 
          message: 'User registered successfully!',
          token: token,
          user: {
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        });
      } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
});
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
          { userId: user._id, name: user.name, role: user.role },
          JWT_SECRET,
          { expiresIn: '1d' }
        );
        res.status(200).json({
          message: 'Logged in successfully!',
          token: token,
          user: {
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
});

// Private User Routes (Unchanged)
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error("Profile Get Error:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
});
app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, phone },
      { new: true }
    ).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.put('/api/profile/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.get('/api/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
                                  .sort({ createdAt: -1 });
        res.json(orders);
      } catch (error) {
        console.error("Orders Get Error:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
});
app.post('/api/checkout', authMiddleware, upload.single('txnProof'), async (req, res) => {
  try {
    const { email, name, room, txnId, cartItems, totalPrice, phone } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Payment proof is required.' });
    }
    const paymentProofUrl = `/uploads/${req.file.filename}`; 
    const parsedItems = JSON.parse(cartItems);
    const orderItems = parsedItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      product: item._id
    }));
    const newOrder = new Order({
      user: req.user.userId,
      items: orderItems, 
      totalPrice: Number(totalPrice),
      deliveryRoom: room,
      transactionId: txnId,
      paymentProofUrl: paymentProofUrl,
    });
    await newOrder.save();
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.quantity }
      });
    }
    const itemsHtml = parsedItems.map(item => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');
    const receiptHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h1 style="color: #4A90E2; text-align: center;">HostelMart</h1>
        <h2 style="text-align: center;">Your Order is Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Good news! We've received your order and payment. We'll deliver it to your room shortly.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <h3 style="margin-top: 0;">Delivery Details</h3>
          <p style="margin: 5px 0;"><strong>Delivering To:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Room / Note:</strong> ${room}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${newOrder._id}</p>
          <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${txnId}</p>
        </div>
        <h3 style="margin-top: 25px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #eee;">
            <tr>
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2em;">₹${newOrder.totalPrice}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 25px; font-size: 0.9em; color: #777; text-align: center;">
          Thank you for shopping with HostelMart!
        </p>
      </div>
    `;
    const emailMsg = {
      to: email,
      from: 'codewithsachin10@gmail.com',
      subject: `Your HostelMart Order [#${newOrder._id}] is Confirmed!`,
      html: receiptHtml,
    };
    await sgMail.send(emailMsg);
    if (phone) {
      try {
        const smsBody = `
HostelMart Order Confirmed!
Hi ${name}, your order #${newOrder._id} for ₹${newOrder.totalPrice} is confirmed.
Delivering to: ${room}
Check your email for the full receipt.
`.trim();
        console.log("SMS service successfully disabled.");
      } catch (smsError) {
        console.error("Twilio SMS Error:", smsError.message);
      }
    }
    if (phone) {
      User.findByIdAndUpdate(req.user.userId, { phone: phone }, { new: true })
        .catch(err => console.error("Failed to update user phone number:", err.message));
    }
    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error('Checkout Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Public Products Route (FIXED)
app.get('/api/products', async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};
    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.get('/api/addresses', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.addresses);
  } catch (error) {
    console.error("Address Get Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.post('/api/addresses', authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, room, isDefault } = req.body;
    if (!fullName || !phone || !room) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newAddress = { fullName, phone, room, isDefault: !!isDefault };
    const user = await User.findById(req.user.userId);
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    console.error("Address Post Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.delete('/api/addresses/:id', authMiddleware, async (req, res) => {
  try {
    const addressId = req.params.id;
    const user = await User.findById(req.user.userId);
    user.addresses.pull({ _id: addressId });
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error("Address Delete Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.put('/api/addresses/:id/default', authMiddleware, async (req, res) => {
  try {
    const addressId = req.params.id;
    const user = await User.findById(req.user.userId);
    user.addresses.forEach(addr => addr.isDefault = false);
    const defaultAddr = user.addresses.id(addressId);
    if (defaultAddr) {
      defaultAddr.isDefault = true;
    }
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error("Address Default Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Routes (Unchanged)
app.get('/api/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // FIX: Prepend the full URL to the payment proof before sending to client
    const ordersWithFullUrls = orders.map(order => ({
        ...order.toObject(),
        paymentProofUrl: `http://localhost:5001${order.paymentProofUrl}`
    }));

    res.json(ordersWithFullUrls);
  } catch (error) {
    console.error("Admin Get Orders Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => { /* ... (get all users) ... */ 
  try {
    const users = await User.find({ role: 'user' })
      .select('name email phone')
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error("Admin Get Users Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.put('/api/admin/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => { /* ... (update order status) ... */ 
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    if (status === 'Shipped') {
      const user = order.user;
      if (!user) {
        console.error("User not found for order, can't send 'Shipped' email.");
        return res.json(order);
      }
      const shippedHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h1 style="color: #4A90E2; text-align: center;">HostelMart</h1>
          <h2 style="text-align: center;">Your Order is on its Way!</h2>
          <p>Hi ${user.name},</p>
          <p>Good news! Your order (#${order._id}) has left our desk and is now out for delivery to <strong>${order.deliveryRoom}</strong>.</p>
          <p style="margin-top: 25px; font-size: 0.9em; color: #777; text-align: center;">
            Thank you for shopping with HostelMart!
          </p>
        </div>
      `;
      const emailMsg = {
        to: user.email,
        from: 'codewithsachin10@gmail.com',
        subject: `Your Snack Mart Order [#${order._id}] is on its way!`,
        html: shippedHtml,
      };
      await sgMail.send(emailMsg);
    } else if (status === 'Delivered') {
      const user = order.user;
      const deliveredHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h1 style="color: #4A90E2; text-align: center;">HostelMart</h1>
          <h2 style="text-align: center;">Order Delivered Successfully!</h2>
          <p>Hi ${user.name},</p>
          <p>Great news! Your HostelMart order (#${order._id}) has been delivered to your room, <strong>${order.deliveryRoom}</strong>.</p>
          <p>Thank you for shopping with us! Enjoy your snacks.</p>
          <p style="margin-top: 25px; font-size: 0.9em; color: #777; text-align: center;">
            — The HostelMart Team
          </p>
        </div>
      `;
      const emailMsg = {
        to: user.email,
        from: 'codewithsachin10@gmail.com',
        subject: `DELIVERED: Thank you for your order [#${order._id}]`,
        html: deliveredHtml,
      };
      await sgMail.send(emailMsg);
    }
    res.json(order);
  } catch (error) {
    console.error("Admin Update Status Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.post('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => { /* ... (create product) ... */ 
  try {
    const { name, price, countInStock } = req.body;
    if (!name || !price || countInStock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newProduct = new Product({
      name,
      price: Number(price),
      countInStock: Number(countInStock)
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Admin Create Product Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.put('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => { /* ... (update product) ... */ 
  try {
    const { name, price, countInStock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price: Number(price), countInStock: Number(countInStock) },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Admin Update Product Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.delete('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => { /* ... (delete product) ... */ 
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Admin Delete Product Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// --- 10. Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
