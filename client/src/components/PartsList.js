import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const PartsList = ({ workOrderId, setSelectedParts }) => {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/parts/${workOrderId}`)
      .then(res => setParts(res.data))
      .catch(err => console.error(err));
  }, [workOrderId]);

  const togglePartSelection = (part) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter(p => p.id !== part.id) : [...prev, part]
    );
  };

  return (
    <div>
      <h2>Available Parts</h2>
      {parts.map((part) => (
        <div key={part.id} className="flex justify-between">
          <p>{part.name} - {part.quantity} available</p>
          <button onClick={() => togglePartSelection(part)}>Select</button>
        </div>
      ))}
    </div>
  );
};

export default PartsList;
