import { getFile, readMultipart } from '../utils/multipart.js';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_HEADER_BYTES = 33;
const WIDTH_OFFSET = 16;
const HEIGHT_OFFSET = 20;

export async function size2json(req, res) {
  const form = await readMultipart(req, res);
  if (!form) return;

  const file = getFile(form, 'image');
  if (!file) return res.status(400).type('text/plain').send('Missing image field');
  const header = file.subarray(0, PNG_HEADER_BYTES);
  if (header.length < PNG_HEADER_BYTES || !header.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    return res.status(400).type('text/plain').send('Expected a PNG image');
  }

  const width = header.readUInt32BE(WIDTH_OFFSET);
  const height = header.readUInt32BE(HEIGHT_OFFSET);
  res.json({ width, height });
}
