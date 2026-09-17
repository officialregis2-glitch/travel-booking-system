import cron from 'node-cron';
import {
  generatePendingReminders,
  generateDepartureReminders,
} from '../services/notificationService.js';

let isRunning = false;

async function runAll() {
  if (isRunning) return;
  isRunning = true;
  try {
    const p = await generatePendingReminders();
    const d = await generateDepartureReminders();
    if (p || d) {
      console.log(`[scheduler] created ${p} pending, ${d} departure reminders`);
    }
  } catch (err) {
    console.error('[scheduler] error:', err.message);
  } finally {
    isRunning = false;
  }
}

export function startScheduler() {
  // Run every 5 minutes, and also once immediately on startup.
  // The 5-minute cadence ensures we catch bookings that cross the 10h/24h
  // threshold even if the server is restarted.
  cron.schedule('*/5 * * * *', runAll, { timezone: 'UTC' });
  // Initial run after DB is ready
  setTimeout(runAll, 5000);
  console.log('🕒 Notification scheduler started (every 5 minutes)');
}