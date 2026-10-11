import { Router } from 'express';
import { sample } from '../controllers/sample.js';
import { promise } from '../controllers/promise.js';
import { zipper } from '../controllers/zipper.js';
import { decypher } from '../controllers/decypher.js';
import { size2json } from '../controllers/size2json.js';
import { AUTHOR } from '../constants.js';

export const routes = Router();
routes.get('/login', (req, res) => res.type('text/plain').send(AUTHOR));
routes.get('/sample', (req, res) => res.type('text/plain').send(sample.toString()));
routes.get('/promise', (req, res) => res.type('text/plain').send(promise.toString()));
routes.post('/zipper', zipper);
routes.post('/decypher', decypher);
routes.post('/size2json', size2json);
