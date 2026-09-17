# Travel Booking Management System

Exact frontend/backend structure requested.

## Install libraries
Open two terminals.

### Backend
cd backend
npm install
copy .env.example .env
npm run dev

### Frontend
cd frontend
npm install
npm run dev

MongoDB:
mongodb://127.0.0.1:27017/travel_booking_system

## Create the first admin
After backend is running, send a POST request to:
POST http://localhost:5000/api/auth/seed

JSON:
{
  "name": "Administrator",
  "email": "admin@example.com",
  "password": "ChangeThisPassword"
}

Then open http://localhost:5173 and log in.

## Important
The ZIP contains package.json files with all required library dependencies, but it intentionally does NOT contain node_modules. Run npm install in each folder to download them.
