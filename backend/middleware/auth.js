import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Not authenticated. Please log in.'));
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
};