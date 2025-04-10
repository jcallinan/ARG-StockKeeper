import React, { useState } from 'react';
import WorkOrderScanner from './WorkOrderScanner';
import TestWorkOrder from './TestWorkOrder';

const Home = ({ setWorkOrderId }) => {
  const [showTestWorkOrder, setShowTestWorkOrder] = useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Work Order Management</h1>

      <div style={styles.section}>
        <WorkOrderScanner setWorkOrderId={setWorkOrderId} />
      </div>

      <div style={styles.divider}></div>

      <div style={styles.section}>
        <button
          onClick={() => setShowTestWorkOrder(true)}
          style={styles.button}
        >
          Generate Test Work Order
        </button>
        {showTestWorkOrder && <TestWorkOrder />}
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
  section: {
    marginBottom: "10px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#000",
    margin: "10px 0",
  },
  button: {
    padding: "5px 15px",
    backgroundColor: "#666",
    color: "#fff",
    border: "1px solid #ff3333", // Red border for emphasis
    cursor: "pointer",
    width: "100%",
    fontSize: "14px",
  },
};

export default Home;