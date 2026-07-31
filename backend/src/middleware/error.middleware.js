import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export function notFoundHandler(req, res) {
  return ApiResponse.fail(res, {
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  if (statusCode >= 500) {
    logger.error(message, { stack: err.stack });
  } else {
    logger.warn(message, { errors });
  }

  if (err instanceof ApiError === false && statusCode === 500 && config.env === 'production') {
    message = 'Internal server error';
    errors = null;
  }

  return ApiResponse.fail(res, { statusCode, message, errors });
}
