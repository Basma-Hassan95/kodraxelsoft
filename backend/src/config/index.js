import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isProd = (process.env.NODE_ENV || 'development') === 'production';

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    const msg = `[config] Missing required env: ${key}`;
    if (isProd) {
      console.error(msg);
      process.exit(1);
    }
    console.warn(msg);
  }
}

const jwtSecret = process.env.JWT_SECRET || '';
if (isProd) {
  if (jwtSecret.length < 32) {
    console.error('[config] JWT_SECRET must be at least 32 characters in production');
    process.exit(1);
  }
  if (
    jwtSecret === 'change-me-to-a-long-random-secret' ||
    jwtSecret === 'dev-insecure-secret'
  ) {
    console.error('[config] JWT_SECRET is using an insecure default — set a strong secret');
    process.exit(1);
  }
} else if (!jwtSecret) {
  console.warn(
    '[config] JWT_SECRET missing — using ephemeral secret for this process (set JWT_SECRET in .env)'
  );
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwt: {
    secret:
      jwtSecret ||
      crypto.randomBytes(48).toString('hex'),
    /** Short-lived admin sessions (default 8 hours) */
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    cookieName: process.env.JWT_COOKIE_NAME || 'kodraxelsoft_admin_session',
  },
  /** Optional: required header X-Bootstrap-Key for POST /auth/bootstrap */
  bootstrapKey: process.env.BOOTSTRAP_SECRET || '',
  /** Force-disable public signup bootstrap */
  disableBootstrap: process.env.DISABLE_ADMIN_BOOTSTRAP === 'true',
  isProd,
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: process.env.SUPABASE_STORAGE_BUCKET || 'media',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@kodraxelsoft.com',
    password: process.env.ADMIN_PASSWORD || '',
    name: process.env.ADMIN_NAME || 'Kodraxelsoft Admin',
  },
  upload: {
    maxFileSize: 20 * 1024 * 1024,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/x-icon',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    cvMaxFileSize: 8 * 1024 * 1024,
  },
  security: {
    maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutMinutes: Number(process.env.LOGIN_LOCKOUT_MINUTES) || 15,
  },
};
