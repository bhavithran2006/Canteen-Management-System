# Canteen App — Backend API

Node.js + Express + MongoDB backend for the Campus Canteen Management System.

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Real-time | Socket.io 4 |
| Config | dotenv |
| Dev server | nodemon |

---

## Quick Start

### 1. Prerequisites

- Node.js ≥ 18
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`)

### 2. Install

```bash
cd backend
npm install
```

### 3. Configure

```bash
cp .env.example .env
# Edit .env if needed (default values work for local dev)
```

`.env.example`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/canteen_db
JWT_SECRET=canteen_super_secret_change_me_in_production
```

### 4. Seed the database

```bash
npm run seed
```

Populates: 5 users, 6 menu items, 3 canteens, 4 feedback entries, 2 notifications.  
**Idempotent** — safe to run multiple times.

### 5. Run the dev server

```bash
npm run dev
```

Server starts on `http://localhost:5000`.

---

## Default Credentials (after seed)

| Role | Identifier | Password |
|---|---|---|
| Admin | `admin@canteen.edu` | `admin` |
| Admin | `chef@canteen.edu` | `admin` |
| Student | `21CSE045` | `123` |
| Student | `22ECE018` | `123` |
| Student | `23IT009` | `123` |

---

## API Endpoints

All routes are prefixed with `/api`.

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register a new user |
| `POST` | `/auth/login` | — | Login (email or roll ID + password) |
| `GET` | `/auth/me` | ✅ | Get current user profile |

**Login body:** `{ "identifier": "21CSE045", "password": "123" }` *(also accepts `email` or `id`)*

---

### Menu

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/menu` | — | List all menu items |
| `POST` | `/menu` | 🔒 Admin | Add a new menu item |
| `PATCH` | `/menu/:id/stock` | 🔒 Admin | Update stock; auto-sets `available` |
| `DELETE` | `/menu/:id` | 🔒 Admin | Remove a menu item |

---

### Canteens (Crowd Tracking)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/canteens` | — | List all canteens with live level/wait |
| `PATCH` | `/canteens/:id/level` | 🔒 Admin | Update crowd level (`low`/`med`/`high`) |

`PATCH` body: `{ "level": "high" }` → server derives `wait` and emits `crowd:update` socket event.

---

### Orders

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/orders` | ✅ | Place a new order |
| `GET` | `/orders/active` | ✅ | Get current user's in-progress order |
| `GET` | `/orders/history` | ✅ | Past orders (admin gets all) |
| `PATCH` | `/orders/:id/advance` | 🔒 Admin | Advance status 0→1→2→3 |
| `PATCH` | `/orders/:id/cancel` | ✅ | Cancel an order (status → -1) |

**Place order body:**
```json
{
  "items": [{ "id": "veg_thali", "qty": 1 }, { "id": "masala_chai", "qty": 2 }],
  "paymentMode": "UPI / GPay"
}
```
Server validates stock and recomputes total — never trusts a client-submitted total.

---

### Wallet

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/wallet` | ✅ | Get wallet balance |
| `POST` | `/wallet/topup` | ✅ | Add funds (mock) |

**Top-up body:** `{ "amount": 100 }`

---

### Feedback

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/feedback` | — | List all feedback, newest first |
| `POST` | `/feedback` | ✅ | Submit feedback |
| `PATCH` | `/feedback/:id/upvote` | ✅ | Increment helpful count |
| `PATCH` | `/feedback/:id/reply` | 🔒 Admin | Post manager reply |

---

### Notifications

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/notifications` | ✅ | User's notifications + broadcasts |
| `PATCH` | `/notifications/read-all` | ✅ | Mark all as read |

---

### Health Check

```
GET /api/health  →  { "status": "ok", "timestamp": "..." }
```

---

## Socket.io Events

The frontend should connect to `http://localhost:5000` with Socket.io and immediately emit a `join` event:

```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
socket.emit("join", { userId: currentUser.id });
```

### Events emitted by the server

| Event | Payload | Trigger |
|---|---|---|
| `order:status` | `{ orderId, status, userId }` | Admin advances an order |
| `crowd:update` | `{ canteenId, level, wait, lastUpdated }` | Admin updates crowd level |
| `notification:new` | `{ notification }` | Low-stock alert or order ready |

---

## Business Logic

- **Stock** never goes negative (clamped at 0).
- `available` is always `stock > 0` — never set by the client.
- **Order total** is always computed server-side from current menu prices.
- **Low-stock alert** fires whenever stock enters the range `(0, 5]`.
- **Order status**: `0 = Placed → 1 = Preparing → 2 = Ready → 3 = Completed`, `-1 = Cancelled`.
- **Crowd wait** is always derived from level: `low=3, med=7, high=14` minutes.

---

## Directory Structure

```
backend/
├── server.js                  # Entry point
├── seed.js                    # Database seeder
├── .env.example
├── package.json
├── README.md
├── middleware/
│   ├── auth.js                # JWT verification → req.user
│   └── adminOnly.js           # Role guard
├── models/
│   ├── User.js
│   ├── MenuItem.js
│   ├── Canteen.js
│   ├── Order.js
│   ├── Feedback.js
│   └── Notification.js
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   ├── canteenController.js
│   ├── orderController.js
│   ├── walletController.js
│   ├── feedbackController.js
│   └── notificationController.js
└── routes/
    ├── auth.js
    ├── menu.js
    ├── canteens.js
    ├── orders.js
    ├── wallet.js
    ├── feedback.js
    └── notifications.js
```
