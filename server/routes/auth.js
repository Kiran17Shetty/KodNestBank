const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// POST /api/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        // Check if user exists
        const [existing] = await pool.query(
            'SELECT uid FROM KodUser WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const uid = crypto.randomUUID();

        await pool.query(
            'INSERT INTO KodUser (uid, username, email, password, phone, balance, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uid, username, email, hashedPassword, phone || null, 100000.00, 'Customer']
        );

        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const [users] = await pool.query(
            'SELECT * FROM KodUser WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { role: user.role },
            JWT_SECRET,
            { subject: user.username, expiresIn: '1h' }
        );

        // Save token to UserToken table
        const expiry = new Date(Date.now() + 3600000); // 1 hour
        await pool.query(
            'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
            [token, user.uid, expiry]
        );

        // Set HttpOnly cookie
        res.cookie('token', token, req.app.get('cookieOptions'));

        res.status(200).json({ message: 'Login successful', username: user.username });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/getBalance
router.get('/getBalance', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Session expired, please login again' });
        }

        const username = decoded.sub;
        const [users] = await pool.query(
            'SELECT balance FROM KodUser WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ balance: parseFloat(users[0].balance) });
    } catch (err) {
        console.error('GetBalance error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/logout
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (token) {
            await pool.query('DELETE FROM UserToken WHERE token = ?', [token]);
        }

        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/me
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Session expired, please login again' });
        }

        const username = decoded.sub;
        const role = decoded.role;

        // Get uid
        const [users] = await pool.query(
            'SELECT uid FROM KodUser WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ username, role, uid: users[0].uid });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
