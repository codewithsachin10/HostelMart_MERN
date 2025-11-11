// client/src/pages/CartPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../App.css';

function CartPage() {
  const { cartItems, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="container">
        <h1 className="section-title">Your Cart</h1>
        <div className="card product">
          <p className="empty-cart-message">Your cart is empty.</p>
          <Link to="/products" className="btn">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="section-title">Your Cart</h1>
      <div className="card product cart-panel">
        <ul className="cart-items">
          {cartItems.map((item) => (
            // 👇 MODIFIED: Use _id
            <li key={item._id}>
              <span>{item.name}</span>
              <div className="cart-controls">
                <button
                  className="btn quantity-btn"
                  onClick={() => updateQuantity(item._id, -1)}
                >
                  -
                </button>
                <span className="item-quantity">{item.quantity}</span>
                <button
                  className="btn quantity-btn"
                  onClick={() => updateQuantity(item._id, 1)}
                >
                  +
                </button>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <h2 id="total">Total: ₹{getCartTotal()}</h2>
          <Link to="/checkout" className="btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CartPage;