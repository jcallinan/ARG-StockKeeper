import React, { useState, useEffect } from "react";
import axios from "axios";

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
      const response = await axios.get(`/workorders/${id}`);
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

    setParts([...parts, { id: part.WorkOrderId, name: part.PartName, quantity: 1 }]);
    setPartNo("");
  };

  const handleSubmit = async () => {
    if (!workOrderId || parts.length === 0) {
      alert("Please enter Work Order ID and at least one part.");
      return;
    }
    try {
      await axios.post("/checkout", { workOrderId, parts });
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
    
      <div>
        <label>Part No.</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" value={partNo} onChange={(e) => setPartNo(e.target.value)} />
          <button onClick={handleAddPart}>Add</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Part No.</th>
            <th>Part Name</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{part.name}</td>
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
