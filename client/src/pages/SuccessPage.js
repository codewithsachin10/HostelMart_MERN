// client/src/pages/SuccessPage.js
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../App.css';

function SuccessPage() {
  const [orderId, setOrderId] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('orderId');
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  return (
    <main className="container">
      <div className="success-container">
        <div className="card success-card">
          <h1>🎉 Order Confirmed</h1>
          
          <p id="order-msg">Thank you — your order has been received.</p>
          
          {orderId && (
            <div className="order-tracking-info">
              <p><strong>Tracking Order ID:</strong></p>
              <p className="order-id-display">{orderId}</p>
            </div>
          )}

          <p className="muted">
            A confirmation email has been sent to your email address.
          </p>
          <Link className="btn" to="/products">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default SuccessPage;