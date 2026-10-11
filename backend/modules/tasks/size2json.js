import { STATUS } from '../../constants.js';
import { reply } from '../../http/response.js';
import { getFile, readMultipart } from '../../utils/multipart.js';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_HEADER_BYTES = 33;
const WIDTH_OFFSET = 16;
const HEIGHT_OFFSET = 20;

export async function size2json(req, res) {
  const form = await readMultipart(req, res);
  if (!form) return;

  const file = getFile(form, 'image');
  if (!file) return reply(res, STATUS.BAD_REQUEST, 'Missing image field');
  const header = file.subarray(0, PNG_HEADER_BYTES);
  if (header.length < PNG_HEADER_BYTES || !header.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    return reply(res, STATUS.BAD_REQUEST, 'Expected a PNG image');
  }

  const width = header.readUInt32BE(WIDTH_OFFSET);
  const height = header.readUInt32BE(HEIGHT_OFFSET);
  reply(res, STATUS.OK, JSON.stringify({ width, height }), 'application/json');
}
