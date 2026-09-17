import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

export const stats = asyncHandler(async (req, res) => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [
    total,
    pending,
    booked,
    upcoming,
    unread,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'booked' }),
    Booking.countDocuments({
      'departure.departureDate': { $gt: now, $lte: in24h },
    }),
    Notification.countDocuments({ isRead: false }),
  ]);

  res.json({
    success: true,
    data: {
      totalBookings: total,
      pendingBookings: pending,
      bookedTickets: booked,
      upcomingDepartures: upcoming,
      unreadNotifications: unread,
    },
  });
});