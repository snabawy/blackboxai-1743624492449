const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'schoolai_schoolsync',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;