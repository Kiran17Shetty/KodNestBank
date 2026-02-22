const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { initDB } = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Make cookie settings available to routes
app.set('cookieOptions', {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
});

// Routes
app.use('/api', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'KodBank API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            'POST /api/register': 'Register a new user',
            'POST /api/login': 'Login and get JWT cookie',
            'GET /api/getBalance': 'Get user balance (auth required)',
            'POST /api/logout': 'Logout and clear session',
            'GET /api/me': 'Get current user info (auth required)',
            'GET /api/health': 'Health check',
        },
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
    try {
        await initDB();
        app.listen(PORT, () => {
            console.log(`🚀 KodBank server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

start();
