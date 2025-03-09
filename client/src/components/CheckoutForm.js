import React from 'react';
import axios from 'axios';

const CheckoutForm = ({ workOrderId, selectedParts }) => {
  const handleCheckout = () => {
    axios.post('http://localhost:5000/api/checkout', { workOrderId, parts: selectedParts })
      .then(() => alert('Checkout Successful'))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-4 border">
      <h2 className="text-xl font-bold">Checkout Parts</h2>
      <ul>
        {selectedParts.map(part => (
          <li key={part.id}>{part.name} - {part.quantity} checked out</li>
        ))}
      </ul>
      <button onClick={handleCheckout} className="bg-red-500 text-white px-4 py-2 mt-2">Submit Checkout</button>
    </div>
  );
};

export default CheckoutForm;
