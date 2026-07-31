import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { ApiResponse } from './utils/ApiResponse.js';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'no-referrer' },
  })
);

const allowedOrigins = config.corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser / same-origin tools (no Origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Bootstrap-Key'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

/** Prefer real client IP when Next.js BFF proxies (X-Forwarded-For). */
function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.trim()) {
    return xf.split(',')[0].trim();
  }
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.trim()) return real.trim();
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'production' ? 2000 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => clientIp(req),
  // Login has its own limiter — don't block correct passwords via global bucket
  skip: (req) => {
    const url = String(req.originalUrl || req.url || req.path || "");
    return /\/auth\/(login|bootstrap|logout|me)(\?|$)/.test(url);
  },
  validate: { keyGeneratorIpFallback: false },
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'production' ? 30 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => clientIp(req),
  skipSuccessfulRequests: true,
  validate: { keyGeneratorIpFallback: false },
  message: {
    success: false,
    message:
      'Too many login attempts from this device. Wait a few minutes, then try again (or restart the CMS API to clear the limit).',
  },
});
app.use('/api/auth/login', authLimiter);

const bootstrapLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: config.env === 'production' ? 5 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => clientIp(req),
  validate: { keyGeneratorIpFallback: false },
  message: { success: false, message: 'Too many bootstrap attempts.' },
});
app.use('/api/auth/bootstrap', bootstrapLimiter);

const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: config.env === 'production' ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => clientIp(req),
  validate: { keyGeneratorIpFallback: false },
  message: { success: false, message: 'Too many applications from this IP. Try later.' },
});
app.use('/api/public/applications', applicationLimiter);

app.get('/health', (_req, res) => {
  return ApiResponse.success(res, {
    message: 'OK',
    data: {
      service: 'kodraxelsoft-cms-api',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
