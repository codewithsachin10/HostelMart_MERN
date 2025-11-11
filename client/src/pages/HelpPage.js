// client/src/pages/HelpPage.js
import React from 'react';
import '../App.css';

// A simple Accordion/Toggle component
const FaqItem = ({ question, answer }) => {
  return (
    <details className="faq-item">
      <summary className="faq-question">{question}</summary>
      <p className="faq-answer">{answer}</p>
    </details>
  );
};

function HelpPage() {
  return (
    <main className="container">
      <h1 className="section-title">Help & FAQ</h1>
      <div className="card product cart-panel">
        <FaqItem
          question="How long does delivery take?"
          answer="We are located on campus! All orders are typically delivered within 30-45 minutes. You will receive an SMS when your order is out for delivery."
        />
        <FaqItem
          question="What are your hours of operation?"
          answer="We are open from 9:00 AM to 1:00 AM, seven days a week."
        />
        <FaqItem
          question="What payment methods do you accept?"
          answer="We currently accept payments via GPay (UPI). Just scan the QR code on the checkout page and upload a screenshot of your payment."
        />
        <FaqItem
          question="My order status says 'Processing', what does that mean?"
          answer="This means we have received your order and are currently preparing it. You will be notified when it is 'Shipped' (on its way)."
        />
        <FaqItem
          question="How can I contact you about an order?"
          answer="Please see our 'Contact' page for our support phone number and email address."
        />
      </div>
    </main>
  );
}

export default HelpPage;