import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { extractAdminToken } from '../utils/sessionCookie.js';

export const authenticateAdmin = asyncHandler(async (req, _res, next) => {
  const token = extractAdminToken(req);

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'],
    });
    if (!payload?.sub || payload.role !== 'admin') {
      throw new ApiError(401, 'Invalid token');
    }
    req.admin = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, 'Invalid or expired token');
  }
});
