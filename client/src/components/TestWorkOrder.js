import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const TestWorkOrder = () => {
  const [createdId, setCreatedId] = useState(null);

  const generateWorkOrder = async () => {
    try {
      await axios.post(`${BASE_URL}/api/workorders/test`);
      alert('Test Work Order Created!');
    } catch (error) {
      console.error('Error creating test work order:', error);
    }
  };

  const printWorkOrder = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/workorders`);
      const latestWorkOrder = response.data[response.data.length - 1];
      setCreatedId(latestWorkOrder.id);
      window.open(`${BASE_URL}/api/workorders/print/${latestWorkOrder.id}`, '_blank');
    } catch (error) {
      console.error('Error printing work order:', error);
    }
  };

  return (
    <div>
      <button onClick={generateWorkOrder}>
        Create Test Work Order
      </button>
      <button onClick={printWorkOrder} disabled={!createdId}>
        Print Last Created Work Order
      </button>
    </div>
  );
};

export default TestWorkOrder;
