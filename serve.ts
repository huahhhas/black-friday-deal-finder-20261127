// Tiny static server for local testing only: serves app/ at http://localhost:8080.
// Usage: node serve.ts [--port 8080]

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.argv.find((a) => a.startsWith('--port='))?.slice(7) ?? 8080);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const path = normalize(join(here, 'app', decodeURIComponent(req.url.split(/[?#]/)[0] || '/'))).replace(/\/$/, '/index.html');
  if (!path.startsWith(join(here, 'app'))) { res.writeHead(403); res.end(); return; }
  try {
    const body = await readFile(path.endsWith('/') ? path + 'index.html' : path);
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});

server.listen(port, () => console.log(`DealBeacon at http://localhost:${port}`));
