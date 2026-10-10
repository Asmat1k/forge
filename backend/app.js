import { login } from './modules/tasks/login.js';
import { routes } from './http/routes.js';
import { reply } from './http/response.js';

export async function handleRequest(req, res) {
  console.info(`[app] Set default headers`);
  res.setHeader('X-Author', login);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  const path = new URL(req.url, 'http://localhost').pathname;

  try {
    console.info(`[app] Get handler`);
    const handler = routes.get(`${req.method} ${path}`);
    if (handler) {
      console.info(`[app] Has handler - ${handler}`);
      return await handler(req, res);
    }

    console.info(`[app] Has no handler`);
    reply(res, 404, 'Not found');
  } catch (error) {
    console.error(`[app] ${error}`);
    if (!res.headersSent) reply(res, 500, 'Internal server error');
    else res.end();
  }
}
