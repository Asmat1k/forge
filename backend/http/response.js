import { CONTENT_TYPE_HEADER } from '../constants.js';

export function reply(res, status, body, type = 'text/plain; charset=UTF-8') {
  res.writeHead(status, { [CONTENT_TYPE_HEADER]: type });
  res.end(body);
}
