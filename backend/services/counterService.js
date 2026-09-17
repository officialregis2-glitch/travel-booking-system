import Counter from '../models/Counter.js';

export const getNextBookingNumber = () => Counter.getNextSequence('booking');
export const getNextNotificationNumber = () => Counter.getNextSequence('notification');