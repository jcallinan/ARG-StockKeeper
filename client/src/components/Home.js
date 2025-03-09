import React, { useState } from 'react';
import WorkOrderScanner from './WorkOrderScanner';
import TestWorkOrder from './TestWorkOrder';

const Home = ({ setWorkOrderId }) => {
  const [showTestWorkOrder, setShowTestWorkOrder] = useState(false);

  return (
    <div>
      <h1>Work Order Management</h1>

      <div className="section">
        <WorkOrderScanner setWorkOrderId={setWorkOrderId} />
      </div>

      <div className="divider"></div>

      <div className="section">
        <button onClick={() => setShowTestWorkOrder(true)}>
          Generate Test Work Order
        </button>
        {showTestWorkOrder && <TestWorkOrder />}
      </div>
    </div>
  );
};

export default Home;
