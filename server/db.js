const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function initDB() {
    const conn = await pool.getConnection();
    try {
        await conn.query(`
      CREATE TABLE IF NOT EXISTS KodUser (
        uid        VARCHAR(50)    PRIMARY KEY,
        username   VARCHAR(100)   NOT NULL UNIQUE,
        email      VARCHAR(150)   NOT NULL UNIQUE,
        password   VARCHAR(255)   NOT NULL,
        phone      VARCHAR(20),
        balance    DECIMAL(15,2)  DEFAULT 100000.00,
        role       ENUM('Customer','Manager','Admin') DEFAULT 'Customer'
      )
    `);
        await conn.query(`
      CREATE TABLE IF NOT EXISTS UserToken (
        tid     INT AUTO_INCREMENT PRIMARY KEY,
        token   TEXT NOT NULL,
        uid     VARCHAR(50),
        expiry  DATETIME NOT NULL,
        FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
      )
    `);
        console.log('✅ Database tables initialized');
    } finally {
        conn.release();
    }
}

module.exports = { pool, initDB };
