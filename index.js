const express = require('express');
const path = require('path');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route utama kirim index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔑 Route untuk generate API key dengan prefix
app.post('/apikeyc/create', (req, res) => {
  try {
    const rawKey = crypto.randomBytes(32).toString('hex');
    const apiKey = `sk-itumy-v1-api_${rawKey}`;

    const query = 'INSERT INTO apikeys (api_key) VALUES (?)';
    db.query(query, [apiKey], (err, result) => {
      if (err) {
        console.error('❌ Gagal menyimpan API key:', err);
        return res.status(500).json({
          success: false,
          message: 'Gagal menyimpan API key ke database'
        });
      }

      res.json({
        success: true,
        apiKey: apiKey
      });
    });
  } catch (err) {
    console.error('Error generate API key:', err);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat API key'
    });
  }
});


app.post('/checkapi', (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API key tidak ditemukan dalam request body'
      });
    }

    const query = 'SELECT * FROM apikeys WHERE api_key = ?';
    db.query(query, [apiKey], (err, results) => {
      if (err) {
        console.error('❌ Error saat cek API key:', err);
        return res.status(500).json({
          success: false,
          message: 'Terjadi kesalahan saat memeriksa API key'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'API key tidak valid atau tidak terdaftar'
        });
      }
       res.json({
        success: true,
        message: 'API key valid dan terdaftar di database'
      });
    });
  }catch (err) {
    console.error('Error checking API key:', err);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memeriksa API key'
    });
  }
});


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
