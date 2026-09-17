# Travel Booking Management System

A private, production-ready internal dashboard for a travel agency to manage
passenger bookings, confirm tickets, and receive automated reminders.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + Axios + Lucide React
- **Backend:** Node.js + Express + Mongoose + JWT + bcryptjs + node-cron
- **Database:** MongoDB Atlas

## Features

- Admin authentication (JWT, hashed passwords)
- CRUD for bookings (one collection per booking, embedded departure/return)
- Sequential human-readable `bookingNumber` (atomic counter collection)
- Status workflow: `Pending → Booked` (admin-only)
- Notification system with bell, unread count, mark-read
- Backend cron scheduler:
  - Pending reminder after 10 hours
  - Departure reminder 24h before departure
- Dashboard stats, search, filter, sort, pagination
- Responsive modern UI with animations and skeleton loaders

---

## Setup

### 1. Clone & install

```bash
# Backend
cd backend
cp .env.example .env        # then fill in values
npm install

# Frontend (separate terminal)
cd frontend
npm install
```

### 2. MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user with read/write access
3. Whitelist your server IP (or `0.0.0.0/0` for dev)
4. Copy the connection string into `backend/.env` as `MONGODB_URI`

### 3. Configure environment

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/travel_booking
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
TIMEZONE=Africa/Kigali
ADMIN_EMAIL=admin@agency.com
ADMIN_PASSWORD=Admin@12345
```

### 4. Seed the first admin

```bash
cd backend
npm run seed
```

This creates the admin user defined by `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### 5. Run

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

Open http://localhost:5173 and sign in with the seeded admin credentials.

---

## How it works

### Sequential booking numbers

A `counters` collection stores `{ _id: "booking", sequenceValue: N }`.
`Counter.getNextSequence('booking')` uses `findOneAndUpdate` with `$inc`
and `upsert: true`, which is atomic — two bookings created at the same
millisecond will never receive the same number.

### Notification scheduler

`jobs/scheduler.js` registers a `node-cron` job that runs every 5 minutes.

- **Pending reminder:** finds bookings where `status=pending` and
  `createdAt ≤ now - 10h`. For each, it checks whether a notification with
  `dedupeKey = "pending_reminder:<bookingId>"` already exists. If not, it
  creates one. Once the admin confirms the booking, no new pending reminder
  will ever be created for it (the query filters by `status=pending`).
- **Departure reminder:** finds bookings whose `departure.departureDate`
  is between now and now+24h, and creates a reminder if one doesn't yet
  exist (`dedupeKey = "departure_reminder:<bookingId>"`).

Because state lives in MongoDB, the scheduler is safe across server
restarts and does not depend on the browser being open.

### Authentication

- Passwords hashed with bcrypt (cost 12)
- JWT issued on login, stored in `localStorage`, sent as `Authorization: Bearer …`
- `protect` middleware guards all booking/notification/dashboard routes
- 401 responses auto-redirect the frontend to `/login`

---

## API

| Method | Path                                 | Description                  |
| ------ | ------------------------------------ | ---------------------------- |
| POST   | `/api/auth/login`                    | Admin login                  |
| GET    | `/api/auth/me`                       | Current user                 |
| GET    | `/api/dashboard/stats`               | Dashboard statistics         |
| GET    | `/api/bookings`                      | List (search/filter/sort)    |
| GET    | `/api/bookings/:id`                  | Get one                      |
| POST   | `/api/bookings`                      | Create                       |
| PUT    | `/api/bookings/:id`                  | Update                       |
| DELETE | `/api/bookings/:id`                  | Delete                       |
| PATCH  | `/api/bookings/:id/status`           | Change status                |
| GET    | `/api/notifications`                 | List + unread count          |
| PATCH  | `/api/notifications/:id/read`        | Mark one read                |
| PATCH  | `/api/notifications/read-all`        | Mark all read                |

### Query params for `GET /api/bookings`

- `search` — name / PNR / contact / booking number
- `status` — `pending` | `booked`
- `sortBy` — `departureDate` | `bookingNumber` | `createdAt` | `name`
- `order` — `asc` | `desc`
- `page`, `limit`

---

## Production deployment

### Backend (e.g. Render / Railway / VPS)

1. Set env vars on the host (never commit `.env`)
2. `npm install --production`
3. `npm run seed` once
4. `npm start` → runs `node server.js`
5. Point a reverse proxy (nginx/Caddy) to the port, enable HTTPS

### Frontend

Two options:

**A. Static hosting (Vercel / Netlify / Cloudflare Pages)**

```bash
cd frontend
npm run build
# upload the `dist/` folder
```

Set `VITE_API_URL` if your API is at a different origin and adjust
`src/services/api.js` to use it.

**B. Served by the Express backend**

```bash
cd frontend && npm run build
cp -r dist ../backend/public
```

Then in `server.js`:

```js
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);
```

---

## Default login

- Email: `admin@agency.com`
- Password: `Admin@12345`

Change these immediately after first login.