import { supabase } from '../config/supabase.js';
import { logger } from './logger.js';

export async function logActivity({ action, entityType, entityId = null, summary, metadata = {} }) {
  try {
    const { error } = await supabase.from('activity_logs').insert({
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      summary,
      metadata,
    });
    if (error) logger.warn('activity_log_failed', { error: error.message });
  } catch (err) {
    logger.warn('activity_log_exception', { error: err.message });
  }
}

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
