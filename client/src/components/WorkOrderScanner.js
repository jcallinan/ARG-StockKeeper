import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
import { Link } from 'react-router-dom';

const WorkOrderScanner = ({ setWorkOrderId }) => {
  const [input, setInput] = useState('');

  const handleScan = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/workorders/${input}`);
      if (response.data) {
        setWorkOrderId(input);
      } else {
        alert('Work Order Not Found!');
      }
    } catch (error) {
      console.error('Error fetching work order:', error);
    }
  };

  return (
    <div className="menu-container">
      <h2>Scan or Enter Work Order ID</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter or Scan Work Order ID"
      />
      <button onClick={handleScan}>Submit</button>

      <br />
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default WorkOrderScanner;
