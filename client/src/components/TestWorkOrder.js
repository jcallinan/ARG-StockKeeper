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

      // Fetch the newly created work order details
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
    <div className="menu-container">
      <h2>Generate Test Work Order</h2>

      <button onClick={generateWorkOrder}>Create Test Work Order</button>

      {createdWorkOrder && (
        <div>
          <h3>Created Work Order:</h3>
          <p>ID: {createdWorkOrder.Id}</p>
          <p>Description: {createdWorkOrder.Description}</p>
          <p>Created Date: {createdWorkOrder.CreatedDate}</p>
          <button onClick={printWorkOrder}>Print Work Order</button>
        </div>
      )}

      <br />
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default TestWorkOrder;
