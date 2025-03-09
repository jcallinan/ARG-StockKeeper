import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PartsList = ({ workOrderId, setSelectedParts }) => {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/parts/${workOrderId}`)
      .then(res => setParts(res.data))
      .catch(err => console.error(err));
  }, [workOrderId]);

  const togglePartSelection = (part) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter(p => p.id !== part.id) : [...prev, part]
    );
  };

  return (
    <div className="p-4 border">
      <h2 className="text-xl font-bold">Available Parts</h2>
      {parts.map((part) => (
        <div key={part.id} className="flex justify-between">
          <p>{part.name} - {part.quantity} available</p>
          <button onClick={() => togglePartSelection(part)} className="bg-green-500 text-white px-2 py-1">Select</button>
        </div>
      ))}
    </div>
  );
};

export default PartsList;
