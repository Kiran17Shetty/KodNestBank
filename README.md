# 🏦 KodBank — Bank Bold.

A modern, full-stack banking web application built with a premium glassmorphism dark UI. KodBank features secure JWT-based authentication, real-time balance tracking, and a stunning fintech-inspired dashboard.

![Tech Stack](https://img.shields.io/badge/React-TypeScript-blue?style=flat-square)
![Backend](https://img.shields.io/badge/Node.js-Express-green?style=flat-square)
![Database](https://img.shields.io/badge/MySQL-Aiven%20Cloud-orange?style=flat-square)
![Auth](https://img.shields.io/badge/Auth-JWT%20HttpOnly%20Cookie-purple?style=flat-square)

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT tokens stored as HttpOnly cookies (XSS-safe)
- 🏦 **User Registration** — Bcrypt-hashed passwords, auto-assigned ₹1,00,000 balance
- 💰 **Balance Reveal** — Animated count-up with confetti celebration
- 🎨 **Glassmorphism UI** — Premium dark theme with frosted glass cards
- 🛡️ **Auth Guard** — Protected dashboard route with auto-redirect
- 🔔 **Toast Notifications** — Slide-in success/error toasts
- 📊 **Smart Dashboard** — Account overview, status cards, feature showcase

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React + TypeScript + Tailwind CSS       |
| Backend    | Node.js + Express.js                    |
| Database   | MySQL (Aiven Cloud) via `mysql2`        |
| Auth       | JWT (`jsonwebtoken`) + HttpOnly cookies |
| Styling    | Glassmorphism + CSS Variables + Inter   |
| HTTP       | Axios (with credentials)                |
| Extras     | bcrypt, cookie-parser, canvas-confetti  |

---

## 📁 Project Structure

```
KodNestBank/
├── server/                          # Backend API
│   ├── .env                         # Environment variables (DB, JWT)
│   ├── index.js                     # Express server entry point
│   ├── db.js                        # MySQL connection pool + table init
│   ├── routes/
│   │   └── auth.js                  # All API routes
│   └── package.json
│
├── client/                          # Frontend SPA
│   ├── src/
│   │   ├── api.ts                   # Axios instance config
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # React auth context
│   │   ├── components/
│   │   │   └── Toast.tsx            # Toast notification system
│   │   ├── pages/
│   │   │   ├── Register.tsx         # Registration page (split layout)
│   │   │   ├── Login.tsx            # Login page (3-column card)
│   │   │   └── Dashboard.tsx        # Protected dashboard
│   │   ├── index.css                # Global design system
│   │   ├── main.tsx                 # App entry point
│   │   └── App.tsx                  # Router + providers
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- Internet connection (for Aiven MySQL cloud database)

### 1. Clone / Open the project

```bash
cd KodNestBank
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Start the backend server

```bash
cd server
npm run dev
```

The server will:
- Connect to Aiven MySQL cloud database
- Auto-create `KodUser` and `UserToken` tables
- Start listening on `http://localhost:5000`

### 4. Start the frontend dev server

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Open in browser

Navigate to **http://localhost:5173** — you'll be redirected to the registration page.

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                        | Auth Required |
| ------ | ------------------ | ---------------------------------- | ------------- |
| GET    | `/`                | API info & available endpoints     | No            |
| POST   | `/api/register`    | Register a new user                | No            |
| POST   | `/api/login`       | Login and receive JWT cookie       | No            |
| GET    | `/api/getBalance`  | Get current user balance           | Yes (cookie)  |
| POST   | `/api/logout`      | Logout and clear session           | Yes (cookie)  |
| GET    | `/api/me`          | Get current authenticated user     | Yes (cookie)  |
| GET    | `/api/health`      | Health check                       | No            |

### Register

```bash
POST /api/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "mypassword123",
  "phone": "+91 9876543210"
}
```

### Login

```bash
POST /api/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "mypassword123"
}
# → Sets HttpOnly cookie "token"
# → Returns: { "message": "Login successful", "username": "johndoe" }
```

### Get Balance

```bash
GET /api/getBalance
# → Requires "token" cookie
# → Returns: { "balance": 100000 }
```

---

## 🗄️ Database Schema

### KodUser

| Column   | Type          | Constraints                    |
| -------- | ------------- | ------------------------------ |
| uid      | VARCHAR(50)   | PRIMARY KEY                    |
| username | VARCHAR(100)  | NOT NULL, UNIQUE               |
| email    | VARCHAR(150)  | NOT NULL, UNIQUE               |
| password | VARCHAR(255)  | NOT NULL (bcrypt hashed)       |
| phone    | VARCHAR(20)   | nullable                       |
| balance  | DECIMAL(15,2) | DEFAULT 100000.00              |
| role     | ENUM          | 'Customer','Manager','Admin'   |

### UserToken

| Column | Type         | Constraints                          |
| ------ | ------------ | ------------------------------------ |
| tid    | INT          | PRIMARY KEY, AUTO_INCREMENT          |
| token  | TEXT         | NOT NULL                             |
| uid    | VARCHAR(50)  | FK → KodUser(uid) ON DELETE CASCADE  |
| expiry | DATETIME     | NOT NULL                             |

---

## 🎨 Design System

| Token               | Value                          |
| -------------------- | ------------------------------ |
| Background Primary   | `#0A0705`                      |
| Background Secondary | `#120E08`                      |
| Accent Green         | `#6AAF45`                      |
| Accent Brown         | `#A0522D`                      |
| Text Primary         | `#F5ECD7`                      |
| Text Secondary       | `#A89070`                      |
| Font                 | Inter (Google Fonts)           |
| Card Style           | Glassmorphism (blur 16px)      |
| Button Style         | Pill shape (border-radius 50px)|

---

## 📄 Pages

### `/register` — Registration Page
Split-layout with left branding panel (tagline, features, floating orbs) and right form panel (2-column grid, glass inputs, role dropdown).

### `/login` — Login Page
Centered 3-column glass card (welcome section, form section, gradient sign-in button) with floating orb background.

### `/dashboard` — User Dashboard (Protected)
Full-width layout with sticky navbar, hero banner with balance reveal + confetti, 4-column account info cards, and 3-column feature showcase.

---

## 🔒 Security

- Passwords are hashed with **bcrypt** (10 salt rounds)
- JWT tokens are stored as **HttpOnly cookies** (not accessible via JavaScript)
- Token expiry: **1 hour**
- Session tokens are stored in database and cleared on logout
- SSL required for database connection

---

## 📝 Environment Variables

The `.env` file in the `server/` directory contains:

```env
DB_HOST=<mysql-host>
DB_PORT=<mysql-port>
DB_USER=<mysql-user>
DB_PASSWORD=<mysql-password>
DB_NAME=<database-name>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

---

## 🤝 Credits

Built with ❤️ using the **KodBank** design system.

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MySQL on Aiven Cloud
- **Design**: Custom glassmorphism dark theme
