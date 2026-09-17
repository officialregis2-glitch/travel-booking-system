import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const list = asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit || 20, 10));
  const items = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  const unreadCount = await Notification.countDocuments({ isRead: false });
  res.json({ success: true, data: items, unreadCount });
});

export const markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) throw new ApiError(404, 'Notification not found');
  n.isRead = true;
  await n.save();
  res.json({ success: true, data: n });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
  res.json({ success: true, message: 'All notifications marked as read' });
});

// ADD THIS NEW FUNCTION
export const deleteNotification = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) throw new ApiError(404, 'Notification not found');
  
  await Notification.deleteOne({ _id: n._id });
  res.json({ success: true, message: 'Notification deleted' });
});