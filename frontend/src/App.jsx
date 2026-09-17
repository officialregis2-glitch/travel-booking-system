import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookingsList from './pages/BookingsList.jsx';
import CreateBooking from './pages/CreateBooking.jsx';
import EditBooking from './pages/EditBooking.jsx';
import BookingDetails from './pages/BookingDetails.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<BookingsList />} />
        <Route path="bookings/new" element={<CreateBooking />} />
        <Route path="bookings/:id" element={<BookingDetails />} />
        <Route path="bookings/:id/edit" element={<EditBooking />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}