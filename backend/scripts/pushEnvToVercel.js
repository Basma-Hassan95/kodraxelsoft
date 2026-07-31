/**
 * Push backend/.env keys to a Vercel project (values via stdin, not logged).
 * Usage: node scripts/pushEnvToVercel.js <project-name> <scope>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const project = process.argv[2] || 'kodraxelsoft-api';
const scope = process.argv[3] || 'kodraxel-soft';
const targets = ['production', 'preview', 'development'];

if (!fs.existsSync(envPath)) {
  console.error('Missing backend/.env');
  process.exit(1);
}

const raw = fs.readFileSync(envPath, 'utf8');
const vars = {};
for (const line of raw.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i < 1) continue;
  const key = t.slice(0, i).trim();
  let val = t.slice(i + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  vars[key] = val;
}

// Production CORS must allow the live frontend
const frontendOrigins = [
  'https://kodraxelsoft-gamma.vercel.app',
  'https://kodraxelsoft.vercel.app',
  'http://localhost:3000',
];
const existingCors = (vars.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
vars.CORS_ORIGIN = [...new Set([...existingCors, ...frontendOrigins])].join(',');
vars.NODE_ENV = 'production';

const keys = Object.keys(vars);
console.log(`Pushing ${keys.length} env keys to ${project} (${scope})…`);

for (const key of keys) {
  for (const target of targets) {
    // Remove existing quietly, then add
    spawnSync(
      'npx',
      ['vercel', 'env', 'rm', key, target, '--yes', '--scope', scope],
      { cwd: path.resolve(__dirname, '..'), encoding: 'utf8', shell: true }
    );
    const add = spawnSync(
      'npx',
      ['vercel', 'env', 'add', key, target, '--scope', scope],
      {
        cwd: path.resolve(__dirname, '..'),
        input: vars[key] + '\n',
        encoding: 'utf8',
        shell: true,
      }
    );
    if (add.status !== 0) {
      console.error(`Failed ${key}@${target}:`, add.stderr || add.stdout);
    } else {
      console.log(`OK ${key} → ${target}`);
    }
  }
}

console.log('Done. Redeploy the API to apply env vars.');
