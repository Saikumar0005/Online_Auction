# Bid & Win - Online Auction System (Cloud Computing Project)

A secure, scalable MERN stack based Online Auction MVP designed for Cloud Computing scenarios.

## 🚀 Key Features

*   **Real-time Auction Status**: Live updates on auction status (simulated polling).
*   **MFA Simulation**: Custom "Secret Key" second factor authentication.
*   **Security First**: Forward/Backward secrecy concepts using bcrypt hashing.
*   **Scalable Architecture**: Stateless REST API design suitable for Load Balancing.
*   **Analytics**: Aggregation pipelines for auction statistics.

## 🏗 Architecture

### 1. Stateless Backend (Node.js/Express)
The backend is designed to be **stateless**. It does not hold user sessions in memory.
*   **Authentication**: JWT (JSON Web Tokens). Each request contains all necessary info.
*   **Scaling**: You can spin up 10 instances of this backend behind an Nginx Load Balancer. Since no state is local, any request can go to any server.

### 2. Database (MongoDB)
*   **Centralized State**: All data (Users, Auctions, Bids) persists here.
*   **Replica Sets**: In a real cloud env, MongoDB would run as a Replica Set for high availability.

### 3. Frontend (React + Vite)
*   **SPA**: Single Page Application served via CDN or static host (S3/Netlify).
*   **Separation of Concerns**: Completely decoupled from backend.

## 🔒 Security Implementation

### Key Management
*   **Password & Secret Key**: Both are hashed using `bcrypt` (Salted Rounds).
*   **One-Way Hashing**: We never store plain text passwords.
*   **Reverse Verification**: Login compares (Hash(Input) vs StoredHash).

## 🛠 Project Structure

```
├── backend/            # Express Server
│   ├── models/         # Mongoose Schemas (User, Auction, Bid)
│   ├── controllers/    # Business Logic
│   ├── routes/         # API Endpoints
│   └── utils/          # Security Helpers
└── frontend/           # React App (Vite)
    ├── src/
    │   ├── context/    # Auth State Management
    │   ├── components/ # Reusable UI
    │   └── pages/      # Views
```

## ⚡ Run Locally

### Prerequisites
*   Node.js (v14+)
*   MongoDB (Local or Atlas URI)

### 1. Setup Backend
```bash
cd backend
npm install
# Create .env file with MONGO_URI and JWT_SECRET
npm start
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## ☁️ Cloud & Colab Execution
See `COLAB_INSTRUCTIONS.md` for running this entire stack in Google Colab using `ngrok` or `localtunnel`.
