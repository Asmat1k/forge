import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { reply } from '../api/response.js';

const compress = promisify(gzip);

export async function zipper(req, res) {
  if (!/^multipart\/form-data(?:;|$)/i.test(req.headers['content-type'] || '')) {
    return reply(res, 400, 'Expected a multipart file upload');
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      reply(res, 413, 'Upload must be at most 1 MiB including form data');
      req.resume();
      return;
    }
    chunks.push(chunk);
  }
  let form;
  try {
    form = await new Request('http://localhost/zipper', {
      method: 'POST',
      headers: { 'Content-Type': req.headers['content-type'] },
      body: Buffer.concat(chunks),
    }).formData();
  } catch {
    return reply(res, 400, 'Invalid multipart form');
  }
  const file = form.get('file');
  if (!file || typeof file === 'string') return reply(res, 400, 'Missing file field');
  const result = await compress(Buffer.from(await file.arrayBuffer()));
  res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
  reply(res, 200, result, 'application/gzip');
}
