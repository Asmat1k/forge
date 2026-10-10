import { login } from '../modules/tasks/login.js';
import { sample } from '../modules/tasks/sample.js';
import { promise } from '../modules/tasks/promise.js';
import { zipper } from '../modules/tasks/zipper.js';
import { reply } from './response.js';

export const routes = new Map([
  ['GET /login', (req, res) => reply(res, 200, login)],
  ['GET /sample', (req, res) => reply(res, 200, sample.toString())],
  ['GET /promise', (req, res) => reply(res, 200, promise.toString())],
  ['POST /zipper', zipper],
]);
