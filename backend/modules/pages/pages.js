import { readFile } from 'node:fs/promises';
import { reply } from '../../http/response.js';

export const pages = {
  '/': new URL('../../../frontend/index.html', import.meta.url),
  '/zipper': new URL('../../../frontend/zipper.html', import.meta.url),
  '/fetch': new URL('../../../frontend/fetch.html', import.meta.url),
};
