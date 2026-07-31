import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  console.warn(
    '[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. API DB calls will fail until configured.'
  );
}

export const supabase = createClient(
  config.supabase.url || 'http://localhost',
  config.supabase.serviceRoleKey || 'missing-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const storageBucket = config.supabase.bucket;
