import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkOrderList = ({ workOrderId }) => {
  const [workOrder, setWorkOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/workorders/${workOrderId}`)
      .then(res => setWorkOrder(res.data))
      .catch(err => console.error(err));
  }, [workOrderId]);

  if (!workOrder) return <p>Loading Work Order...</p>;

  return (
    <div className="p-4 border">
      <h2 className="text-xl font-bold">Work Order #{workOrder.id}</h2>
      <p>{workOrder.description}</p>
    </div>
  );
};

export default WorkOrderList;
