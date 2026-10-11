import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { STATUS } from '../../constants.js';
import { reply } from '../../http/response.js';
import { getFile, readMultipart } from '../../utils/multipart.js';

const compress = promisify(gzip);

export async function zipper(req, res) {
  const form = await readMultipart(req, res);
  if (!form) return;

  const file = getFile(form, 'file');
  if (!file) return reply(res, STATUS.BAD_REQUEST, 'Missing file field');

  const result = await compress(file);
  res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
  reply(res, STATUS.OK, result, 'application/gzip');
}
