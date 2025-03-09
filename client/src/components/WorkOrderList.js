import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const WorkOrderList = ({ workOrderId }) => {
  const [workOrder, setWorkOrder] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/workorders/${workOrderId}`)
      .then((res) => setWorkOrder(res.data))
      .catch((err) => console.error('Error fetching work order:', err));
  }, [workOrderId]);

  if (!workOrder) {
    return <p>Loading Work Order...</p>;
  }

  return (
    <div>
      <h2>Work Order #{workOrder.id}</h2>
      <p>{workOrder.description}</p>
    </div>
  );
};

export default WorkOrderList;
