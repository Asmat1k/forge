import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { getFile, readMultipart } from '../utils/multipart.js';

const compress = promisify(gzip);

export async function zipper(req, res) {
  const form = await readMultipart(req, res);
  if (!form) return;

  const file = getFile(form, 'file');
  if (!file) return res.status(400).type('text/plain').send('Missing file field');

  const result = await compress(file);
  res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
  res.type('application/gzip').send(result);
}
