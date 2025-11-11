// client/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import '../App.css'; 

function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const token = localStorage.getItem('token');
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // 1. Fetch user data on page load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setMessage('You are not authorized.');
        return;
      }
      try {
        const response = await fetch('http://localhost:5001/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }
        setUser({
          name: data.name,
          email: data.email,
          phone: data.phone || ''
        });
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchProfile();
  }, [token]);

  // 2. Handle form input changes
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Handle form submission (Update Profile)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('Updating...');
    try {
      const response = await fetch('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update');
      }
      setMessage('Profile saved successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  // 4. Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('Updating...');
    
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5001/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      setPasswordMessage('Password changed successfully!');
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setPasswordMessage(error.message);
    }
  };

  return (
    <main className="container profile-page">
      <h1 className="section-title">Your Profile</h1>
      
      {/* --- FORM 1: Account Details --- */}
      <div className="card product cart-panel">
        <form onSubmit={handleUpdateProfile}>
          <h2>Account Details</h2>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={user.name} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={user.email} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={user.phone} onChange={handleChange} placeholder="e.g., +91 98765 43210" />
          </div>
          
          <button type="submit" className="btn">Save Changes</button>
          {message && <p className="success-msg" style={{marginTop: '10px'}}>{message}</p>}
        </form>
      </div>
      
      {/* --- FORM 2: Change Password --- */}
      <div className="card product cart-panel">
        <form onSubmit={handleChangePassword}>
          <h2>Change Password</h2>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn">Change Password</button>
          {passwordMessage && <p className="error-msg" style={{marginTop: '10px'}}>{passwordMessage}</p>}
        </form>
      </div>
    </main>
  );
}

export default ProfilePage;