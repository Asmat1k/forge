import { sample } from '../controllers/sample.js';
import { promise } from '../controllers/promise.js';
import { zipper } from '../controllers/zipper.js';
import { decypher } from '../controllers/decypher.js';
import { size2json } from '../controllers/size2json.js';
import { requestResource } from '../controllers/req.js';
import { AUTHOR } from '../constants.js';

export function createRoutes(express, bodyParser, createReadStream, crypto, http, codePath) {
  const routes = express.Router();

  routes.get('/login/', (req, res) => res.type('text/plain').send(AUTHOR));
  routes.get('/code/', (req, res, next) => {
    res.type('text/plain');
    createReadStream(codePath)
      .on('error', next)
      .pipe(res);
  });
  routes.get('/sha1/:input/', (req, res) => {
    res.type('text/plain')
      .send(crypto.createHash('sha1')
      .update(req.params.input)
      .digest('hex'));
  });
  routes.get('/req/', (req, res) => requestResource(req, res, http));
  routes.post('/req/', bodyParser.urlencoded({ extended: false }), bodyParser.json(), (req, res) => requestResource(req, res, http));
  routes.get('/sample/', (req, res) => res.type('text/plain').send(sample.toString()));
  routes.get('/promise/', (req, res) => res.type('text/plain').send(promise.toString()));
  routes.post('/zipper/', zipper);
  routes.post('/decypher/', decypher);
  routes.post('/size2json/', size2json);

  return routes;
}
