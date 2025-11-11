// client/src/pages/AdminAnnouncementPage.js
import React, { useState } from 'react';
import '../App.css'; 

function AdminAnnouncementPage() {
  const [subject, setSubject] = useState('IMPORTANT: Shop Status Update');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const defaultMessage = "Our shop will be closed today, [Date]. All orders placed will be fulfilled the following day. Thank Quixk Delivery Guaranteed! you for your understanding!";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Sending announcements...');

    const finalMessage = message || defaultMessage;

    try {
      // FIX: Use the correct, hardcoded API URL
      const response = await fetch('http://localhost:5001/api/admin/announce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message: finalMessage }),
      });

      const data = await response.json();
      
      // Check if response status is OK
      if (!response.ok) {
        throw new Error(data.message || `Server Error: ${response.status}`);
      }
      
      setStatusMessage(data.message);
      setMessage(''); 

    } catch (error) {
      setStatusMessage(`Error: ${error.message}. Check your console.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container admin-page">
      <h1 className="section-title">Global Announcement System</h1>
      
      <div className="address-layout">
        <div className="admin-section" style={{gridColumn: '1 / -1'}}>
          <div className="card product cart-panel">
            <h3>Send Mail to All Users</h3>
            <form className="checkout-form" onSubmit={handleSubmit}>
              
              <div className="form-group"> {/* FIX: Added className="form-group" */}
                <label htmlFor="subject">Email Subject Line</label>
                <input 
                  type="text" 
                  id="subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  required 
                  aria-required="true" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Custom Announcement Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  placeholder={defaultMessage}
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  aria-label="Custom announcement message"
                ></textarea>
                <p style={{fontSize: '0.85em', color: 'var(--muted)', marginTop: '5px'}}>
                    *If you leave the box empty, the default message will be sent.
                </p>
              </div>

              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Announce to All Users'}
              </button>

              {statusMessage && <p className={`success-msg ${statusMessage.includes('Error') || statusMessage.includes('failed') ? 'error-msg' : 'success-msg'}`} style={{marginTop: '15px'}}>{statusMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminAnnouncementPage;
