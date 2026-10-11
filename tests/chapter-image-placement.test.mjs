import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MEDIA_CUTOFF_DATE,
  chapterImagePlacements,
  hasExplicitCutoffDate,
  imagesForPassage,
  isWithinMediaCutoff,
} from '../src/lib/chapter-image-placements.mjs';

test('uses an explicit 2025-12-31 media cutoff', () => {
  assert.equal(MEDIA_CUTOFF_DATE, '2025-12-31');
  assert.equal(isWithinMediaCutoff({ subjectDateEnd: '2025-12-31' }), true);
  assert.equal(isWithinMediaCutoff({ subjectDateEnd: '2026-01-01' }), false);
  assert.equal(isWithinMediaCutoff({ dateDisplay: 'Current by 2026' }), false);
  assert.equal(hasExplicitCutoffDate({ subjectDateEnd: '2025-04-02' }), true);
  assert.equal(hasExplicitCutoffDate({ dateDisplay: 'circa 1910' }), false);
});

test('keeps legacy chapter images beside their mapped passages', () => {
  assert.equal(Object.keys(chapterImagePlacements).length, 48);
  const image = {
    id: 'image:tuki',
    slug: 'tuki-map-1793-1798',
    articleSlug: 'what-the-computer-inherited',
    assetPath: '/assets/tuki.webp',
    dateDisplay: '1793 (drawing); 1798 (publication)',
  };
  const article = { slug: 'what-the-computer-inherited' };
  const passage = { slug: 'existing-map-records-0170b9d0d6' };
  assert.deepEqual(imagesForPassage([image], article, passage), [image]);
  assert.deepEqual(imagesForPassage([image], { slug: 'another-chapter' }, passage), []);
});

test('honours explicit passage links and omits media beyond the cutoff', () => {
  const article = { slug: 'example' };
  const passage = { slug: 'surveying' };
  const linked = { slug: 'new-map', articleSlug: 'example', passageSlug: 'surveying', subjectDateEnd: '2025-12-31' };
  const future = { slug: 'future-map', articleSlug: 'example', passageSlug: 'surveying', subjectDateEnd: '2026-01-01' };
  const misplaced = { slug: 'other-passage', articleSlug: 'example', passageSlug: 'elsewhere', subjectDateEnd: '2024-01-01' };
  assert.deepEqual(imagesForPassage([linked, future, misplaced], article, passage), [linked]);
});
