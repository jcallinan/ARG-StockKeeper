import React, { useState } from 'react';
import WorkOrderScanner from './components/WorkOrderScanner';
import WorkOrderList from './components/WorkOrderList';
import PartsList from './components/PartsList';
import CheckoutForm from './components/CheckoutForm';

const App = () => {
  const [workOrderId, setWorkOrderId] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Work Order Management</h1>
      <WorkOrderScanner setWorkOrderId={setWorkOrderId} />
      {workOrderId && (
        <>
          <WorkOrderList workOrderId={workOrderId} />
          <PartsList workOrderId={workOrderId} setSelectedParts={setSelectedParts} />
          <CheckoutForm workOrderId={workOrderId} selectedParts={selectedParts} />
        </>
      )}
    </div>
  );
};

export default App;
