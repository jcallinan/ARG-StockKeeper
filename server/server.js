const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const config = { user: 'your_user', password: 'your_password', server: 'your_server', database: 'work_orders_db' };

app.get('/api/workorders/:id', async (req, res) => {
  await sql.connect(config);
  const result = await sql.query(`SELECT * FROM WorkOrders WHERE Id = ${req.params.id}`);
  res.json(result.recordset[0]);
});

app.get('/api/parts/:workOrderId', async (req, res) => {
  await sql.connect(config);
  const result = await sql.query(`SELECT * FROM WorkOrderDetails WHERE WorkOrderId = ${req.params.workOrderId}`);
  res.json(result.recordset);
});

app.post('/api/checkout', async (req, res) => {
  await sql.connect(config);
  req.body.parts.forEach(async part => {
    await sql.query(`INSERT INTO Transactions (WorkOrderId, Action, ActionDate) VALUES (${req.body.workOrderId}, 'Checked out ${part.name}', GETDATE())`);
  });
  res.send('Checkout successful');
});

app.listen(5000, () => console.log('Server running on port 5000'));
