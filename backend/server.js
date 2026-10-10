import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { handleRequest } from './app.js';

export const server = createServer(handleRequest);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  server.listen(3000, () => console.log('http://localhost:3000'));
}
