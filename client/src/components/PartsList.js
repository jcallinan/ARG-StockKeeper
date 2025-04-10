import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const PartsList = ({ workOrderId, setSelectedParts }) => {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/parts/${workOrderId}`)
      .then(res => setParts(res.data))
      .catch(err => console.error(err));
  }, [workOrderId]);

  const togglePartSelection = (part) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter(p => p.id !== part.id) : [...prev, part]
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Available Parts</h2>
      <div style={styles.tableContainer}>
        {parts.map((part) => (
          <div key={part.id} style={styles.partRow}>
            <span style={styles.partText}>{part.name} - {part.quantity} available</span>
            <button onClick={() => togglePartSelection(part)} style={styles.button}>
              Select
            </button>
          </div>
        ))}
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
  tableContainer: {
    backgroundColor: "#fff",
    border: "1px solid #000",
  },
  partRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px",
    borderBottom: "1px solid #000",
  },
  partText: {
    fontSize: "12px",
  },
  button: {
    padding: "2px 10px",
    backgroundColor: "#666",
    color: "#fff",
    border: "1px solid #ff3333", // Red border for the button
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default PartsList;