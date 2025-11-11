// client/src/components/LoadingSpinner.js
import React from 'react';
import '../App.css'; // We'll add styles to this

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;