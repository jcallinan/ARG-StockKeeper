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
    <div style={styles.container}>
      <h2 style={styles.header}>Checkout Parts</h2>
      <ul style={styles.list}>
        {selectedParts.map((part) => (
          <li key={part.id} style={styles.listItem}>
            {part.name} - {part.quantity} units
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout} style={styles.button}>
        Submit Checkout
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "10px",
    border: "2px solid #000",
    borderRadius: "5px",
    backgroundColor: "#d3e4ff",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  },
  header: {
    textAlign: "center",
    fontSize: "16px",
    marginBottom: "10px",
    color: "#ff3333", // Red accent for the header
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 10px 0",
    backgroundColor: "#fff",
    border: "1px solid #000",
  },
  listItem: {
    padding: "5px",
    borderBottom: "1px solid #000",
    fontSize: "12px",
  },
  button: {
    padding: "5px 15px",
    backgroundColor: "#666",
    color: "#fff",
    border: "1px solid #ff3333", // Red border for the button
    cursor: "pointer",
    width: "100%",
    fontSize: "14px",
  },
};

export default CheckoutForm;