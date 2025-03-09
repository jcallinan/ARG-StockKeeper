import React, { useState } from 'react';

const WorkOrderScanner = ({ setWorkOrderId }) => {
  const [input, setInput] = useState('');

  const handleScan = () => {
    setWorkOrderId(input);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Scan or Enter Work Order ID"
        className="border p-2 mr-2"
      />
      <button onClick={handleScan} className="bg-blue-500 text-white px-4 py-2">Submit</button>
    </div>
  );
};

export default WorkOrderScanner;
