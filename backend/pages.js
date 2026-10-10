import { readFile } from 'node:fs/promises';
import { reply } from './api/response.js';

export const pages = {
  '/': new URL('../frontend/index.html', import.meta.url),
  '/zipper': new URL('../frontend/zipper.html', import.meta.url),
  '/fetch': new URL('../frontend/fetch.html', import.meta.url),
};

export async function servePage(path, res) {
  reply(res, 200, await readFile(pages[path], 'utf8'), 'text/html; charset=UTF-8');
}
