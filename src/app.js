import { fileURLToPath } from 'node:url';
import { createRoutes } from './routes/index.js';
import { AUTHOR } from './constants.js';

export default function createApp(express, bodyParser, createReadStream, crypto, http) {
  const app = express();
  const routes = createRoutes(express, bodyParser, createReadStream, crypto, http, fileURLToPath(import.meta.url));

  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Author', AUTHOR);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.use(express.static(fileURLToPath(new URL('../public/', import.meta.url))));
  app.use((req, res, next) => {
    if (req.path.endsWith('/')) return next();
    const queryIndex = req.originalUrl.indexOf('?');
    const query = queryIndex === -1 ? '' : req.originalUrl.slice(queryIndex);
    res.redirect(308, `${req.path.replace(/^\/+/, '/')}/${query}`);
  });
  app.use('/api', routes);
  app.use('/', routes);
  app.all('/{*path}', (req, res) => res.type('text/plain').send(AUTHOR));
  return app;
}
