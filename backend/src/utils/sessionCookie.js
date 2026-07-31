/**
 * Extract admin JWT from Authorization Bearer or HttpOnly cookie.
 */
export function extractAdminToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    const bearer = header.slice(7).trim();
    if (bearer) return bearer;
  }

  const cookieHeader = req.headers.cookie || '';
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key === 'kodraxelsoft_admin_session' || key.endsWith('_admin_session')) {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return null;
}

export function buildSessionCookie({ token, maxAgeSec, secure }) {
  const name = 'kodraxelsoft_admin_session';
  const parts = [
    `${name}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSec}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function clearSessionCookie({ secure }) {
  const name = 'kodraxelsoft_admin_session';
  const parts = [
    `${name}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}
