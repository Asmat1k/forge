export function reply(res, status, body, type = 'text/plain; charset=UTF-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}
