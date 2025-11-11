// client/src/pages/ContactPage.js
import React from 'react';
import '../App.css';

function ContactPage() {
  return (
    <main className="container">
      <h1 className="section-title">Contact Us</h1>
      <div className="card product cart-panel">
        <h2>We're here to help!</h2>
        <p style={{color: 'var(--muted)', fontSize: '1.1rem'}}>
          For any questions about your order, our products, or delivery, please feel free to reach out.
        </p>
        
        <div className="contact-details">
          <h3><span role="img" aria-label="phone">📞</span> Phone (Urgent Orders)</h3>
          <p>+91 99521 11626</p>
          
          <h3><span role="img" aria-label="email">📧</span> Email (General Support)</h3>
          <p>sachingopalakrishnan10@gmail.com</p>
          
          <h3><span role="img" aria-label="location">📍</span> Our Location</h3>
          <p>Room D-137, Main Hostel Block</p>
          <p>Rajalakshmi Habitat Hostel</p>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;