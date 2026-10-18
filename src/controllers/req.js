export function requestResource(req, res, http) {
  const addr = req.method === 'POST' ? req.body?.addr ?? req.query.addr : req.query.addr;
  let url;
  try {
    if (typeof addr !== 'string') throw new Error();
    url = new URL(addr);
    if (url.protocol !== 'http:') throw new Error();
  } catch {
    return res.status(400).type('text/plain').send('Expected an HTTP addr');
  }

  const upstream = http.get(url, response => {
    res.type('text/plain');
    response.on('error', () => res.destroy());
    response.pipe(res);
  });
  upstream.on('error', () => {
    if (res.headersSent) return res.destroy();
    res.status(502).type('text/plain').send('Unable to fetch resource');
  });
  res.on('close', () => upstream.destroy());
}
