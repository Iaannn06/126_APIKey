const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;
const db = require('./models');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Folder frontend

// 1. REGISTER & GENERATE KEY
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        // Generate Key Acak
        const newApiKey = crypto.randomBytes(16).toString('hex');

        const newUser = await db.User.create({
            firstName, lastName, email, api_key: newApiKey, status: 'Aktif'
        });
        res.status(201).json({ success: true, message: 'Berhasil', data: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan user (Email mungkin duplikat)' });
    }
});

// 2. ADMIN LOGIN
app.post('/admin-login', (req, res) => {
    const { email, password } = req.body;
    // Login Hardcode
    if (email === 'admin@admin.com' && password === 'admin') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Login Gagal' });
    }
});

// 3. GET ALL USERS (Untuk Dashboard)
app.get('/users', async (req, res) => {
    const users = await db.User.findAll();
    res.json(users);
});

// 4. DELETE USER
app.delete('/users/:id', async (req, res) => {
    try {
        await db.User.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus' });
    }
});


app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
