// client/src/pages/AdminPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import '../App.css'; 

function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchAllOrders = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
      setOrders(data);
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Handler to update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrder = await response.json();
      if (!response.ok) {
        throw new Error(updatedOrder.message || 'Failed to update status');
      }
      
      // Update the order in our local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    // Adding checks for order.user before accessing properties
    (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <main className="container"><h1 className="section-title">Loading All Orders...</h1></main>;
  }

  return (
    <main className="container admin-page">
      <h1 className="section-title">Admin Dashboard: All Orders</h1>
      <p>Welcome, admin {user.name}.</p>
      {message && <p className="error-msg">{message}</p>}

      <div className admin-section>
        <h2>All Orders ({filteredOrders.length})</h2>
        
        <div className="form-group">
          <input 
            type="search" 
            className="admin-search-bar"
            placeholder="Search by Order ID, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="orders-list">
          {filteredOrders.length === 0 && <p>No matching orders found.</p>}
          
          {filteredOrders.map((order) => (
            <div key={order._id} className={`card order-card status-${order.status.toLowerCase()}`}>
              <div className="order-header">
                <div>
                  <p className="order-info"><strong>Order ID:</strong> {order._id}</p>
                  <p className="order-info"><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                  {/* 👇 FIX: Defensive coding check (order.user?) */}
                  <p className="order-info"><strong>Customer:</strong> {order.user ? `${order.user.name} (${order.user.email})` : 'Unknown User'}</p>
                </div>
                <div>
                  <p className="order-info"><strong>Total:</strong> ₹{order.totalPrice}</p>
                  <p className="order-info"><strong>Room:</strong> {order.deliveryRoom}</p>
                  <p className="order-info">
                    <a 
                      href={order.paymentProofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Payment Proof
                    </a>
                  </p>
                </div>
              </div>
              
              <h4 className="order-items-title">Items:</h4>
              <ul className="order-items-list">
                {order.items.map((item) => (
                  <li key={item.product + item.name}> 
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              
              {/* Status Update Section with Buttons */}
              <div className="admin-status-update">
                {/* 1. New Buttons */}
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <div className="admin-quick-actions">
                    <button 
                      className="btn small-btn btn-delivered"
                      onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                    >
                      Delivered
                    </button>
                    <button 
                      className="btn small-btn btn-cancelled"
                      onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                    >
                      Cancelled
                    </button>
                  </div>
                )}

                {/* 2. Out for Delivery Button */}
                {order.status === 'Processing' && (
                  <button 
                    className="btn small-btn btn-out-for-delivery"
                    onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                  >
                    Mark as Out for Delivery
                  </button>
                )}
                
                {/* 3. Status Display */}
                {(order.status === 'Processing' || order.status === 'Shipped') ? (
                  <div className="status-select-wrapper">
                    <label htmlFor={`status-${order._id}`}>Change Status:</label>
                    <select 
                      id={`status-${order._id}`}
                      className={`status-select status-${order.status.toLowerCase()}`}
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                ) : (
                  <div className="status-select-wrapper">
                    <label>Final Status:</label>
                    <span className={`status-select status-${order.status.toLowerCase()}`}>
                        {order.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AdminPage;