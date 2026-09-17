import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    notificationNumber: { type: Number, unique: true, required: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    bookingNumber: { type: Number, required: true },
    type: {
      type: String,
      enum: ['pending_reminder', 'departure_reminder'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, index: true },
    // Deduplication keys
    dedupeKey: { type: String, unique: true, required: true, index: true },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;