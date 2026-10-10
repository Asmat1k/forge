import { BASE_URL, CONTENT_TYPE_HEADER, MAX_UPLOAD_BYTES, STATUS } from '../constants.js';
import { reply } from '../http/response.js';

export async function readMultipart(req, res) {
  const contentType = req.headers[CONTENT_TYPE_HEADER.toLowerCase()] || '';
  if (!/^multipart\/form-data(?:;|$)/i.test(contentType)) {
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
    return await new Request(BASE_URL, {
      method: req.method,
      headers: { [CONTENT_TYPE_HEADER]: contentType },
      body: Buffer.concat(chunks),
    }).formData();
  } catch {
    reply(res, STATUS.BAD_REQUEST, 'Invalid multipart form');
  }
}

export function getFile(form, name) {
  const file = form.get(name);
  return file && typeof file !== 'string' ? file : null;
}
