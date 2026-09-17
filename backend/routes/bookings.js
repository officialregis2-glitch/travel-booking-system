import { Router } from 'express';
import { body } from 'express-validator';
import {
  list,
  getById,
  create,
  update,
  remove,
  updateStatus,
} from '../controllers/bookingController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.use(protect);

const bookingValidators = [
  body('pnrCode').trim().isLength({ min: 6, max: 10 }).withMessage('PNR must be 6–10 chars'),
  body('name').trim().notEmpty().withMessage('Passenger name required'),
  body('contact').trim().notEmpty().withMessage('Contact required'),
  body('registerDate').isISO8601().withMessage('Register date required'),
  body('departureDate').isISO8601().withMessage('Departure date required'),
  body('arrivalDate').isISO8601().withMessage('Arrival date required'),
  body('departureFrom').trim().notEmpty(),
  body('departureTo').trim().notEmpty(),
  body('returnDepartureDate').isISO8601(),
  body('returnArrivalDate').isISO8601(),
  body('returnFrom').trim().notEmpty(),
  body('returnTo').trim().notEmpty(),
];

r.get('/', list);
r.get('/:id', getById);
r.post('/', bookingValidators, validate, create);
r.put('/:id', bookingValidators, validate, update);
r.delete('/:id', remove);
r.patch('/:id/status', body('status').isIn(['pending', 'booked']), validate, updateStatus);

export default r;