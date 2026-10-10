import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { gunzipSync } from 'node:zlib';
import { test } from 'node:test';
import { handleRequest } from '../backend/app.js';

// Exercise the request listener without opening a network socket.
async function request(path, options = {}) {
  const input = new Request(`http://localhost${path}`, options);
  const req = Readable.from([Buffer.from(await input.arrayBuffer())]);
  req.method = input.method;
  req.url = path;
  req.headers = Object.fromEntries(input.headers);
  const headers = new Headers();
  let response;
  const res = {
    headersSent: false,
    setHeader(name, value) { headers.set(name, value); },
    writeHead(status, values) {
      this.status = status;
      this.headersSent = true;
      for (const [name, value] of Object.entries(values)) headers.set(name, value);
    },
    end(body) { response = new Response(body, { status: this.status, headers }); },
  };
  await handleRequest(req, res);
  return response;
}

test('task endpoints preserve source text and common headers', async () => {
  const bodies = {
    '/login': 'asmat1k',
    '/sample': 'function task(x) { return x * (this ** 2); }',
    '/promise': `function task(x) {
  return new Promise((resolve, reject) => {
    if (x < 18) {
      resolve('yes');
    } else {
      reject('no');
    }
  });
}`,
  };
  for (const [path, body] of Object.entries(bodies)) {
    const response = await request(`${path}?ignored=true`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/plain; charset=UTF-8');
    assert.equal(response.headers.get('x-author'), 'asmat1k');
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.equal(response.headers.get('access-control-allow-methods'), '*');
    assert.equal(await response.text(), body);
  }
});

test('HTML pages resolve correctly after moving their module', async () => {
  for (const [path, file] of [['/', 'index'], ['/zipper', 'zipper'], ['/fetch', 'fetch']]) {
    const response = await request(path);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=UTF-8');
    assert.equal(await response.text(), await readFile(new URL(`../frontend/${file}.html`, import.meta.url), 'utf8'));
  }
});

test('unknown paths and unsupported methods retain the 404 response', async () => {
  for (const [path, method] of [['/missing', 'GET'], ['/toString', 'GET'], ['/login', 'POST'], ['/zipper', 'PUT'], ['/', 'OPTIONS']]) {
    const response = await request(path, { method });
    assert.equal(response.status, 404);
    assert.equal(await response.text(), 'Not found');
  }
});

test('zipper returns a gzip attachment containing the uploaded bytes', async () => {
  for (const bytes of [Buffer.from([0, 255, 1, 128, 10]), Buffer.alloc(0)]) {
    const form = new FormData();
    form.set('file', new Blob([bytes]), 'input.bin');
    const response = await request('/zipper', { method: 'POST', body: form });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/gzip');
    assert.equal(response.headers.get('content-disposition'), 'attachment; filename="result.gz"');
    assert.deepEqual(gunzipSync(Buffer.from(await response.arrayBuffer())), bytes);
  }
});

test('zipper retains upload validation and the 1 MiB request limit', async () => {
  const missing = new FormData();
  const text = new FormData();
  text.set('file', 'not a file');
  const oversized = new FormData();
  oversized.set('file', new Blob([Buffer.alloc(1024 * 1024)]), 'large.bin');
  const cases = [
    [{ body: 'text' }, 400, 'Expected a multipart file upload'],
    [{ body: 'invalid', headers: { 'Content-Type': 'multipart/form-data; boundary=test' } }, 400, 'Invalid multipart form'],
    [{ body: missing }, 400, 'Missing file field'],
    [{ body: text }, 400, 'Missing file field'],
    [{ body: oversized }, 413, 'Upload must be at most 1 MiB including form data'],
  ];
  for (const [options, status, body] of cases) {
    const response = await request('/zipper', { method: 'POST', ...options });
    assert.equal(response.status, status);
    assert.equal(await response.text(), body);
  }
});
