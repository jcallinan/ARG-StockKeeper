const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('./database');

// ✅ Get All Work Orders
router.get('/workorders', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM WorkOrders');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching work orders:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Get Single Work Order by ID
router.get('/workorders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM WorkOrders WHERE Id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).send('Work Order Not Found');
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching work order:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Create a Test Work Order
router.post('/workorders/test', async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query("INSERT INTO WorkOrders (Description, CreatedDate) OUTPUT INSERTED.Id VALUES ('Test Work Order', GETDATE())");
  
      const createdId = result.recordset[0].Id;
  
      res.json({ message: 'Test Work Order Created', id: createdId });
    } catch (err) {
      console.error('Error creating test work order:', err);
      res.status(500).send('Server Error');
    }
  });
  

// ✅ Print Work Order (for scanning)
router.get('/workorders/print/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM WorkOrders WHERE Id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).send('Work Order Not Found');
    }

    const workOrder = result.recordset[0];
    res.send(`
      <html>
      <body>
        <h1>Work Order #${workOrder.Id}</h1>
        <p>${workOrder.Description}</p>
        <p>Created Date: ${workOrder.CreatedDate}</p>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error printing work order:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Get Parts for a Specific Work Order
router.get('/parts/:workOrderId', async (req, res) => {
  const { workOrderId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('workOrderId', sql.Int, workOrderId)
      .query('SELECT * FROM WorkOrderDetails WHERE WorkOrderId = @workOrderId');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching parts:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Checkout Parts and Record Transactions
router.post('/checkout', async (req, res) => {
  const { workOrderId, parts } = req.body;

  if (!Array.isArray(parts) || parts.length === 0) {
    return res.status(400).send('No parts provided for checkout');
  }

  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    for (const part of parts) {
      await transaction.request()
        .input('workOrderId', sql.Int, workOrderId)
        .input('partName', sql.NVarChar, part.name)
        .input('quantity', sql.Int, part.quantity)
        .input('checkedOutDate', sql.DateTime, new Date())
        .query(`
          INSERT INTO Receipts (WorkOrderId, PartName, CheckedOutQuantity, CheckedOutDate)
          VALUES (@workOrderId, @partName, @quantity, @checkedOutDate);

          INSERT INTO Transactions (WorkOrderId, Action, ActionDate)
          VALUES (@workOrderId, CONCAT('Checked out ', @quantity, ' of ', @partName), GETDATE());
        `);
    }

    await transaction.commit();
    res.send('Parts checked out and transactions recorded');
  } catch (err) {
    console.error('Error during checkout:', err);
    res.status(500).send('Checkout Failed');
  }
});

// ✅ Default 404 Route for Undefined Endpoints
router.use((req, res) => {
  res.status(404).send('API Endpoint Not Found');
});

module.exports = router;
