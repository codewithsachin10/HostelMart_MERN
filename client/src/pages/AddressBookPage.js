// client/src/pages/AddressBookPage.js
import React, { useState, useEffect } from 'react';
import '../App.css';

// This is a new, separate component for the form
const AddressForm = ({ onAddressAdded }) => {
  // MODIFIED: Renamed 'name' state to 'fullName'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5001/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // MODIFIED: Send 'fullName'
        body: JSON.stringify({ fullName, phone, room }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save address');
      }

      // Clear the form
      setFullName('');
      setPhone('');
      setRoom('');
      setMessage('Address saved!');
      
      onAddressAdded(data); 

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card product cart-panel">
      <h3>Add a New Address</h3>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          {/* MODIFIED: Bind to 'fullName' state */}
          <input type="text" id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
        </div>
        <div className="form-group">
          <label htmlFor="room">Room / Delivery Note</label>
          <input type="text" id="room" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room No. / Hostel" required />
        </div>
        <button type="submit" className="btn">Save Address</button>
        {message && <p className="success-msg">{message}</p>}
      </form>
    </div>
  );
};


// This is the main page component
function AddressBookPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5001/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch');
      setAddresses(data);
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  // Fetch addresses on page load
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete');
      setAddresses(data);
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  const setDefault = async (addressId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to set default');
      setAddresses(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <main className="container"><h1 className="section-title">Loading Address Book...</h1></main>;
  }

  return (
    <main className="container profile-page">
      <h1 className="section-title">My Address Book</h1>
      
      <div className="address-layout">
        <div className="address-list">
          {addresses.length === 0 && <p>You have no saved addresses.</p>}
          {message && <p className="error-msg">{message}</p>}
          
          {addresses.map((addr) => (
            <div key={addr._id} className="card product address-card">
              {/* MODIFIED: Use 'fullName' */}
              <h4>{addr.fullName} {addr.isDefault && <span>(Default)</span>}</h4>
              <p>{addr.phone}</p>
              <p>{addr.room}</p>
              <div className="address-actions">
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr._id)} className="btn small-btn">
                    Set as Default
                  </button>
                )}
                <button onClick={() => handleDelete(addr._id)} className="btn small-btn muted-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <AddressForm onAddressAdded={(newAddresses) => setAddresses(newAddresses)} />
      </div>
    </main>
  );
}

export default AddressBookPage;