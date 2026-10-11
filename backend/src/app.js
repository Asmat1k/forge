import express from 'express';
import { routes } from './routes/index.js';
import { AUTHOR } from './constants.js';

export const app = express();

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Author', AUTHOR);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/api', routes);
app.use('/', routes);
app.use((req, res) => res.status(404).type('text/plain').send('Not found'));
app.use((error, req, res, next) => {
  console.error('[app]', error);
  if (res.headersSent) return next(error);
  res.status(500).type('text/plain').send('Internal server error');
});
