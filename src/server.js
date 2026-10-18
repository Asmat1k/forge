import { createServer } from 'node:http';
import { errorMonitor } from 'node:events';
import { pathToFileURL } from 'node:url';
import { app } from './index.js';

export const server = createServer(app);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, '0.0.0.0');
}
