import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
import { Link } from 'react-router-dom';

const TestWorkOrder = () => {
  const [createdId, setCreatedId] = useState(null);
  const [createdWorkOrder, setCreatedWorkOrder] = useState(null);

  const generateWorkOrder = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/workorders/test`);
      setCreatedId(response.data.id);

      const details = await axios.get(`${BASE_URL}/api/workorders/${response.data.id}`);
      setCreatedWorkOrder(details.data);

      alert('Test Work Order Created!');
    } catch (error) {
      console.error('Error creating test work order:', error);
    }
  };

  const printWorkOrder = () => {
    window.open(`${BASE_URL}/api/workorders/print/${createdId}`, '_blank');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Generate Test Work Order</h2>

      <button onClick={generateWorkOrder} style={styles.button}>
        Create Test Work Order
      </button>

      {createdWorkOrder && (
        <div style={styles.details}>
          <h3 style={styles.subHeader}>Created Work Order:</h3>
          <p style={styles.text}>ID: {createdWorkOrder.Id}</p>
          <p style={styles.text}>Description: {createdWorkOrder.Description}</p>
          <p style={styles.text}>Created Date: {createdWorkOrder.CreatedDate}</p>
          <button onClick={printWorkOrder} style={styles.button}>
            Print Work Order
          </button>
        </div>
      )}

      <Link to="/" style={styles.backButton}>
        Back to Home
      </Link>
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
  button: {
    padding: "5px 15px",
    backgroundColor: "#666",
    color: "#fff",
    border: "1px solid #ff3333", // Red border for buttons
    cursor: "pointer",
    width: "100%",
    margin: "5px 0",
    fontSize: "14px",
  },
  details: {
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  subHeader: {
    fontSize: "14px",
    marginBottom: "5px",
    color: "#000",
  },
  text: {
    fontSize: "12px",
    margin: "2px 0",
  },
  backButton: {
    display: "block",
    textAlign: "center",
    marginTop: "10px",
    color: "#ff3333", // Red color for the link
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default TestWorkOrder;