import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { getNextNotificationNumber } from './counterService.js';
import { sendEmailNotification } from './emailService.js';

const getTenHourBlock = () => Math.floor(Date.now() / (10 * 60 * 60 * 1000));

export async function generatePendingReminders() {
  try {
    const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
    const timeBlock = getTenHourBlock();

    const bookings = await Booking.find({
      status: 'pending',
      createdAt: { $lte: tenHoursAgo },
    }).lean();

    let created = 0;
    for (const b of bookings) {
      const dedupeKey = `pending_reminder:${b._id.toString()}:${timeBlock}`;
      const exists = await Notification.exists({ dedupeKey });
      
      if (exists) continue;

      const notificationNumber = await getNextNotificationNumber();
      const messageText = `Booking #${b.bookingNumber} for ${b.personalData.name} has been pending for more than 10 hours. Please confirm whether the ticket has been booked.`;
      
      const htmlContent = `
        <h2 style="color: #d97706;">⚠️ Pending Booking Alert</h2>
        <p><strong>Booking #${b.bookingNumber}</strong> for <strong>${b.personalData.name}</strong> has been pending for more than 10 hours.</p>
        <p>Please log in to the system and confirm whether the ticket has been booked.</p>
        <hr>
        <p style="color: #64748b; font-size: 12px;">Travel Booking Management System</p>
      `;

      await Notification.create({
        notificationNumber,
        bookingId: b._id,
        bookingNumber: b.bookingNumber,
        type: 'pending_reminder',
        title: 'Pending Booking Reminder',
        message: messageText,
        isRead: false,
        dedupeKey,
      });

      // Send to EMAIL 2 (Pending)
      if (process.env.EMAIL_2) {
        await sendEmailNotification(process.env.EMAIL_2, '⚠️ Pending Booking Alert: Action Required', htmlContent);
      }
      created++;
    }
    return created;
  } catch (error) {
    console.error('Error in generatePendingReminders:', error.message);
    return 0;
  }
}

export async function generateDepartureReminders() {
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      status: { $in: ['pending', 'booked'] },
      'departure.departureDate': { $gt: now, $lte: in24h },
    }).lean();

    let created = 0;
    for (const b of bookings) {
      const dedupeKey = `departure_reminder:${b._id.toString()}`;
      const exists = await Notification.exists({ dedupeKey });
      
      if (exists) continue;

      const notificationNumber = await getNextNotificationNumber();
      const messageText = `Departure Reminder: Passenger ${b.personalData.name} (Booking #${b.bookingNumber}) departs in less than 24 hours from ${b.departure.destination.from} to ${b.departure.destination.to}.`;

      const htmlContent = `
        <h2 style="color: #2563eb;">✈️ Departure Reminder</h2>
        <p>Passenger <strong>${b.personalData.name}</strong> (Booking #${b.bookingNumber}) departs in less than 24 hours.</p>
        <p><strong>Route:</strong> ${b.departure.destination.from} ➡️ ${b.departure.destination.to}</p>
        <p><strong>Departure Time:</strong> ${new Date(b.departure.departureDate).toLocaleString()}</p>
        <hr>
        <p style="color: #64748b; font-size: 12px;">Travel Booking Management System</p>
      `;

      await Notification.create({
        notificationNumber,
        bookingId: b._id,
        bookingNumber: b.bookingNumber,
        type: 'departure_reminder',
        title: 'Departure Reminder',
        message: messageText,
        isRead: false,
        dedupeKey,
      });

      // Send to EMAIL 1 (Departure)
      if (process.env.EMAIL_1) {
        await sendEmailNotification(process.env.EMAIL_1, `✈️ Departure Reminder: Booking #${b.bookingNumber}`, htmlContent);
      }
      created++;
    }
    return created;
  } catch (error) {
    console.error('Error in generateDepartureReminders:', error.message);
    return 0;
  }
}