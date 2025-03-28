import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const CheckoutParts = () => {
  const [workOrderId, setWorkOrderId] = useState("");
  const [employee, setEmployee] = useState("");
  const [stockroom, setStockroom] = useState("MAIN");
  const [partNo, setPartNo] = useState("");
  const [parts, setParts] = useState([]);
  const [workOrderParts, setWorkOrderParts] = useState([]);

  useEffect(() => {
    if (workOrderId) {
      fetchWorkOrderParts(workOrderId);
    }
  }, [workOrderId]);

  const fetchWorkOrderParts = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/workorders/${id}`);
      setWorkOrderParts(response.data.parts);
    } catch (error) {
      console.error("Error fetching work order parts:", error);
    }
  };

  const handleAddPart = () => {
    if (!partNo.trim()) return;

    const part = workOrderParts.find(p => p.PartName === partNo);
    if (!part) {
      alert("Part not found in work order.");
      return;
    }

    setParts([...parts, { id: part.WorkOrderId, name: part.PartName, ShelfBin: part.ShelfBin, quantity: 1 }]);
    setPartNo("");
  };

  const handleSubmit = async () => {
    if (!workOrderId || parts.length === 0) {
      alert("Please enter Work Order ID and at least one part.");
      return;
    }
    try {
      await axios.post("${BASE_URL}/api/checkout", { workOrderId, parts });
      alert("Parts checked out successfully.");
      setParts([]);
    } catch (error) {
      alert("Checkout failed. Please try again.");
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="menu-container">
      <h2>Check Out Parts</h2>
      <div>
        <label>Work Order ID</label>
        <input type="text" value={workOrderId} onChange={(e) => setWorkOrderId(e.target.value)} />
      </div>
      <div>
        <label>Employee</label>
        <input type="text" value={employee} onChange={(e) => setEmployee(e.target.value)} />
      </div>
      <h3>Parts</h3>
      <div>
        
        <div style={{ display: "flex", gap: "10px" }}>
        <label style={{width:"100px"}}>Part No.</label>
          <input type="text" value={partNo} onChange={(e) => setPartNo(e.target.value)}   style={{width:"100%"}} />
          <button onClick={handleAddPart} style={{ width:"100px"}}>Add</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Part No.</th>
            <th>Part Name</th>
            <th>Shelf/Bin</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{part.name}</td>
              <td>{part.ShelfBin}</td>
              <td>{part.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CheckoutParts;
