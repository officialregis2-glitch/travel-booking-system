import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: Number, unique: true, required: true, index: true },
    pnrCode: {
      type: String,
      required: [true, 'PNR code is required'],
      trim: true,
      uppercase: true,
      minlength: 6,
      maxlength: 10,
    },
    personalData: {
      name: {
        type: String,
        required: [true, 'Passenger name is required'],
        trim: true,
        minlength: 2,
        maxlength: 120,
      },
      contact: {
        type: String,
        required: [true, 'Contact is required'],
        trim: true,
      },
    },
    departure: {
      registerDate: { type: Date, required: true },
      departureDate: { type: Date, required: true },
      arrivalDate: { type: Date, required: true },
      destination: {
        from: { type: String, required: true, uppercase: true, trim: true },
        to: { type: String, required: true, uppercase: true, trim: true },
      },
    },
    return: {
      departureDate: { type: Date, required: true },
      arrivalDate: { type: Date, required: true },
      destination: {
        from: { type: String, required: true, uppercase: true, trim: true },
        to: { type: String, required: true, uppercase: true, trim: true },
      },
    },
    status: {
      type: String,
      enum: { values: ['pending', 'booked'], message: 'Invalid status' },
      default: 'pending',
      index: true,
    },
    comments: {
      type: String,
      default: '',
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1, createdAt: 1 });
bookingSchema.index({ 'departure.departureDate': 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;