const express = require('express');
const bwipjs = require('bwip-js');
const router = express.Router();
const { sql, poolPromise } = require('./database');

// ✅ Create a Test Work Order with Parts
router.post('/workorders/test', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query("INSERT INTO WorkOrders (Description, CreatedDate) OUTPUT INSERTED.Id VALUES ('Test Work Order', GETDATE())");

    const createdId = result.recordset[0].Id;

    // Insert sample parts for the new work order
    await pool.request()
      .query(`
        INSERT INTO WorkOrderDetails (WorkOrderId, PartName, Quantity, ShelfBin)
        VALUES 
          (${createdId}, 'Part A', 10, 'Shelf 2'),
          (${createdId}, 'Part B', 5, 'Shelf 2'),
          (${createdId}, 'Part C', 7, 'Shelf 2')
      `);

    res.json({ message: 'Test Work Order Created with Parts', id: createdId });
  } catch (err) {
    console.error('Error creating test work order:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Get Single Work Order with Parts
router.get('/workorders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;

    // Fetch the work order details
    const workOrderResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM WorkOrders WHERE Id = @id');

    if (!workOrderResult.recordset.length) {
      return res.status(404).send('Work Order Not Found');
    }

    // Fetch associated parts for the work order
    const partsResult = await pool.request()
      .input('workOrderId', sql.Int, id)
      .query('SELECT * FROM WorkOrderDetails WHERE WorkOrderId = @workOrderId');

    res.json({
      ...workOrderResult.recordset[0],
      parts: partsResult.recordset
    });
  } catch (err) {
    console.error('Error fetching work order:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Get a List of All Work Orders
router.get('/workorders/', async (req, res) => {
  try {
    const pool = await poolPromise;

    // Fetch the work order details
    const workOrderResult = await pool.request()
      .query('SELECT * FROM WorkOrders');

    if (!workOrderResult.recordset.length) {
      return res.status(404).send('No Work Orders Found');
    }

    res.json({
      ...workOrderResult
    });
  } catch (err) {
    console.error('Error fetching work order:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Print Work Order with Barcodes
router.get('/workorders/print/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;

    const workOrderResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM WorkOrders WHERE Id = @id');

    if (!workOrderResult.recordset.length) {
      return res.status(404).send('Work Order Not Found');
    }

    const workOrder = workOrderResult.recordset[0];

    const partsResult = await pool.request()
      .input('workOrderId', sql.Int, id)
      .query('SELECT * FROM WorkOrderDetails WHERE WorkOrderId = @workOrderId');

    // Generate barcode for the work order
    const workOrderBarcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: workOrder.Id.toString(),
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    });

    const workOrderBarcodeImage = `data:image/png;base64,${workOrderBarcodeBuffer.toString('base64')}`;

    // Generate barcodes for each part
    const partsHtml = await Promise.all(partsResult.recordset.map(async (part) => {
      const partBarcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128',
        text: part.PartName,
        scale: 2,
        height: 8,
        includetext: true,
        textxalign: 'center',
      });

      const partBarcodeImage = `data:image/png;base64,${partBarcodeBuffer.toString('base64')}`;

      return `
        <tr>
          <td>${part.PartName}</td>
          <td>${part.Quantity}</td>
          <td>${part.ShelfBin}</td>
          <td><img src="${partBarcodeImage}" alt="Barcode for ${part.PartName}" /></td>
        </tr>`;
    }));

    res.send(`
      <html>
        <body>
          <h1>Work Order #${workOrder.Id}</h1>
          <p>${workOrder.Description}</p>
          <p>Created Date: ${new Date(workOrder.CreatedDate).toLocaleDateString()}</p>
          <div>
            <img src="${workOrderBarcodeImage}" alt="Work Order Barcode" />
          </div>
          <h2>Parts List</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Part Name</th>
                <th>Quantity</th>
                 <th>Shelf/Bin</th>
                <th>Barcode</th>
              </tr>
            </thead>
            <tbody>
              ${partsHtml.join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error printing work order:', err);
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
        .query(`
          INSERT INTO Receipts (WorkOrderId, PartName, CheckedOutQuantity, CheckedOutDate)
          VALUES (@workOrderId, @partName, @quantity, GETDATE());

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
