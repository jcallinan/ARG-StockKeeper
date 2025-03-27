import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const WorkOrderList = () => {
  const [workOrders, setWorkOrders] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/workorders/`)
      .then((res) => setWorkOrders(res.data))
      .catch((err) => console.error('Error fetching work orders:', err));
  }, []);

  if (!workOrders) {
    return <p>Loading Work Orders...</p>;
  }

  return (
    <div>
      <h2>All Work Orders</h2>
  {workOrders.map((workOrder) => 
(
    <div key={workOrder.id}>
      <h2>Work Order #{workOrder.id}</h2>
      <p>{workOrder.description}</p>
    </div>
  ))}
</div>)
};

export default WorkOrderList;
