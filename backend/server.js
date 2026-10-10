import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { handleRequest } from './app.js';

export const server = createServer(handleRequest);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, '0.0.0.0', () => console.log(`Server listening on port ${port}`));
}
