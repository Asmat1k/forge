import { login } from './features/login.js';
import { sample } from './features/sample.js';
import { promise } from './features/promise.js';
import { pages, servePage } from './pages.js';
import { zipper } from './features/zipper.js';
import { reply } from './api/response.js';

export async function handleRequest(req, res) {
  res.setHeader('X-Author', login);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  const path = new URL(req.url, 'http://localhost').pathname;

  try {
    if (req.method === 'GET' && path === '/login') return reply(res, 200, login);
    if (req.method === 'GET' && path === '/sample') return reply(res, 200, sample.toString());
    if (req.method === 'GET' && path === '/promise') return reply(res, 200, promise.toString());
    if (req.method === 'GET' && Object.hasOwn(pages, path)) return await servePage(path, res);
    if (req.method === 'POST' && path === '/zipper') return await zipper(req, res);

    reply(res, 404, 'Not found');
  } catch (error) {
    console.error(error);
    if (!res.headersSent) reply(res, 500, 'Internal server error');
    else res.end();
  }
}
