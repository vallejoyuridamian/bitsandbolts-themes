/**
 * bitsandbolts-themes — editor-server.js
 *
 * Local dev server for the visual theme editor.
 * Run with: pnpm editor
 * Then open: http://localhost:7337
 *
 * Endpoints
 *   GET  /                          → editor/index.html
 *   GET  /dist/**                   → dist files (theme CSS for live preview)
 *   GET  /api/themes                → list theme slugs
 *   GET  /api/tokens/:theme/:mode   → read JSON token file
 *   GET  /api/typography            → read base typography tokens
 *   POST /api/save                  → write tokens + rebuild
 *   POST /api/new-theme             → create theme (save-as / new)
 */

import { createServer }                                from 'http';
import { readFileSync, writeFileSync, existsSync,
         readdirSync, mkdirSync, copyFileSync }       from 'fs';
import { join, extname }                              from 'path';
import { fileURLToPath }                              from 'url';
import { execFile }                                   from 'child_process';
import { promisify }                                  from 'util';

const execFileP = promisify(execFile);
const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 7337);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => { raw += c; });
    req.on('end',  () => { try { resolve(JSON.parse(raw)); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

function reply(res, status, body, type = 'application/json') {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
  });
  res.end(text);
}

function serveFile(res, filePath) {
  if (!existsSync(filePath)) return reply(res, 404, { error: 'File not found' });
  const ext  = extname(filePath);
  const mime = MIME[ext] ?? 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
  res.end(readFileSync(filePath));
}

// ─── Request handler ──────────────────────────────────────────────────────────

async function handle(req, res) {
  const url    = new URL(req.url, `http://localhost:${PORT}`);
  const path   = url.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // ── Static ────────────────────────────────────────────────────────────────
  if (path === '/' || path === '/index.html') {
    return serveFile(res, join(ROOT, 'editor', 'index.html'));
  }
  if (path.startsWith('/dist/')) {
    return serveFile(res, join(ROOT, path.slice(1)));
  }

  // ── API ───────────────────────────────────────────────────────────────────
  if (path === '/api/themes' && method === 'GET') {
    const themes = readdirSync(join(ROOT, 'tokens/themes'));
    return reply(res, 200, { themes });
  }

  if (path.startsWith('/api/tokens/') && method === 'GET') {
    const parts = path.split('/');          // ['','api','tokens',theme,mode]
    const [, , , theme, mode] = parts;
    const file = join(ROOT, 'tokens/themes', theme, `${mode}.json`);
    if (!existsSync(file)) return reply(res, 404, { error: 'Theme/mode not found' });
    return reply(res, 200, JSON.parse(readFileSync(file, 'utf8')));
  }

  if (path === '/api/typography' && method === 'GET') {
    const file = join(ROOT, 'tokens/base/typography.json');
    return reply(res, 200, JSON.parse(readFileSync(file, 'utf8')));
  }

  if (path.startsWith('/api/icons/') && method === 'GET') {
    const theme = path.split('/')[3];
    const file  = join(ROOT, 'tokens/themes', theme, 'icons.json');
    const defaults = { family: 'material-symbols', style: 'filled' };
    if (!existsSync(file)) return reply(res, 200, defaults);
    return reply(res, 200, JSON.parse(readFileSync(file, 'utf8')));
  }

  if (path === '/api/save' && method === 'POST') {
    const { theme, mode, tokens, typography, icons } = await readBody(req);
    try {
      // Write color tokens
      const tokenFile = join(ROOT, 'tokens/themes', theme, `${mode}.json`);
      writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));

      // Write icon family preference (theme-level, not per-mode)
      if (icons?.family) {
        const iconsFile = join(ROOT, 'tokens/themes', theme, 'icons.json');
        writeFileSync(iconsFile, JSON.stringify(icons, null, 2));
      }

      // Merge font families into base typography (don't clobber sizes, weights, etc.)
      if (typography?.font?.family) {
        const typoFile = join(ROOT, 'tokens/base/typography.json');
        const existing = JSON.parse(readFileSync(typoFile, 'utf8'));
        existing.font ??= {};
        existing.font.family ??= {};
        Object.assign(existing.font.family, typography.font.family);
        writeFileSync(typoFile, JSON.stringify(existing, null, 2));
      }

      const { stdout } = await execFileP('node', ['build.js'], { cwd: ROOT });
      return reply(res, 200, { ok: true, log: stdout });
    } catch (e) {
      return reply(res, 500, { ok: false, error: e.message });
    }
  }

  if (path === '/api/new-theme' && method === 'POST') {
    const { name, fromTheme, lightTokens, darkTokens } = await readBody(req);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) return reply(res, 400, { ok: false, error: 'Invalid theme name' });
    const themeDir = join(ROOT, 'tokens/themes', slug);
    if (existsSync(themeDir)) return reply(res, 400, { ok: false, error: `Theme "${slug}" already exists` });

    try {
      mkdirSync(themeDir, { recursive: true });
      const src = fromTheme || 'slate';
      if (lightTokens && darkTokens) {
        writeFileSync(join(themeDir, 'light.json'), JSON.stringify(lightTokens, null, 2));
        writeFileSync(join(themeDir, 'dark.json'),  JSON.stringify(darkTokens,  null, 2));
      } else {
        copyFileSync(join(ROOT, 'tokens/themes', src, 'light.json'), join(themeDir, 'light.json'));
        copyFileSync(join(ROOT, 'tokens/themes', src, 'dark.json'),  join(themeDir, 'dark.json'));
      }

      // Add slug to build.js THEMES array
      const buildPath = join(ROOT, 'build.js');
      let buildSrc = readFileSync(buildPath, 'utf8');
      buildSrc = buildSrc.replace(
        /const THEMES = \[([^\]]+)\]/,
        (_, inner) => {
          const list = inner.split(',').map(t => t.trim().replace(/'/g, '')).filter(Boolean);
          if (!list.includes(slug)) list.push(slug);
          return `const THEMES = [${list.map(t => `'${t}'`).join(', ')}]`;
        }
      );
      writeFileSync(buildPath, buildSrc);

      const { stdout } = await execFileP('node', ['build.js'], { cwd: ROOT });
      return reply(res, 200, { ok: true, theme: slug, log: stdout });
    } catch (e) {
      return reply(res, 500, { ok: false, error: e.message });
    }
  }

  reply(res, 404, { error: 'Not found' });
}

createServer(handle).listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Theme Editor  →  http://localhost:${PORT}\n`);
  console.log('  Edit tokens visually and save back to disk.');
  console.log('  Ctrl+S inside the editor saves and rebuilds.\n');
});
