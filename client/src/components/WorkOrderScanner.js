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

    const part = workOrderParts.find((p) => p.PartName === partNo);
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
      quantity: quantity,
    };

    setParts((prev) => {
      const updated = [...prev, newPart];
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
    if (validatedParts[key]) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/inventory/${encodeURIComponent(PartName)}`
      );
      if (!response.ok) {
        alert("Error fetching inventory.");
        revertToPrevious(index);
        return;
      }

      const data = await response.json();
      const matching = data.recordset.find((item) => item.ShelfBin === ShelfBin);

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

      setValidatedParts((prev) => ({ ...prev, [key]: true }));
      savePartsSnapshot();
    } catch (err) {
      console.error("Validation error:", err);
      revertToPrevious(index);
    }
  };

  const revertToPrevious = (index) => {
    setParts((prev) => {
      const updated = [...prev];
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
      await axios.post(`${BASE_URL}/api/checkout`, { workOrderId, parts });
      alert("Parts checked out successfully.");
      setParts([]);
    } catch (error) {
      alert("Checkout failed. Please try again.");
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Check Out Parts</h2>

      {/* Form Fields */}
      <div style={styles.form}>
        <div style={styles.formRow}>
          <label style={styles.label}>Work Order:</label>
          <input
            type="text"
            value={workOrderId}
            onChange={(e) => setWorkOrderId(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formRow}>
          <label style={styles.label}>Employee:</label>
          <input
            type="text"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formRow}>
          <label style={styles.label}>Stockroom:</label>
          <input
            type="text"
            value={stockroom}
            onChange={(e) => setStockroom(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Parts Section */}
      <h3 style={styles.subHeader}>Parts</h3>
      <div style={styles.formRow}>
        <label style={styles.label}>Part No.:</label>
        <input
          type="text"
          value={partNo}
          onChange={(e) => setPartNo(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddPart} style={styles.button}>
          Add
        </button>
      </div>

      {/* Parts Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}></th>
              <th style={styles.tableHeader}>Part Name</th>
              <th style={styles.tableHeader}>Shelf/Bin</th>
              <th style={styles.tableHeader}>Qty</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, index) => (
              <tr key={index} style={styles.tableRow}>
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>
                  <input
                    type="text"
                    value={part.PartName || ""}
                    readOnly
                    style={styles.tableInput}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="text"
                    value={part.ShelfBin}
                    onChange={(e) =>
                      handleFieldChange(index, "ShelfBin", e.target.value)
                    }
                    onBlur={() => validateShelfBinAndQuantity(index)}
                    style={styles.tableInput}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="number"
                    value={part.quantity}
                    onChange={(e) =>
                      handleFieldChange(index, "quantity", e.target.value)
                    }
                    onBlur={() => validateShelfBinAndQuantity(index)}
                    style={styles.tableInput}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button onClick={handleSubmit} style={styles.submitButton}>
          Submit
        </button>
        <button style={styles.actionButton}>Edit Mode</button>
        <button style={styles.actionButton}>OK</button>
      </div>
    </div>
  );
};

// Inline styles to match the screenshot's aesthetic
const styles = {
  container: {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "10px",
    border: "2px solid #000",
    borderRadius: "5px",
    backgroundColor: "#d3e4ff", // Light blue background like in the screenshot
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  },
  header: {
    textAlign: "center",
    fontSize: "16px",
    marginBottom: "10px",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  label: {
    width: "100px",
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    flex: 1,
    padding: "5px",
    fontSize: "14px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  subHeader: {
    textAlign: "center",
    fontSize: "14px",
    margin: "10px 0 5px",
    color: "#000",
  },
  button: {
    padding: "5px 10px",
    backgroundColor: "#666",
    color: "#fff",
    border: "1px solid #000",
    cursor: "pointer",
  },
  tableContainer: {
    marginTop: "10px",
    maxHeight: "150px",
    overflowY: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#666",
    color: "#fff",
    padding: "5px",
    textAlign: "left",
    fontSize: "12px",
  },
  tableRow: {
    backgroundColor: "#fff",
  },
  tableCell: {
    padding: "5px",
    border: "1px solid #000",
    fontSize: "12px",
  },
  tableInput: {
    width: "100%",
    padding: "2px",
    fontSize: "12px",
    border: "none",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  submitButton: {
    padding: "5px 15px",
    backgroundColor: "#666",
    color: "#fff",
    border: "1px solid #000",
    cursor: "pointer",
  },
  actionButton: {
    padding: "5px 15px",
    backgroundColor: "#999",
    color: "#fff",
    border: "1px solid #000",
    cursor: "pointer",
  },
};

export default CheckoutParts;