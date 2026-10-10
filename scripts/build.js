import { cp, mkdir, rm } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const path of ['backend', 'frontend', 'package.json']) {
  await cp(new URL(`../${path}`, import.meta.url), new URL(path, dist), { recursive: true });
}
