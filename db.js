const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3309,
  user: 'root',      
  password: 'Sumbodro060405!',       
  database: 'apikey' 
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err);
  } else {
    console.log('✅ Terkoneksi ke database MySQL');
  }
});

module.exports = db;
