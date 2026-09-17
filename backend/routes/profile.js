import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, uploadPhoto } from '../controllers/profileController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.use(protect);

r.get('/', getProfile);

r.put(
  '/',
  [
    body('username').optional().trim().isLength({ min: 3, max: 30 }),
    body('currentPassword').optional().notEmpty(),
    body('newPassword').optional().isLength({ min: 6 }),
  ],
  validate,
  updateProfile
);

r.post('/photo', body('photo').notEmpty(), validate, uploadPhoto);

export default r;   