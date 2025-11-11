// client/src/pages/OrdersPage.js
import React, { useState, useEffect } from 'react';
import '../App.css'; 

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not authorized.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        
        setOrders(data);
        if (data.length === 0) {
          setMessage('You have not placed any orders yet.');
        }

      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <main className="container"><h1 className="section-title">Loading Orders...</h1></main>;
  }

  return (
    <main className="container orders-page">
      <h1 className="section-title">My Orders</h1>
      
      {message && <p className="empty-cart-message">{message}</p>}

      <div className="orders-list">
        {orders.map((order) => (
          // 👇 MODIFIED: Added dynamic class for status color
          <div key={order._id} className={`card order-card status-${order.status.toLowerCase()}`}>
            <div className="order-header">
              <div>
                <p className="order-info"><strong>Order ID:</strong> {order._id}</p>
                <p className="order-info"><strong>Date:</strong> {formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="order-info"><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p className="order-info">
                  <strong>Status:</strong> 
                  {/* 👇 MODIFIED: Added dynamic class for status color */}
                  <span className={`order-status status-text-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
            
            <h4 className="order-items-title">Items in this order:</h4>
            <ul className="order-items-list">
              {order.items.map((item) => (
                <li key={item.id}>
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

export default OrdersPage;