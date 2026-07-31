import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../utils/helpers.js';

/** In-memory brute-force protection (per process) */
const loginAttempts = new Map();

function attemptKey(email, ip) {
  return `${(email || '').toLowerCase()}|${ip || 'unknown'}`;
}

function getAttempt(email, ip) {
  const key = attemptKey(email, ip);
  const row = loginAttempts.get(key);
  if (!row) return { count: 0, lockedUntil: 0 };
  if (row.lockedUntil && Date.now() > row.lockedUntil) {
    loginAttempts.delete(key);
    return { count: 0, lockedUntil: 0 };
  }
  return row;
}

function registerFailure(email, ip) {
  const key = attemptKey(email, ip);
  const prev = getAttempt(email, ip);
  const count = prev.count + 1;
  const max = config.security.maxLoginAttempts;
  const lockedUntil =
    count >= max ? Date.now() + config.security.lockoutMinutes * 60 * 1000 : 0;
  loginAttempts.set(key, { count, lockedUntil });
  return { count, lockedUntil };
}

function clearAttempts(email, ip) {
  loginAttempts.delete(attemptKey(email, ip));
}

function signToken(admin) {
  return jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'admin',
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
      algorithm: 'HS256',
    }
  );
}

function jwtMaxAgeSeconds() {
  const raw = String(config.jwt.expiresIn || '8h');
  const m = raw.match(/^(\d+)([smhd])$/i);
  if (!m) return 8 * 60 * 60;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 's') return n;
  if (unit === 'm') return n * 60;
  if (unit === 'h') return n * 3600;
  if (unit === 'd') return n * 86400;
  return 8 * 60 * 60;
}

export const authService = {
  jwtMaxAgeSeconds,

  async login({ email, password }, meta = {}) {
    const ip = meta.ip || 'unknown';
    const normalized = String(email || '').toLowerCase().trim();

    const attempt = getAttempt(normalized, ip);
    if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const mins = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      throw new ApiError(
        429,
        `Too many failed logins. Try again in ${mins} minute(s).`
      );
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', normalized)
      .maybeSingle();

    if (error) throw new ApiError(500, error.message);
    if (!admin) {
      registerFailure(normalized, ip);
      throw new ApiError(401, 'Invalid email or password');
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      const fail = registerFailure(normalized, ip);
      if (fail.lockedUntil) {
        throw new ApiError(
          429,
          `Too many failed logins. Account temporarily locked for ${config.security.lockoutMinutes} minutes.`
        );
      }
      throw new ApiError(401, 'Invalid email or password');
    }

    clearAttempts(normalized, ip);

    await supabase
      .from('admins')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id);

    await logActivity({
      action: 'login',
      entityType: 'admin',
      entityId: admin.id,
      summary: `Admin logged in (${admin.email})`,
    });

    const token = signToken(admin);
    return {
      token,
      expiresIn: config.jwt.expiresIn,
      maxAgeSec: jwtMaxAgeSeconds(),
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        last_login_at: admin.last_login_at,
      },
    };
  },

  async me(adminId) {
    const { data, error } = await supabase
      .from('admins')
      .select('id, name, email, last_login_at, created_at')
      .eq('id', adminId)
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    if (!data) throw new ApiError(404, 'Admin not found');
    return data;
  },

  async changePassword(adminId, { currentPassword, newPassword }) {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    if (!admin) throw new ApiError(404, 'Admin not found');

    const valid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!valid) throw new ApiError(400, 'Current password is incorrect');

    const password_hash = await bcrypt.hash(newPassword, 12);
    const { error: updateError } = await supabase
      .from('admins')
      .update({ password_hash })
      .eq('id', adminId);
    if (updateError) throw new ApiError(400, updateError.message);

    await logActivity({
      action: 'password_change',
      entityType: 'admin',
      entityId: adminId,
      summary: 'Admin changed password',
    });

    return { message: 'Password updated' };
  },

  async ensureAdminExists() {
    const { count, error } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true });
    if (error) throw new ApiError(500, error.message);
    return (count || 0) > 0;
  },

  async bootstrapAdmin({ name, email, password }, meta = {}) {
    if (config.disableBootstrap) {
      throw new ApiError(
        403,
        'Admin bootstrap is disabled. Use seed:admin on the server.'
      );
    }

    // If BOOTSTRAP_SECRET is set, require matching X-Bootstrap-Key header.
    // If not set, first admin signup is still allowed when no admin exists yet.
    if (config.bootstrapKey) {
      const provided = meta.bootstrapKey || '';
      if (provided !== config.bootstrapKey) {
        throw new ApiError(403, 'Invalid bootstrap key');
      }
    }

    const exists = await this.ensureAdminExists();
    if (exists) {
      throw new ApiError(
        409,
        'Admin already exists. Only one admin is allowed — use Sign In (a different name on Sign Up cannot create another admin).'
      );
    }

    const password_hash = await bcrypt.hash(password, 12);
    const { data, error } = await supabase
      .from('admins')
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash,
      })
      .select('id, name, email, created_at')
      .single();

    if (error) throw new ApiError(400, error.message);

    await logActivity({
      action: 'bootstrap',
      entityType: 'admin',
      entityId: data.id,
      summary: `Admin bootstrapped (${data.email})`,
    });

    return data;
  },
};
