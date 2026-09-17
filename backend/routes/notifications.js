import { Router } from 'express';
import { list, markRead, markAllRead, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.use(protect);

r.get('/', list);
r.patch('/:id/read', markRead);
r.patch('/read-all', markAllRead);
r.delete('/:id', deleteNotification); // ADD THIS LINE

export default r;