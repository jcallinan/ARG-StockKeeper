import React from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const CheckoutForm = ({ workOrderId, selectedParts }) => {
  const handleCheckout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/checkout`, {
        workOrderId,
        parts: selectedParts,
      });
      alert('Parts checked out successfully!');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <h2>Checkout Parts</h2>
      <ul>
        {selectedParts.map((part) => (
          <li key={part.id}>
            {part.name} - {part.quantity} units
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Submit Checkout</button>
    </div>
  );
};

export default CheckoutForm;
