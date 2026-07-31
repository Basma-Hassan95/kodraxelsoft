import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { supabase } from '../config/supabase.js';

/** Windows + Node can crash on abrupt exit while HTTP handles close — delay slightly. */
function safeExit(code = 0) {
  setTimeout(() => process.exit(code), 150);
}

async function main() {
  const email = config.admin.email.toLowerCase();
  const password = config.admin.password;
  const name = config.admin.name;
  const forceReset = process.argv.includes('--reset');

  if (!password || password.length < 10) {
    console.error('Set a strong ADMIN_PASSWORD in backend/.env (min 10 characters).');
    safeExit(1);
    return;
  }

  const { data: existing, error: findError } = await supabase
    .from('admins')
    .select('id, name, email')
    .eq('email', email)
    .maybeSingle();

  if (findError) {
    console.error('Failed to check admins:', findError.message);
    safeExit(1);
    return;
  }

  const password_hash = await bcrypt.hash(password, 12);

  if (existing) {
    if (!forceReset) {
      console.log('Admin already exists. Password was NOT changed.');
      console.log(`Login email: ${existing.email}`);
      console.log('');
      console.log('If login fails with "Invalid email or password", reset password with:');
      console.log('  npm run seed:admin -- --reset');
      console.log('(uses ADMIN_PASSWORD from backend/.env)');
      safeExit(0);
      return;
    }

    const { error: updateError } = await supabase
      .from('admins')
      .update({ password_hash, name })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Failed to reset password:', updateError.message);
      safeExit(1);
      return;
    }

    console.log('Admin password RESET successfully.');
    console.log(`  email: ${email}`);
    console.log('  password: (value from ADMIN_PASSWORD in backend/.env)');
    console.log('Login again on /admin/login with that password.');
    safeExit(0);
    return;
  }

  // Also block if a different admin email already exists (single-admin rule)
  const { count, error: countError } = await supabase
    .from('admins')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Failed to check admins:', countError.message);
    safeExit(1);
    return;
  }

  if ((count || 0) > 0) {
    console.log('A different admin already exists. Only one admin is allowed.');
    console.log('To reset THAT account password, set ADMIN_EMAIL in .env to that email, then:');
    console.log('  npm run seed:admin -- --reset');
    safeExit(0);
    return;
  }

  const { data, error } = await supabase
    .from('admins')
    .insert({ name, email, password_hash })
    .select('id, name, email')
    .single();

  if (error) {
    console.error('Failed to create admin:', error.message);
    safeExit(1);
    return;
  }

  console.log('Admin created successfully:');
  console.log(`  id:    ${data.id}`);
  console.log(`  name:  ${data.name}`);
  console.log(`  email: ${data.email}`);
  console.log('Password = ADMIN_PASSWORD from backend/.env');
  safeExit(0);
}

main().catch((err) => {
  console.error(err);
  safeExit(1);
});
