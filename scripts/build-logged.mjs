import { spawn } from 'node:child_process';
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = join(root, 'logs');
const log = join(directory, 'bitsandbolts-themes-build.log');
mkdirSync(directory, { recursive: true });
rmSync(log + '.2', { force: true });
if (existsSync(log + '.1')) renameSync(log + '.1', log + '.2');
if (existsSync(log)) renameSync(log, log + '.1');
const fd = openSync(log, 'w', 0o600);
const start = Date.now();

function record(target, bytes) {
  appendFileSync(fd, bytes);
  target.write(bytes);
}

function event(name, details = {}) {
  record(process.stdout, JSON.stringify({ ts: new Date().toISOString(), event: name,
    deltaMs: Date.now() - start, ...details }) + '\n');
}

try {
  event('themes-build-started');
  const child = spawn(process.execPath, ['build.js'], { cwd: root, stdio: ['inherit', 'pipe', 'pipe'] });
  child.stdout.on('data', chunk => record(process.stdout, chunk));
  child.stderr.on('data', chunk => record(process.stderr, chunk));
  const { code, signal } = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({ code, signal }));
  });
  event(code === 0 ? 'themes-build-finished' : 'themes-build-failed', { code, signal });
  process.exitCode = code ?? 1;
} catch (error) {
  event('themes-build-failed', { message: error.message });
  process.exitCode = 1;
} finally {
  closeSync(fd);
}
