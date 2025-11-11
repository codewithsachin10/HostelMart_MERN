// client/src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import '../App.css';

// Get the base URL from the environment (will be localhost during dev, live URL in prod)
const BASE_API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'; 


function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    room: '',
    phone: '',
    txnId: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Auto-fill with Default Address ---
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      const token = localStorage.getItem('token');
      try {
        // 👇 Uses environment variable
        const response = await fetch(`${BASE_API_URL}/api/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const addresses = await response.json();
        if (!response.ok) throw new Error(addresses.message);
        
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setFormData(prevData => ({
            ...prevData,
            name: defaultAddress.fullName,
            phone: defaultAddress.phone,
            room: defaultAddress.room
          }));
        }
      } catch (error) {
        console.error("Failed to fetch default address:", error.message);
      }
    };

    fetchDefaultAddress();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please upload a payment screenshot.');
      return;
    }
    setLoading(true);
    setMessage('Placing order, please wait...');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('room', formData.room);
    data.append('phone', formData.phone);
    data.append('txnId', formData.txnId);
    data.append('txnProof', file);
    data.append('cartItems', JSON.stringify(cartItems));
    data.append('totalPrice', getCartTotal());

    try {
      const token = localStorage.getItem('token');
      // 👇 Uses environment variable
      const response = await fetch(`${BASE_API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to place order.');
      }

      setLoading(false);
      setMessage('Order placed successfully!');
      clearCart();
      
      // PASS ORDER ID
      navigate(`/success?orderId=${result.orderId}`); 

    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  return (
    <main className="container">
      <h1 className="section-title">Checkout</h1>
      <div className="checkout-layout">
        {/* --- Left Side: Order Summary --- */}
        <div className="card product cart-panel">
          <h3>Your Order Summary</h3>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item._id}>
                <span>{item.name} (x{item.quantity})</span>
                <strong>₹{item.price * item.quantity}</strong>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h2 id="total">Total: ₹{getCartTotal()}</h2>
          </div>
        </div>

        {/* --- Right Side: Payment Form --- */}
        <div className="card product cart-panel">
          <h3>Payment Details</h3>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email (for receipt)</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="room">Room / Delivery Note</label>
              <input type="text" id="room" name="room" value={formData.room} onChange={handleChange} placeholder="Room No. / Hostel" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number (for delivery)</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
            </div>
            
            <div className="payment-box">
              <h3>Pay using GPay</h3>
              <p>Scan this QR code to pay **₹{getCartTotal()}**:</p>
              <img src="/gpay-qr.png" alt="GPay QR Code" className="qr-code" />
            </div>
            <div className="form-group">
              <label htmlFor="txnId">Enter Transaction ID</label>
              <input type="text" id="txnId" name="txnId" value={formData.txnId} onChange={handleChange} placeholder="Paste UPI Transaction ID" required />
            </div>
            <div className="form-group">
              <label htmlFor="txnProof">Upload Payment Screenshot</label>
              <input type="file" id="txnProof" name="txnProof" onChange={handleFileChange} accept="image/*" required />
            </div>
            
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            {message && <p className="error-msg" style={{ marginTop: '1rem' }}>{message}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;