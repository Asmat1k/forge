import { constants, privateDecrypt } from 'node:crypto';
import { getFile, readMultipart } from '../utils/multipart.js';

export async function decypher(req, res) {
  const form = await readMultipart(req, res);
  if (!form) return;

  const key = getFile(form, 'key');
  const secret = getFile(form, 'secret');
  if (!key) return res.status(400).type('text/plain').send('Missing key file');
  if (!secret) return res.status(400).type('text/plain').send('Missing secret file');

  try {
    const result = privateDecrypt({
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha1',
      key,
    }, secret);
    res.type('text/plain').send(result.toString('utf8'));
  } catch {
    return res.status(400).type('text/plain').send('Invalid key or secret');
  }
}
