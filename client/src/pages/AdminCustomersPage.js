// client/src/pages/AdminCustomersPage.js
import React, { useState, useEffect } from 'react';
import '../App.css'; 

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        setCustomers(data);
      } catch (error) {
        console.error(error.message);
        setMessage(error.message);
      }
      setLoading(false);
    };
    fetchAllCustomers();
  }, [token]);

  if (loading) {
    return <main className="container"><h1 className="section-title">Loading Customers...</h1></main>;
  }

  return (
    <main className="container admin-page">
      <h1 className="section-title">All Customers ({customers.length})</h1>
      {message && <p className="error-msg">{message}</p>}
      <div className="customer-list">
        {customers.length === 0 && <p>No customers found.</p>}
        {customers.map((customer) => (
          <div key={customer._id} className="card customer-card">
            <h4>{customer.name}</h4>
            <p>{customer.email}</p>
            <p>{customer.phone || 'No phone number'}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminCustomersPage;