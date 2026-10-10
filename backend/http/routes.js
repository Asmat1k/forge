import { sample } from '../modules/tasks/sample.js';
import { promise } from '../modules/tasks/promise.js';
import { zipper } from '../modules/tasks/zipper.js';
import { decypher } from '../modules/tasks/decypher.js';
import { size2json } from '../modules/tasks/size2json.js';
import { reply } from './response.js';
import { AUTHOR, STATUS } from '../constants.js';
import { getPagesRoutes } from '../modules/pages/pages.js';

export const routes = new Map([
  ...getPagesRoutes,
  ['GET /login', (req, res) => reply(res, STATUS.OK, AUTHOR)],
  ['GET /sample', (req, res) => reply(res, STATUS.OK, sample.toString())],
  ['GET /promise', (req, res) => reply(res, STATUS.OK, promise.toString())],
  ['POST /zipper', zipper],
  ['POST /decypher', decypher],
  ['POST /size2json', size2json],
  ['POST /size2json/', size2json],
]);
