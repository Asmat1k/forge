import { constants, privateDecrypt } from 'node:crypto';
import { STATUS } from '../../constants.js';
import { reply } from '../../http/response.js';
import { getFile, readMultipart } from '../../utils/multipart.js';

export async function decypher(req, res) {
  const form = await readMultipart(req, res);
  if (!form) return;

  const key = getFile(form, 'key');
  const secret = getFile(form, 'secret');
  if (!key) return reply(res, STATUS.BAD_REQUEST, 'Missing key file');
  if (!secret) return reply(res, STATUS.BAD_REQUEST, 'Missing secret file');

  try {
    const result = privateDecrypt({
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha1',
      key,
    }, secret);
    reply(res, STATUS.OK, result.toString('utf8'));
  } catch {
    return reply(res, STATUS.BAD_REQUEST, 'Invalid key or secret');
  }
}
