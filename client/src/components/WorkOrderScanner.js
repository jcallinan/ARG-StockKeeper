import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const CheckoutParts = () => {
  const [workOrderId, setWorkOrderId] = useState("");
  const [employee, setEmployee] = useState("");
  const [stockroom, setStockroom] = useState("MAIN");
  const [partNo, setPartNo] = useState("");
  const [parts, setParts] = useState([]);
  const [validatedParts, setValidatedParts] = useState({});
  const [workOrderParts, setWorkOrderParts] = useState([]);
  
  // Track last known good values
  const [prevParts, setPrevParts] = useState([...parts]);


  const savePartsSnapshot = () => {
    setPrevParts([...parts]);
  };

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
    const quantity = 1;
    const index = parts.length;

    const newPart = {
      id: part.WorkOrderId,
      PartName: part.PartName,
      ShelfBin: part.ShelfBin,
      quantity: quantity
    };

    setParts((prev) => {
      const updated = [...prev, newPart];
      // Save snapshot immediately after set
      setTimeout(() => setPrevParts(updated), 0);
      return updated;
    });

    const key = `${index}-${part.PartName}-${part.ShelfBin}-1`;
    setValidatedParts((prev) => ({ ...prev, [key]: true }));
    setPartNo("");
  };


  const handleFieldChange = (index, field, value) => {
    setParts((prevParts) => {
      const updated = [...prevParts];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const validateShelfBinAndQuantity = async (index) => {
    const part = parts[index];
    const { PartName, ShelfBin, quantity } = part;
  
    if (!PartName || !ShelfBin || !quantity) return;
  
    const key = `${index}-${PartName}-${ShelfBin}-${quantity}`;
    if (validatedParts[key]) return; // Already validated
  
    try {
      const response = await fetch(`${BASE_URL}/api/inventory/${encodeURIComponent(PartName)}`);
      if (!response.ok) {
        alert("Error fetching inventory.");
        revertToPrevious(index);
        return;
      }
  
      const data = await response.json();
      const matching = data.recordset.find(
        (item) => item.ShelfBin === ShelfBin
      );
  
      if (!matching) {
        alert(`Shelf/bin "${ShelfBin}" does not exist for part "${PartName}".`);
        revertToPrevious(index);
        return;
      }
  
      if (Number(quantity) > matching.Quantity) {
        alert(
          `Not enough quantity in ${ShelfBin} for ${PartName}. Available: ${matching.Quantity}, Requested: ${quantity}`
        );
        revertToPrevious(index);
        return;
      }
  
      // ✅ All good – mark as validated
      setValidatedParts((prev) => ({ ...prev, [key]: true }));
      savePartsSnapshot(); // <-- manually save the snapshot here

    } catch (err) {
      console.error("Validation error:", err);
      revertToPrevious(index);
    }
  };
  

  const revertToPrevious = (index) => {
    setParts((prev) => {
      console.log(prev);
      const updated = [...prev];
      console.log(prevParts[index]);
      if (prevParts[index]) {
        updated[index] = { ...prevParts[index] };
      }
      return updated;
    });
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
              <td>        <input type="text" value={part.PartName || ''} readOnly />
              </td>
              <td><input type="text" value={part.ShelfBin}    onChange={(e) =>
                  handleFieldChange(index, "ShelfBin", e.target.value)
                }
                onBlur={() => validateShelfBinAndQuantity(index)} /></td>
              <td><input type="number" value={part.quantity}   onChange={(e) =>
                  handleFieldChange(index, "quantity", e.target.value)
                }
                onBlur={() => validateShelfBinAndQuantity(index)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CheckoutParts;
