# Job Tracker

A full-stack web application to track job applications — record where you applied, monitor application status, and get warned about upcoming deadlines.

Built as a learning project to understand modern fullstack development practices including REST API design, JWT authentication, and React frontend architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Token) |
| HTTP Client | Axios |
| Routing | React Router v7 |

---

## Features

- **Authentication** — Register and login with JWT. Passwords hashed with bcrypt. Token stored in localStorage
- **Add Applications** — Record company, position, location, contract type, salary, status, dates, job source, and notes
- **Status Tracking** — Track each application through: Wishlist → Applied → HR Review → Interview → Offer → Accepted / Rejected / Withdrawn
- **Close Date Warning** — Applications with expired deadlines show a 🚨 red badge. Deadlines within 3 days show a ⚠️ orange badge
- **Filter by Status** — Filter applications by any status with one click
- **Dashboard Summary** — Overview cards showing total, applied, interview, and offer counts
- **Loading Skeletons** — Smooth loading experience while data is being fetched
- **Protected Routes** — Unauthenticated users are redirected to login. Logged-in users are redirected away from auth pages

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js        # Register and login logic
│   │   │   └── applicationController.js # CRUD for job applications
│   │   ├── middleware/
│   │   │   └── authMiddleware.js        # JWT verification
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── applicationRoutes.js
│   │   └── index.js                     # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js          # Axios with auth interceptor
    │   │   ├── auth.js                   # Auth API calls
    │   │   └── applications.js           # Applications API calls
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx        # Redirects to login if not authenticated
    │   │   ├── GuestRoute.jsx            # Redirects to dashboard if authenticated
    │   │   ├── SkeletonCard.jsx          # Loading skeleton for application cards
    │   │   └── SkeletonSummary.jsx       # Loading skeleton for summary cards
    │   ├── context/
    │   │   └── AuthContext.jsx           # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AddApplication.jsx
    │   │   └── EditApplication.jsx
    │   ├── utils/
    │   │   └── dateHelpers.js            # Close date status logic
    │   └── main.jsx
    └── vite.config.js
```

---

## API Endpoints

```
PUBLIC
──────────────────────────────────────────
POST   /api/auth/register   Register a new user
POST   /api/auth/login      Login, returns JWT token

PROTECTED (requires Authorization: Bearer <token>)
──────────────────────────────────────────
GET    /api/applications         Get all applications for logged-in user
GET    /api/applications/:id     Get single application
POST   /api/applications         Create new application
PUT    /api/applications/:id     Update application
DELETE /api/applications/:id     Delete application
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14

### 1. Clone the repository

```bash
git clone https://github.com/satriaif/job-tracker.git
cd job-tracker
```

### 2. Setup the database

```bash
psql -U postgres
```

```sql
CREATE DATABASE job_tracker;
\c job_tracker

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    contract_type VARCHAR(50),
    salary VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Wishlist',
    date_applied DATE,
    close_date DATE,
    job_source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Setup backend

```bash
cd backend
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:3000`

### 4. Setup frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Application Status Flow

```
Wishlist → Applied → HR Review → Interview → Offer → Accepted
                                                    → Rejected
                              → Withdrawn (any stage)
```

---

## Key Concepts Applied

- **REST API design** — proper HTTP methods, status codes, and endpoint naming
- **JWT Authentication** — stateless auth with token expiry
- **Data ownership security** — all queries filter by `user_id` to prevent accessing other users' data
- **SQL injection prevention** — parameterized queries throughout
- **React Context** — global auth state without prop drilling
- **Axios interceptors** — automatic token attachment on every request
- **Git branching** — feature branches with Pull Requests into main
