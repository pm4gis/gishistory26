import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifests = JSON.parse(fs.readFileSync(path.join(root, 'content/masters-preservation-manifest-2026-10-10.json'), 'utf8'));
test('2026 masters integration retains all sourced content intact', () => {
  const paths = Object.keys(manifests);
  assert.equal(paths.length, 93);
  for (const file of paths) {
    const data = fs.readFileSync(path.join(root, file));
    const digest = crypto.createHash('sha256').update(data).digest('hex');
    assert.equal(digest, manifests[file], 'Content integrity mismatch: ' + file);
  }
});
