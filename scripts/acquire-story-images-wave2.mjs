import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { rawDataset } from '../src/lib/raw.mjs';
import { hash } from '../src/lib/editorial.mjs';

const queue = JSON.parse(await fs.readFile('docs/media/curated-sources-story-wave2.json', 'utf8'));
const data = rawDataset();
const report = { checkedAt: new Date().toISOString(), success: 0, existing: 0, failed: 0, held: 0, items: [] };
const operations = [];
const newRecords = [];
const changedPassages = new Map();
const changedArticles = new Map();
const updateDate = new Date().toISOString().slice(0, 10);
const sha = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const userAgent = 'NZGISHistory/1.0 (documentary history publication; https://history.pm4gis.nz)';

async function fetchBytes(url, { maxBytes = 30 * 1024 * 1024, referer } = {}) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 55_000);
    try {
      const headers = {
        'User-Agent': userAgent,
        Accept: 'image/jpeg,image/png,image/svg+xml,image/tiff,application/octet-stream,*/*',
      };
      if (referer) headers.Referer = referer;
      const response = await fetch(url, { signal: controller.signal, headers });
      if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).host}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (!buffer.length || buffer.length > maxBytes) throw new Error(`Empty source or larger than ${Math.round(maxBytes / 1024 / 1024)} MiB`);
      return { buffer, finalUrl: response.url, mediaType: response.headers.get('content-type') || '' };
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1_000 * (attempt + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function verifyCommons(item) {
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  for (const [key, value] of Object.entries({
    action: 'query', titles: item.commonsTitle, prop: 'imageinfo', iiprop: 'url|extmetadata|size',
    format: 'json', formatversion: '2',
  })) api.searchParams.set(key, value);
  const response = await fetch(api, {
    signal: AbortSignal.timeout(25_000),
    headers: { 'User-Agent': userAgent, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Commons metadata HTTP ${response.status}`);
  const payload = await response.json();
  const info = payload.query?.pages?.[0]?.imageinfo?.[0];
  if (!info) throw new Error('Commons image metadata is unavailable');
  const liveLicence = info.extmetadata?.LicenseShortName?.value?.trim();
  if (liveLicence !== item.licence) throw new Error(`Commons licence changed or does not match (${liveLicence || 'missing'})`);
  if (!info.url?.startsWith('https://upload.wikimedia.org/wikipedia/commons/')) throw new Error('Image is not hosted as a Commons original');
  return { originalUrl: info.url, sourceTitle: info.canonicaltitle || item.commonsTitle, licence: liveLicence };
}

async function verifyNationalLibrary(item) {
  if (!item.sourceUrl?.startsWith('https://natlib.govt.nz/records/')) throw new Error('National Library record URL is missing');
  if (!item.sourceOriginalUrl?.startsWith('https://ndhadeliver.natlib.govt.nz/delivery/DeliveryManagerServlet?dps_pid=IE')) {
    throw new Error('National Library source image URL is not an approved delivery URL');
  }
  const manualEvidence = item.manualRightsEvidence?.toLowerCase() || '';
  const manuallyVerified = Boolean(item.rightsReviewedAt) &&
    manualEvidence.includes('may be used, copied and re-distributed free of charge') &&
    manualEvidence.includes('sourced from linz. crown copyright reserved.');
  if (!manuallyVerified) {
    const response = await fetch(item.sourceUrl, {
      signal: AbortSignal.timeout(25_000),
      headers: { 'User-Agent': userAgent, Accept: 'text/html', Referer: 'https://natlib.govt.nz/' },
    });
    if (!response.ok) throw new Error(`National Library rights record HTTP ${response.status}`);
    const html = (await response.text()).toLowerCase().replace(/&nbsp;/g, ' ');
    if (!html.includes('may be used, copied and re-distributed free of charge') ||
        !html.includes('sourced from linz. crown copyright reserved.')) {
      throw new Error('National Library record did not expose the free-reuse terms and required acknowledgement');
    }
  }
  return { originalUrl: item.sourceOriginalUrl, sourceTitle: 'National Library of New Zealand digital map scan', licence: item.licence };
}

async function storeImage(item, originalUrl, sourceTitle) {
  const downloaded = await fetchBytes(originalUrl, {
    maxBytes: item.maxDownloadBytes || 30 * 1024 * 1024,
    referer: item.sourceUrl,
  });
  const sourceBuffer = downloaded.buffer;
  const sourceMetadata = await sharp(sourceBuffer, { limitInputPixels: 500_000_000 }).metadata();
  const acceptedFormats = new Set(['jpeg', 'png', 'svg', 'tiff']);
  if (!acceptedFormats.has(sourceMetadata.format) || sourceMetadata.width < 300 || sourceMetadata.height < 250) {
    throw new Error(`Unsupported or too-small source image (${sourceMetadata.format || 'unknown'} ${sourceMetadata.width || 0}×${sourceMetadata.height || 0})`);
  }

  let localSourceBuffer = sourceBuffer;
  let localMetadata = sourceMetadata;
  let extension = sourceMetadata.format === 'jpeg' ? 'jpg' : sourceMetadata.format === 'tiff' ? 'tif' : sourceMetadata.format;
  let sourceNote = 'The locally stored source file is unchanged. Responsive display and card derivatives are resized without cropping and follow the source licence; share-alike terms apply where required.';
  if (sourceMetadata.format === 'tiff') {
    const localWidth = item.maxStoredSourceWidth || 2_400;
    localSourceBuffer = await sharp(sourceBuffer, { limitInputPixels: 500_000_000 })
      .rotate().resize({ width: localWidth, withoutEnlargement: true })
      .jpeg({ quality: 92, mozjpeg: true }).toBuffer();
    localMetadata = await sharp(localSourceBuffer).metadata();
    extension = 'jpg';
    sourceNote = `The National Library TIFF master remains linked above. The locally stored source rendition is a ${localMetadata.width}-pixel-wide JPEG to keep the page asset within site limits; it is resized without cropping. Display and card derivatives follow the source reuse terms.`;
  }

  const original = `/assets/historical/original/${item.slug}.${extension}`;
  const web = `/assets/historical/web/${item.slug}.webp`;
  const thumb = `/assets/historical/card/${item.slug}.webp`;
  const recordPath = `src/content/images/${item.slug}.json`;
  for (const file of [recordPath, `public${original}`, `public${web}`, `public${thumb}`]) {
    try { await fs.access(file); throw new Error(`Refusing to overwrite existing image file: ${file}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }

  const webImage = await sharp(localSourceBuffer, { limitInputPixels: 500_000_000 })
    .rotate().resize({ width: 1_600, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer();
  const cardImage = await sharp(localSourceBuffer, { limitInputPixels: 500_000_000 })
    .rotate().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toBuffer();
  for (const file of [original, web, thumb]) await fs.mkdir(path.dirname(`public${file}`), { recursive: true });
  await fs.writeFile(`public${original}`, localSourceBuffer);
  await fs.writeFile(`public${web}`, webImage);
  await fs.writeFile(`public${thumb}`, cardImage);

  const article = data.articles.find((entry) => entry.slug === item.articleSlug);
  if (!article) throw new Error(`Unknown article slug ${item.articleSlug}`);
  const updatedArticle = changedArticles.get(article.id) || structuredClone(article);
  updatedArticle.updatedAt = updateDate;
  changedArticles.set(article.id, updatedArticle);
  const record = {
    id: item.id,
    slug: item.slug,
    title: item.title,
    assetPath: web,
    sourceUrl: item.sourceUrl,
    sourceName: item.sourceName,
    credit: item.credit,
    licence: item.licence,
    licenceUrl: item.licenceUrl,
    licenceEvidenceUrl: item.licenceEvidenceUrl,
    altText: item.altText,
    caption: item.caption,
    themeIds: item.themeIds || article.themeIds || [],
    articleSlug: item.articleSlug,
    chapterNumber: item.chapter,
    dateDisplay: item.dateDisplay,
    context: item.context,
    originalAssetPath: original,
    thumbnailPath: thumb,
    originalSha256: sha(localSourceBuffer),
    webSha256: sha(webImage),
    originalWidth: localMetadata.width,
    originalHeight: localMetadata.height,
    sourceFileTitle: sourceTitle,
    headerCandidate: false,
    sourceOriginalUrl: downloaded.finalUrl,
    sourceMasterUrl: sourceMetadata.format === 'tiff' ? downloaded.finalUrl : undefined,
    derivativesNote: sourceNote,
    relatedRecords: item.relatedRecords || [],
  };
  return { record, original, web, thumb, sourceBytes: sourceBuffer.length, localBytes: localSourceBuffer.length, sourceMetadata };
}

function addToPatch(item, record) {
  const passage = data.passages.find((entry) => entry.articleId === data.articles.find((article) => article.slug === item.articleSlug)?.id &&
    (entry.blocks || []).some((block) => block.id === item.afterParagraphId));
  if (!passage) throw new Error(`Could not locate paragraph ${item.afterParagraphId} for image placement`);
  const updated = changedPassages.get(passage.id) || structuredClone(passage);
  updated.updatedAt = updateDate;
  if ((updated.blocks || []).some((block) => block.imageId === record.id || block.id === item.figureId)) {
    throw new Error(`Figure is already present in passage ${passage.id}`);
  }
  const index = updated.blocks.findIndex((block) => block.id === item.afterParagraphId && block.type === 'paragraph');
  if (index < 0) throw new Error(`Placement target ${item.afterParagraphId} is not a paragraph`);
  const figure = {
    id: item.figureId,
    type: 'figure',
    imageId: record.id,
    alt: record.altText,
    caption: record.caption,
    credit: record.credit,
    sources: [{ label: record.sourceName, url: record.sourceUrl }],
  };
  updated.blocks.splice(index + 1, 0, figure);
  changedPassages.set(passage.id, updated);
}

for (const item of queue.items) {
  const result = { slug: item.slug, sourcePage: item.sourceUrl, status: 'pending' };
  try {
    if (!item.id || !/^image:[-a-z0-9]+$/.test(item.id)) throw new Error('Invalid permanent image ID');
    if (!item.slug || !/^[-a-z0-9]+$/.test(item.slug)) throw new Error('Invalid image slug');
    const existing = data.images.find((image) => image.id === item.id);
    if (existing) {
      const passage = data.passages.find((entry) => (entry.blocks || []).some((block) => block.imageId === item.id));
      if (!passage) throw new Error('An image record exists without its expected inline figure; refusing to overwrite it');
      result.status = 'already-acquired';
      report.existing += 1;
      report.items.push(result);
      continue;
    }
    const permission = item.sourceType === 'commons'
      ? await verifyCommons(item)
      : item.sourceType === 'natlib'
        ? await verifyNationalLibrary(item)
        : (() => { throw new Error(`Unsupported source type ${item.sourceType}`); })();
    if (permission.licence !== item.licence) throw new Error(`Source licence differs from curated queue (${permission.licence})`);
    const downloaded = await storeImage(item, permission.originalUrl, permission.sourceTitle);
    addToPatch(item, downloaded.record);
    operations.push({ collection: 'images', action: 'add', value: downloaded.record });
    newRecords.push(downloaded.record);
    Object.assign(result, {
      status: 'downloaded',
      sourceLicenceVerified: permission.licence,
      sourceOriginalUrl: downloaded.record.sourceOriginalUrl,
      original: downloaded.original,
      display: downloaded.web,
      card: downloaded.thumb,
      sourceBytes: downloaded.sourceBytes,
      localBytes: downloaded.localBytes,
      dimensions: [downloaded.sourceMetadata.width, downloaded.sourceMetadata.height],
      localDimensions: [downloaded.record.originalWidth, downloaded.record.originalHeight],
      originalSha256: downloaded.record.originalSha256,
      displaySha256: downloaded.record.webSha256,
    });
    report.success += 1;
  } catch (error) {
    result.status = item.optional ? 'held' : 'failed';
    result.error = String(error.message || error);
    if (item.optional) report.held += 1;
    else report.failed += 1;
  }
  report.items.push(result);
  console.log(`${item.slug}: ${result.status}${result.error ? ` (${result.error})` : ''}`);
}

for (const passage of changedPassages.values()) {
  operations.push({ collection: 'passages', action: 'replace', value: passage, acceptedEditorialChange: true });
}
for (const article of changedArticles.values()) {
  operations.push({ collection: 'articles', action: 'replace', value: article, acceptedEditorialChange: true });
}
if (operations.length) {
  await fs.writeFile('docs/media/story-image-operations-wave2.json', JSON.stringify({ baseRevision: hash(data), operations }, null, 2) + '\n');
} else {
  await fs.rm('docs/media/story-image-operations-wave2.json', { force: true });
}
await fs.writeFile('docs/media/story-image-download-wave2.json', JSON.stringify(report, null, 2) + '\n');

const resultingImages = [...data.images, ...newRecords];
const coveredArticles = new Set(resultingImages.map((image) => image.articleSlug).filter(Boolean));
const chapterCount = data.articles.filter((article) => article.slug !== 'preface').length;
const coveredChapters = data.articles.filter((article) => article.slug !== 'preface' && coveredArticles.has(article.slug)).length;
const markdown = [
  '# Inline story image expansion — wave 2',
  '',
  `Acquisition run: ${report.checkedAt}. ${report.success} new images downloaded and verified; ${report.existing} already present; ${report.held} optional sources held; ${report.failed} required sources failed.`,
  '',
  `Documentary imagery now appears in ${coveredChapters} of ${chapterCount} chapters based on the local image catalogue.`,
  '',
  '| Chapter | Image | In-story placement | Reuse terms |',
  '|---:|---|---|---|',
];
for (const item of queue.items) {
  const status = report.items.find((entry) => entry.slug === item.slug);
  if (status?.status === 'downloaded' || status?.status === 'already-acquired') {
    markdown.push(`| ${item.chapter} | [${item.title}](${item.sourceUrl}) | Immediately after “${item.afterParagraphId}” | ${item.licence} |`);
  }
}
const held = report.items.filter((item) => item.status === 'held');
if (held.length) {
  markdown.push('', '## Held sources', '');
  for (const item of held) markdown.push(`- ${item.slug}: ${item.error}. No local image or story figure was created.`);
}
markdown.push('', 'Only images with verified reuse terms were added. Source context, dates and figure placement are recorded in each image detail page and the editorial release patch.', '');
await fs.writeFile('docs/media/story-image-expansion-wave2.md', markdown.join('\n'));

console.log(`Acquired ${report.success} of ${queue.items.length} curated sources; held optional sources ${report.held}; required failures ${report.failed}.`);
if (report.failed) process.exitCode = 1;
