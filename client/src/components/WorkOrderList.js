import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const WorkOrderList = () => {
  const [workOrders, setWorkOrders] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    axios.get(`${BASE_URL}/api/workorders/`)
      .then((res) => setWorkOrders(res.data.recordset))
      .catch((err) => console.error('Error fetching work orders:', err));
  }, []);

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous screen
  };

  if (!workOrders) {
    return <p style={styles.loading}>Loading Work Orders...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>All Work Orders</h2>
      <div style={styles.listContainer}>
        {workOrders.map((workOrder) => (
          <div key={workOrder.Id} style={styles.workOrder}>
            <h3 style={styles.subHeader}>Work Order #{workOrder.Id}</h3>
            <p style={styles.text}>{workOrder.Description}</p>
            <p style={styles.text}>{workOrder.CreatedDate}</p>
          </div>
        ))}
      </div>
      {/* Add Cancel button */}
      <div style={styles.buttonContainer}>
        <button onClick={handleCancel} style={styles.cancelButton}>
          Cancel
        </button>
      </div>
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
  listContainer: {
    maxHeight: "300px",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #000",
  },
  workOrder: {
    padding: "10px",
    borderBottom: "1px solid #000",
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
  loading: {
    textAlign: "center",
    fontSize: "14px",
    color: "#000",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center", // Center the button
    marginTop: "10px",
  },
  cancelButton: {
    padding: "5px 15px",
    backgroundColor: "#999",
    color: "#fff",
    border: "1px solid #ff3333", // Red border to match the theme
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default WorkOrderList;