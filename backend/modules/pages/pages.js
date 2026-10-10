import { readFile } from 'node:fs/promises';
import { reply } from '../../http/response.js';

export const pages = {
  '/': new URL('../../../frontend/index.html', import.meta.url),
  '/zipper': new URL('../../../frontend/zipper.html', import.meta.url),
  '/fetch': new URL('../../../frontend/fetch.html', import.meta.url),
};

export const getPagesRoutes = Object.entries(pages).map(([path, file]) => [
  `GET ${path}`,
  async (req, res) => reply(res, 200, await readFile(file), 'text/html; charset=UTF-8'),
]);
