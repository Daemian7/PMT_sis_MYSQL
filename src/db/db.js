const mysql = require('mysql2');

// Crear el pool de conexiones con Promesas
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Vacío en XAMPP
  database: 'pmt_sanfe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportar correctamente con .promise()
module.exports = pool.promise();
