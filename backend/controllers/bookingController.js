import Booking from '../models/Booking.js';
import { getNextBookingNumber } from '../services/counterService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

const parseDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const buildPayload = (body) => ({
  pnrCode: body.pnrCode,
  personalData: {
    name: body.name,
    contact: body.contact,
  },
  departure: {
    registerDate: parseDate(body.registerDate),
    departureDate: parseDate(body.departureDate),
    arrivalDate: parseDate(body.arrivalDate),
    destination: {
      from: body.departureFrom,
      to: body.departureTo,
    },
  },
  return: {
    departureDate: parseDate(body.returnDepartureDate),
    arrivalDate: parseDate(body.returnArrivalDate),
    destination: {
      from: body.returnFrom,
      to: body.returnTo,
    },
  },
  comments: body.comments || '',
});

export const list = asyncHandler(async (req, res) => {
  const {
    search = '',
    status = '',
    sortBy = 'departureDate',
    order = 'desc',
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};
  if (status && ['pending', 'booked'].includes(status)) filter.status = status;
  if (search) {
    const s = search.trim();
    filter.$or = [
      { 'personalData.name': { $regex: s, $options: 'i' } },
      { pnrCode: { $regex: s, $options: 'i' } },
      { 'personalData.contact': { $regex: s, $options: 'i' } },
      { bookingNumber: Number.isFinite(Number(s)) ? Number(s) : -1 },
    ];
  }

  const sortMap = {
    departureDate: 'departure.departureDate',
    bookingNumber: 'bookingNumber',
    createdAt: 'createdAt',
    name: 'personalData.name',
  };
  const sort = { [sortMap[sortBy] || 'departure.departureDate']: order === 'asc' ? 1 : -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Booking.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).lean();
  if (!booking) throw new ApiError(404, 'Booking not found');
  res.json({ success: true, data: booking });
});

export const create = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  const bookingNumber = await getNextBookingNumber();
  const booking = await Booking.create({ ...payload, bookingNumber, status: 'pending' });
  res.status(201).json({ success: true, data: booking });
});

export const update = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  Object.assign(booking, payload);
  await booking.save();
  res.json({ success: true, data: booking });
});

export const remove = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  await Booking.deleteOne({ _id: booking._id });
  res.json({ success: true, message: 'Booking deleted' });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'booked'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  booking.status = status;
  await booking.save();
  res.json({ success: true, data: booking });
});