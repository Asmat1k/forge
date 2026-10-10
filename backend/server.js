import { createServer } from 'node:http';
import { errorMonitor } from 'node:events';
import { pathToFileURL } from 'node:url';
import { handleRequest } from './app.js';

export const server = createServer(handleRequest);
server.on(errorMonitor, (error) => console.error('[server] Server error', error));
server.on('close', () => console.info('[server] Server closed'));

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, '0.0.0.0', () => console.info('[server] Server listening', server.address()));
}
