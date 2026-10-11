import busboy from 'busboy';
import { CONTENT_TYPE_HEADER, MAX_UPLOAD_BYTES, STATUS } from '../constants.js';
import { reply } from '../http/response.js';

export async function readMultipart(req, res) {
  const contentType = req.headers[CONTENT_TYPE_HEADER.toLowerCase()] || '';
  if (contentType.split(';', 1)[0].toLowerCase() !== 'multipart/form-data') {
    reply(res, STATUS.BAD_REQUEST, 'Expected a multipart file upload');
    return;
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_UPLOAD_BYTES) {
      reply(res, 413, 'Upload must be at most 1 MiB including form data');
      req.resume();
      return;
    }
    chunks.push(chunk);
  }
  try {
    return await new Promise((resolve, reject) => {
      const parser = busboy({ headers: req.headers });
      const form = new Map();
      parser.on('field', (name, value) => {
        if (!form.has(name)) form.set(name, value);
      });
      parser.on('file', (name, file) => {
        file.on('error', reject);
        if (form.has(name)) {
          file.resume();
          return;
        }
        form.set(name, null);
        const chunks = [];
        file.on('data', chunk => chunks.push(chunk));
        file.on('end', () => form.set(name, Buffer.concat(chunks)));
      });
      parser.on('error', reject);
      parser.on('close', () => resolve(form));
      parser.end(Buffer.concat(chunks));
    });
  } catch {
    reply(res, STATUS.BAD_REQUEST, 'Invalid multipart form');
  }
}

export function getFile(form, name) {
  const file = form.get(name);
  return Buffer.isBuffer(file) ? file : null;
}
