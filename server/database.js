const sql = require('mssql');

// SQL Server Configuration
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server', // e.g., 'localhost' or '127.0.0.1'
  database: 'work_orders_db',
  options: {
    encrypt: true, // Use this if you're on Azure
    enableArithAbort: true,
    trustServerCertificate: true // Use true if using a self-signed certificate
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create a Singleton Connection Pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database Connection Failed!', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
