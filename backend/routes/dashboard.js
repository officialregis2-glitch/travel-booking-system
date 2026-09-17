import { Router } from 'express';
import { stats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.use(protect);
r.get('/stats', stats);

export default r;