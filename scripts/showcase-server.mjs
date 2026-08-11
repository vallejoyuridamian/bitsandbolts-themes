import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(projectRoot, 'docs');
const host = '127.0.0.1';
const port = Number.parseInt(process.env.BB_THEMES_PORT || '4181', 10);

const contentTypes = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
});

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new TypeError('BB_THEMES_PORT must be an integer between 1 and 65535.');
}

function safeFile(pathname) {
  const relativePath = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const filePath = path.resolve(docsRoot, relativePath);
  return filePath === docsRoot || filePath.startsWith(`${docsRoot}${path.sep}`) ? filePath : null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${host}:${port}`);
  if (url.pathname === '/__health') {
    response.writeHead(200, { 'cache-control': 'no-store', 'content-type': 'application/json; charset=utf-8' });
    response.end(`${JSON.stringify({ ok: true, service: 'bitsandbolts-themes-showcase' })}\n`);
    return;
  }
  if (!['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, { allow: 'GET, HEAD', 'cache-control': 'no-store' });
    response.end();
    return;
  }
  const filePath = safeFile(url.pathname);
  const details = filePath ? await stat(filePath).catch(() => null) : null;
  if (!details?.isFile()) {
    response.writeHead(404, { 'cache-control': 'no-store', 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found\n');
    return;
  }
  response.writeHead(200, {
    'cache-control': 'no-store',
    'content-length': details.size,
    'content-type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  process.stdout.write(`Bits & Bolts Themes: ${url}\n`);
  if (process.env.BB_THEMES_NO_BROWSER === '1') return;
  let command = 'xdg-open';
  let args = [url];
  if (process.platform === 'darwin') command = 'open';
  if (process.platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  }
  const opener = spawn(command, args, { detached: true, stdio: 'ignore' });
  opener.once('error', (error) => {
    process.stderr.write(`Could not open the default browser: ${error.message}\n`);
  });
  opener.unref();
});
