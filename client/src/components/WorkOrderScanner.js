import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

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
    <div>
      <h2>Scan or Enter Work Order ID</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter or Scan Work Order ID"
      />
      <button onClick={handleScan}>Submit</button>
    </div>
  );
};

export default WorkOrderScanner;
