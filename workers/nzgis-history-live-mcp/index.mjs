const LIVE_DATA_URL = 'https://history.pm4gis.nz/editor-data.json';
const SITE_ROOT = 'https://history.pm4gis.nz';
const SERVER_NAME = 'A History of GIS in New Zealand Live';
const SERVER_VERSION = '2026-10-13.2';
const PROTOCOL_VERSION = '2025-06-18';

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type, accept, mcp-session-id, mcp-protocol-version',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      ...headers,
    },
  });
}

async function getData() {
  const res = await fetch(LIVE_DATA_URL, {
    headers: { 'accept': 'application/json', 'user-agent': 'NZ-GIS-History-Live-MCP/1.0' },
    cf: { cacheTtl: 0 },
  });
  if (!res.ok) throw new Error('Live publication fetch failed: ' + res.status);
  const payload = await res.json();
  const sourceData = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  if (!sourceData || !Array.isArray(sourceData.records)) throw new Error('Live dataset does not contain records');
  const data = { ...sourceData, sourceRevision: payload?.revision || sourceData.sourceRevision || sourceData.revision || null };
  if (!Array.isArray(data.edges)) data.edges = Array.isArray(data.relationships) ? data.relationships : [];
  if (!Array.isArray(data.events)) data.events = [];
  if (!Array.isArray(data.passages)) data.passages = [];
  if (!Array.isArray(data.articles)) data.articles = [];
  return data;
}

function norm(v) {
  return String(v ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function absUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_ROOT + (path.startsWith('/') ? path : '/' + path);
}

function compactText(v) {
  return String(v ?? '').replace(/\s+/g, ' ').trim();
}

function sourceList(record) {
  return [...(record.sources || []), ...(record.researchSources || [])]
    .map(s => ({ label: s.label || s.title || s.id || 'Source', url: s.url || null, id: s.id || null }));
}

function buildIndex(data) {
  const items = [...(data.records || []), ...(data.passages || []), ...(data.events || []), ...(data.articles || [])];
  return new Map(items.map(item => [item.id, item]));
}

function chapterNumber(item) {
  const explicit = item?.chapterNumber ?? item?.number ?? item?.readingOrder;
  if (Number.isFinite(Number(explicit)) && Number(explicit) > 0) return Number(explicit);
  const match = String(item?.id || '').match(/chapter[:\-](\d+)/i);
  return match ? Number(match[1]) : null;
}

function articleForPassage(data, passage) {
  return (data.articles || []).find(article => article.id === passage.articleId) || null;
}

function passagePageUrl(data, passage) {
  const article = articleForPassage(data, passage);
  const base = absUrl(article?.url || passage.url);
  if (!base || !passage.slug) return base;
  return base.replace(/#.*$/, '') + '#' + passage.slug;
}

function edgeRelationships(data, recordId) {
  const byId = buildIndex(data);
  const out = [];
  for (const e of data.edges || []) {
    let other = null;
    if (e.a === recordId) other = e.b;
    else if (e.b === recordId) other = e.a;
    else continue;
    const r = byId.get(other);
    if (!r) continue;
    out.push({
      name: r.name || r.title || other,
      kind: r.kind || null,
      relationship: e.label || 'Related',
      basis: e.basis || null,
      page_url: absUrl(r.url),
    });
  }
  return out;
}

function chapterLinks(data, record) {
  const chapterRecords = new Map((data.records || [])
    .filter(item => item.kind === 'Chapter')
    .map(item => [chapterNumber(item), item])
    .filter(([number]) => number));
  const numbers = new Set((record.chapters || []).map(Number).filter(number => Number.isFinite(number) && number > 0));
  for (const passage of data.passages || []) {
    if ((passage.recordIds || []).includes(record.id)) {
      const number = chapterNumber(articleForPassage(data, passage));
      if (number) numbers.add(number);
    }
  }
  return [...numbers].sort((a, b) => a - b).map(number => {
    const chapter = chapterRecords.get(number);
    const article = (data.articles || []).find(item => chapterNumber(item) === number);
    return {
      number,
      title: chapter?.title || chapter?.name || article?.title || 'Chapter ' + number,
      page_url: absUrl(chapter?.url || article?.url),
      relationship: 'Chapter linked from the published profile',
    };
  });
}

function exactEntity(data, name, kind) {
  const q = norm(name);
  const candidates = (data.records || []).filter(r => !kind || r.kind === kind);
  let found = candidates.find(r => norm(r.name) === q);
  if (!found) found = candidates.find(r => (r.aliases || []).some(a => norm(a) === q));
  return found || null;
}

function scoreText(haystack, query) {
  const h = norm(haystack);
  const q = norm(query);
  if (!q) return 0;
  if (h === q) return 1000;
  if (h.includes(q)) return 300;
  const toks = q.split(' ').filter(Boolean);
  let score = 0;
  for (const t of toks) if (h.includes(t)) score += 25;
  return score;
}

function recordSearchText(r) {
  return [
    r.name, r.title, r.kind, r.category, ...(r.aliases || []), ...(r.story || []),
    ...(r.sources || []).flatMap(s => [s.label, s.id, s.url]),
    ...(r.researchSources || []).flatMap(s => [s.label, s.id, s.url]),
  ].filter(Boolean).join(' ');
}

function searchHistory(data, query, kind, limit = 10) {
  const scored = [];
  for (const record of data.records || []) {
    if (kind && record.kind !== kind) continue;
    const score = scoreText(record.name || record.title || '', query) * 2 + scoreText(recordSearchText(record), query);
    if (score > 0) {
      const story = compactText((record.story || []).join(' '));
      scored.push({
        score,
        id: record.id,
        name: record.name || record.title || record.id,
        title: record.title || record.name || record.id,
        kind: record.kind,
        category: record.category || null,
        url: absUrl(record.url),
        snippet: story ? story.slice(0, 420) : null,
      });
    }
  }
  if (!kind || kind === 'Chapter' || kind === 'Preface') {
    for (const passage of data.passages || []) {
      const article = articleForPassage(data, passage);
      const passageKind = article?.isPreface || /preface/i.test(article?.title || '') ? 'Preface' : 'Chapter';
      if (kind && kind !== passageKind) continue;
      const text = [passage.title, article?.title, ...(passage.blocks || []).map(block => block.text || block.markdown || '')].filter(Boolean).join(' ');
      const score = scoreText(text, query);
      if (score > 0) {
        scored.push({
          score,
          id: passage.id,
          name: passage.title || article?.title || 'Published passage',
          title: passage.title || article?.title || 'Published passage',
          kind: passageKind,
          category: null,
          url: passagePageUrl(data, passage),
          snippet: compactText((passage.blocks || []).map(block => block.text || block.markdown || '').join(' ')).slice(0, 420),
        });
      }
    }
  }
  if (!kind || kind === 'Timeline event') {
    for (const event of data.events || []) {
      const title = event.title || event.label || 'Timeline event';
      const text = [title, event.text, event.summary, event.description, event.date, event.dateDisplay, event.startDate, event.endDate, event.year, ...(event.categories || [])].filter(Boolean).join(' ');
      const score = scoreText(text, query);
      if (score > 0) scored.push({
        score,
        id: event.id || 'event:' + (event.year || event.startDate || event.date || '') + ':' + title,
        name: title,
        title,
        kind: 'Timeline event',
        category: null,
        url: absUrl(event.url),
        snippet: compactText(event.text || event.summary || event.description || '').slice(0, 420),
      });
    }
  }
  scored.sort((a, b) => b.score - a.score || String(a.name).localeCompare(String(b.name)));
  return scored.slice(0, Math.max(1, Math.min(10, Number(limit) || 10))).map(({score, ...item}) => item);
}

function getEntityHistory(data, name, kind) {
  const record = exactEntity(data, name, kind);
  if (!record) return { query: name, status: 'not_found', profile: null, publication: publicationSummary(data) };
  const legacyPassages = (record.passages || []).map(passage => ({
    id: passage.id || null,
    title: passage.title || passage.id || 'Published passage',
    chapter_number: passage.chapter || null,
    page_url: absUrl(passage.url),
    relationship: 'Name appears in this published passage',
  }));
  const linkedPassages = (data.passages || [])
    .filter(passage => (passage.recordIds || []).includes(record.id))
    .map(passage => ({
      id: passage.id,
      title: passage.title || articleForPassage(data, passage)?.title || 'Published passage',
      chapter_number: chapterNumber(articleForPassage(data, passage)),
      page_url: passagePageUrl(data, passage),
      relationship: 'Name is linked to this published passage',
    }));
  const passageAppearances = [...legacyPassages, ...linkedPassages]
    .filter((passage, index, all) => all.findIndex(other => other.id === passage.id || other.page_url === passage.page_url) === index);
  return {
    query: name,
    status: 'exact_match',
    profile: {
      id: record.id,
      name: record.name,
      kind: record.kind,
      category: record.category || null,
      aliases: record.aliases || [],
      profile_url: absUrl(record.url),
      published_account: record.story || [],
      linked_references: sourceList(record),
      indexed_chapters: chapterLinks(data, record),
      passage_appearances: passageAppearances,
      labelled_relationships: edgeRelationships(data, record.id),
    },
    publication: publicationSummary(data),
  };
}

function traceEvidence(data, claim, limit = 10) {
  const toks = norm(claim).split(' ').filter(Boolean);
  const hits = [];
  const push = (score, item) => { if (score > 0) hits.push({ score, ...item }); };
  for (const record of data.records || []) {
    for (const passage of record.story || []) {
      const score = scoreText(passage, claim);
      if (score > 0) push(score + 20, { type: (record.kind || 'Record') + ' account', record_id: record.id, title: record.name || record.title || record.id, passage: compactText(passage), page_url: absUrl(record.url), references: sourceList(record) });
    }
    for (const source of sourceList(record)) {
      const score = scoreText([source.label, source.id, source.url].filter(Boolean).join(' '), claim);
      if (score > 0) push(score, { type: 'Source reference', record_id: record.id, title: source.label, passage: null, page_url: source.url, references: [source] });
    }
    if (record.kind === 'Chapter') {
      for (const section of record.sections || []) {
        for (const block of section.blocks || []) {
          const text = compactText([block.title, block.text, block.body, ...(block.paragraphs || [])].filter(Boolean).join(' '));
          let score = scoreText(text, claim);
          if (!score && toks.length) score = toks.reduce((total, token) => total + (norm(text).includes(token) ? 8 : 0), 0);
          if (score > 0) push(score + 10, { type: 'Chapter passage', record_id: record.id, title: block.title || section.title || record.title || record.name || record.id, passage: text.slice(0, 1200), page_url: absUrl(record.url), references: (block.sources || []).map(source => typeof source === 'string' ? {label:source,url:null,id:null} : source) });
        }
      }
    }
  }
  for (const passage of data.passages || []) {
    const article = articleForPassage(data, passage);
    const pageUrl = passagePageUrl(data, passage);
    for (const block of passage.blocks || []) {
      const paragraphText = typeof block.paragraphs === 'string' ? block.paragraphs : (block.paragraphs || []).map(item => typeof item === 'string' ? item : item?.text || item?.markdown || '').join(' ');
      const text = compactText([block.title, block.text, block.markdown, block.body, paragraphText].filter(Boolean).join(' '));
      let score = scoreText(text, claim);
      if (!score && toks.length) score = toks.reduce((total, token) => total + (norm(text).includes(token) ? 8 : 0), 0);
      if (score > 0) {
        const references = [...(passage.sources || []), ...(block.sources || [])].map(source => typeof source === 'string' ? {label:source,url:null,id:null} : source);
        push(score + 10, { type: 'Chapter passage', record_id: passage.id, title: block.title || passage.title || article?.title || passage.id, passage: text.slice(0, 1200), page_url: pageUrl, references });
      }
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return { claim, matched: hits.length, results: hits.slice(0, Math.max(1, Math.min(10, Number(limit) || 10))).map(({score, ...item}) => item), publication: publicationSummary(data) };
}

function listTimeline(data, fromYear, toYear, limit = 100) {
  const lo = fromYear == null ? -Infinity : Number(fromYear);
  const hi = toYear == null ? Infinity : Number(toYear);
  const events = (data.events || []).filter(event => {
    const start = Number(event.year || String(event.startDate || event.date || '').slice(0, 4));
    const end = Number(event.endYear || String(event.endDate || '').slice(0, 4) || start);
    return (!Number.isFinite(start) || (end >= lo && start <= hi));
  }).sort((a, b) => Number(a.year || String(a.startDate || a.date || '').slice(0, 4)) - Number(b.year || String(b.startDate || b.date || '').slice(0, 4)) || String(a.id).localeCompare(String(b.id)))
    .slice(0, Math.max(1, Math.min(200, Number(limit) || 100)));
  return { events, count: events.length, publication: publicationSummary(data) };
}

function publicationSummary(data) {
  const counts = {};
  for (const record of data.records || []) counts[record.kind] = (counts[record.kind] || 0) + 1;
  const editorial = data.editorialPatchState || null;
  return {
    revision: editorial?.revision || data.govtReleaseResearch?.revision || data.peopleExpansion?.revision || data.peopleExpansionResearch?.revision || 'live-publication',
    sourceRevision: data.sourceRevision || null,
    sequence: editorial?.sequence ?? 0,
    updatedAt: editorial?.updatedAt ?? null,
    summary: editorial?.summary || 'Live history.pm4gis.nz publication',
    recordCount: (data.records || []).length,
    edgeCount: (data.edges || []).length,
    eventCount: (data.events || []).length,
    passageCount: (data.passages || []).length,
    editorialPatchConflictCount: (data.editorialPatchConflicts || []).length,
    kindCounts: counts,
    dataUrl: LIVE_DATA_URL,
    serverVersion: SERVER_VERSION,
    smallUpdatesAvailable: true,
    editorAuthorised: true,
    publicWebsiteUpdatedByMcp: false,
    publicPublicationSource: 'GitHub main / Cloudflare Pages',
  };
}

function parsePath(path) {
  if (typeof path !== 'string' || !path || path.length > 240) throw new Error('Invalid path');
  let p = path.trim();
  let tokens;
  if (p.startsWith('/')) {
    tokens = p.split('/').slice(1).filter(Boolean).map(x => /^\d+$/.test(x) ? Number(x) : x);
  } else {
    p = p.replace(/\[(\d+)\]/g, '.$1');
    tokens = p.split('.').filter(Boolean).map(x => /^\d+$/.test(x) ? Number(x) : x);
  }
  if (!tokens.length || tokens.some(x => x === '__proto__' || x === 'prototype' || x === 'constructor')) throw new Error('Unsupported path');
  return tokens;
}

function getPath(obj, tokens) {
  let cur = obj;
  for (const t of tokens) {
    if (cur == null || !(t in Object(cur))) return undefined;
    cur = cur[t];
  }
  return cur;
}

function setPath(obj, tokens, value) {
  let cur = obj;
  for (let i = 0; i < tokens.length - 1; i++) {
    const t = tokens[i];
    if (cur == null || !(t in Object(cur))) throw new Error('Path no longer exists');
    cur = cur[t];
  }
  const leaf = tokens[tokens.length - 1];
  if (cur == null || !(leaf in Object(cur))) throw new Error('Path no longer exists');
  cur[leaf] = structuredClone(value);
}

function validRefArray(v) {
  if (!Array.isArray(v) || v.length > 50) return false;
  return v.every(x => x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).every(k => ['id','label','title','url','note','accessed','date'].includes(k)));
}

function allowedEditorialPath(record, tokens, after) {
  const root = tokens[0];
  if (root === 'name') return record.kind === 'Person' && tokens.length === 1 && typeof after === 'string' && after.trim().length > 0 && after.length <= 200;
  if (root === 'story') return tokens.length === 2 && Number.isInteger(tokens[1]) && typeof after === 'string' && after.length <= 20000;
  if (root === 'sources' || root === 'researchSources') return tokens.length === 1 && validRefArray(after);
  if (root === 'sourceNotes') return tokens.length === 3 && Number.isInteger(tokens[1]) && tokens[2] === 'text' && typeof after === 'string' && after.length <= 20000;
  if (root === 'sections' && record.kind === 'Chapter') {
    if (tokens.length < 5 || !Number.isInteger(tokens[1]) || tokens[2] !== 'blocks' || !Number.isInteger(tokens[3])) return false;
    const tail = tokens.slice(4);
    if (tail.length === 1 && ['title','text','body'].includes(tail[0])) return typeof after === 'string' && after.length <= 20000;
    if (tail.length === 2 && tail[0] === 'paragraphs' && Number.isInteger(tail[1])) return typeof after === 'string' && after.length <= 20000;
    if (tail.length === 1 && tail[0] === 'sources') return Array.isArray(after) && after.length <= 50;
  }
  const isPassage = Boolean(record.articleId && Array.isArray(record.blocks));
  if (isPassage && root === 'blocks' && tokens.length === 3 && Number.isInteger(tokens[1])) {
    if (tokens[2] === 'text') return typeof after === 'string' && after.length <= 20000;
    if (tokens[2] === 'sources') return validRefArray(after);
  }
  if (isPassage && root === 'sources') return tokens.length === 1 && validRefArray(after);
  const isTimelineEvent = record.datePrecision !== undefined && (record.label !== undefined || record.startDate !== undefined);
  if (isTimelineEvent && tokens.length === 1 && ['label','summary'].includes(root)) return typeof after === 'string' && after.trim().length > 0 && after.length <= 20000;
  if (isTimelineEvent && root === 'sources') return tokens.length === 1 && validRefArray(after);
  return false;
}

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

function validateEditorialOperations(data, operations) {
  if (!Array.isArray(operations) || operations.length < 1 || operations.length > 30) throw new Error('operations must contain 1 to 30 changes');
  const byId = buildIndex(data);
  const checked = [];
  for (const op of operations) {
    if (!op || typeof op.recordId !== 'string' || typeof op.path !== 'string' || !('before' in op) || !('after' in op)) throw new Error('Malformed operation');
    const record = byId.get(op.recordId);
    if (!record) throw new Error(`Unknown record: ${op.recordId}`);
    const tokens = parsePath(op.path);
    if (!allowedEditorialPath(record, tokens, op.after)) throw new Error(`Unsupported editorial path: ${op.path}`);
    const current = getPath(record, tokens);
    if (current === undefined) throw new Error(`Path does not exist: ${op.recordId} ${op.path}`);
    if (record.kind === 'Person' && tokens[0] === 'name') {
      const replacement = String(op.after).normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
      if (data.records.some(other => other.id !== record.id && other.kind === 'Person' && String(other.name || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase() === replacement)) throw new Error(`Duplicate Person name: ${op.after}`);
    }
    if (!deepEqual(current, op.before)) throw new Error(`Before value no longer matches: ${op.recordId} ${op.path}`);
    if (deepEqual(op.before, op.after)) throw new Error(`No change supplied: ${op.recordId} ${op.path}`);
    checked.push({ recordId: op.recordId, path: op.path, before: structuredClone(op.before), after: structuredClone(op.after) });
  }
  return checked;
}

function setEditorialValue(item, tokens, value) {
  setPath(item, tokens, value);
  if (tokens[0] === 'blocks' && Number.isInteger(tokens[1]) && tokens[2] === 'text') {
    const block = item.blocks?.[tokens[1]];
    if (block && 'markdown' in block) block.markdown = value;
  }
}

function applyEditorialOperations(data, operations) {
  const byId = buildIndex(data);
  const conflicts = [];
  for (const operation of operations || []) {
    const item = byId.get(operation.recordId);
    if (!item) { conflicts.push({recordId:operation.recordId,path:operation.path,reason:'missing_item'}); continue; }
    let tokens;
    try { tokens = parsePath(operation.path); } catch (_) { conflicts.push({recordId:operation.recordId,path:operation.path,reason:'invalid_path'}); continue; }
    const current = getPath(item, tokens);
    if (current === undefined) { conflicts.push({recordId:operation.recordId,path:operation.path,reason:'missing_path'}); continue; }
    if (deepEqual(current, operation.after)) continue;
    if (!deepEqual(current, operation.before)) { conflicts.push({recordId:operation.recordId,path:operation.path,reason:'source_changed'}); continue; }
    try { setEditorialValue(item, tokens, operation.after); }
    catch (_) { conflicts.push({recordId:operation.recordId,path:operation.path,reason:'apply_failed'}); }
  }
  data.editorialPatchConflicts = conflicts;
  return data;
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return [...hash].map(b => b.toString(16).padStart(2,'0')).join('');
}

function randomToken() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return [...b].map(x => x.toString(16).padStart(2,'0')).join('');
}

async function readEditorState(env, includeHistory = false) {
  const row = await env.EDITORIAL_DB.prepare('SELECT revision,sequence,updated_at,summary,operations_json FROM editorial_state WHERE id=1').first();
  if (!row) throw new Error('Editorial state is not initialised');
  const state = {
    revision: row.revision,
    sequence: Number(row.sequence),
    updatedAt: row.updated_at || null,
    summary: row.summary,
    operations: JSON.parse(row.operations_json || '[]'),
  };
  if (includeHistory) {
    const q = await env.EDITORIAL_DB.prepare('SELECT revision,sequence,created_at,summary,restored_from FROM editorial_revisions ORDER BY sequence DESC LIMIT 50').all();
    state.history = (q.results || []).map(x => ({ revision:x.revision, sequence:Number(x.sequence), createdAt:x.created_at, summary:x.summary, restoredFrom:x.restored_from || null }));
  }
  return state;
}

async function getEffectiveData(env, state = null) {
  const currentState = state || await readEditorState(env, false);
  const data = await getData();
  data.editorialPatchState = {
    revision:currentState.revision,
    sequence:currentState.sequence,
    updatedAt:currentState.updatedAt,
    summary:currentState.summary,
  };
  return applyEditorialOperations(data, currentState.operations);
}

async function previewHistoryPatch(env, args) {
  const state = await readEditorState(env, false);
  if (args.expectedRevision !== state.revision) throw new Error('Stale revision: expected ' + args.expectedRevision + ', current ' + state.revision);
  if (typeof args.summary !== 'string' || !args.summary.trim() || args.summary.length > 500) throw new Error('Invalid summary');
  const data = await getEffectiveData(env, state);
  const operations = validateEditorialOperations(data, args.operations);
  const payload = { type:'patch', expectedRevision:state.revision, summary:args.summary.trim(), operations, createdAt:new Date().toISOString() };
  const digest = await sha256Hex(JSON.stringify(payload));
  const token = randomToken();
  await env.EDITORIAL_KV.put('preview:' + token, JSON.stringify({ ...payload, digest }), { expirationTtl: 900 });
  return { status:'preview', revision:state.revision, sequence:state.sequence, previewToken:token, previewDigest:digest, expiresInSeconds:900, summary:payload.summary, operations };
}

async function publishHistoryPatch(env, args) {
  const key = 'preview:' + (args.previewToken || '');
  const raw = await env.EDITORIAL_KV.get(key);
  if (!raw) throw new Error('Invalid, expired or already-used preview token');
  await env.EDITORIAL_KV.delete(key);
  const preview = JSON.parse(raw);
  if (preview.type !== 'patch') throw new Error('Preview token is not for a patch publication');
  const supplied = { type:'patch', expectedRevision:args.expectedRevision, summary:String(args.summary || '').trim(), operations:args.operations, createdAt:preview.createdAt };
  const digest = await sha256Hex(JSON.stringify(supplied));
  if (digest !== preview.digest) throw new Error('Preview contents do not match the publish request');
  const state = await readEditorState(env, false);
  if (state.revision !== args.expectedRevision) throw new Error('Stale revision: expected ' + args.expectedRevision + ', current ' + state.revision);
  const data = await getEffectiveData(env, state);
  const operations = validateEditorialOperations(data, args.operations);
  const nextSequence = state.sequence + 1;
  const revision = 'editorial-' + String(nextSequence).padStart(6,'0');
  const now = new Date().toISOString();
  const activeOperations = [...state.operations, ...operations];
  const opJson = JSON.stringify(activeOperations);
  const stmts = [
    env.EDITORIAL_DB.prepare('UPDATE editorial_state SET revision=?,sequence=?,updated_at=?,summary=?,operations_json=? WHERE id=1 AND revision=?').bind(revision,nextSequence,now,args.summary.trim(),opJson,args.expectedRevision),
    env.EDITORIAL_DB.prepare('INSERT INTO editorial_revisions(revision,sequence,created_at,summary,operations_json,restored_from) SELECT ?,?,?,?,?,NULL WHERE EXISTS(SELECT 1 FROM editorial_state WHERE id=1 AND revision=?)').bind(revision,nextSequence,now,args.summary.trim(),opJson,revision)
  ];
  const result = await env.EDITORIAL_DB.batch(stmts);
  if (!result?.[0]?.meta || Number(result[0].meta.changes) !== 1 || Number(result?.[1]?.meta?.changes) !== 1) throw new Error('Concurrent publication detected; no revision was committed');
  return { status:'published_to_mcp_sidecar', revision, sequence:nextSequence, updatedAt:now, summary:args.summary.trim(), operationCount:operations.length, activeOperationCount:activeOperations.length, publicWebsiteUpdated:false, publicPublicationSource:'GitHub main / Cloudflare Pages' };
}

async function restoreHistoryRevision(env, args) {
  const state = await readEditorState(env, false);
  if (args.expectedRevision !== state.revision) throw new Error(`Stale revision: expected ${args.expectedRevision}, current ${state.revision}`);
  const target = await env.EDITORIAL_DB.prepare('SELECT revision,sequence,created_at,summary,operations_json FROM editorial_revisions WHERE revision=?').bind(args.revision).first();
  if (!target) throw new Error(`Unknown revision: ${args.revision}`);
  if (typeof args.summary !== 'string' || !args.summary.trim() || args.summary.length > 500) throw new Error('Invalid summary');
  if (!args.previewToken) {
    const payload = { type:'restore', expectedRevision:state.revision, revision:args.revision, summary:args.summary.trim(), createdAt:new Date().toISOString() };
    const digest = await sha256Hex(JSON.stringify(payload));
    const token = randomToken();
    await env.EDITORIAL_KV.put(`preview:${token}`, JSON.stringify({ ...payload, digest }), { expirationTtl: 900 });
    return { status:'preview', currentRevision:state.revision, restoreRevision:args.revision, previewToken:token, previewDigest:digest, expiresInSeconds:900, summary:payload.summary };
  }
  const key = `preview:${args.previewToken}`;
  const raw = await env.EDITORIAL_KV.get(key);
  if (!raw) throw new Error('Invalid, expired or already-used preview token');
  await env.EDITORIAL_KV.delete(key);
  const preview = JSON.parse(raw);
  const supplied = { type:'restore', expectedRevision:args.expectedRevision, revision:args.revision, summary:args.summary.trim(), createdAt:preview.createdAt };
  const digest = await sha256Hex(JSON.stringify(supplied));
  if (preview.type !== 'restore' || digest !== preview.digest) throw new Error('Preview contents do not match the restore request');
  const current = await readEditorState(env, false);
  if (current.revision !== args.expectedRevision) throw new Error(`Stale revision: expected ${args.expectedRevision}, current ${current.revision}`);
  const nextSequence = current.sequence + 1;
  const revision = `editorial-${String(nextSequence).padStart(6,'0')}`;
  const now = new Date().toISOString();
  const opJson = target.operations_json || '[]';
  const stmts = [
    env.EDITORIAL_DB.prepare('UPDATE editorial_state SET revision=?,sequence=?,updated_at=?,summary=?,operations_json=? WHERE id=1 AND revision=?').bind(revision,nextSequence,now,args.summary.trim(),opJson,args.expectedRevision),
    env.EDITORIAL_DB.prepare('INSERT INTO editorial_revisions(revision,sequence,created_at,summary,operations_json,restored_from) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM editorial_state WHERE id=1 AND revision=?)').bind(revision,nextSequence,now,args.summary.trim(),opJson,args.revision,revision)
  ];
  const result = await env.EDITORIAL_DB.batch(stmts);
  if (!result?.[0]?.meta || Number(result[0].meta.changes) !== 1 || Number(result?.[1]?.meta?.changes) !== 1) throw new Error('Concurrent restore detected; no revision was committed');
  return { status:'restored', revision, sequence:nextSequence, restoredFrom:args.revision, updatedAt:now, summary:args.summary.trim(), activeOperationCount:JSON.parse(opJson).length };
}

async function getPublicationState(env) {
  const state = await readEditorState(env, true);
  const data = await getEffectiveData(env, state);
  return {
    ...publicationSummary(data),
    revision:state.revision,
    sequence:state.sequence,
    updatedAt:state.updatedAt,
    summary:state.summary,
    history:state.history,
    operations:state.operations,
    editorialPatchConflicts:data.editorialPatchConflicts,
    smallUpdatesAvailable:true,
    editorAuthorised:true,
    publicWebsiteUpdatedByMcp:false,
    publicPublicationSource:'GitHub main / Cloudflare Pages',
  };
}

async function prepareGitHubPublicationHandoff(env, args) {
  const state = await readEditorState(env, false);
  if (args.expectedRevision !== state.revision) throw new Error('Stale MCP revision: expected ' + args.expectedRevision + ', current ' + state.revision);
  const current = await getData();
  const operations = [], privateOmissions = [];
  for (const [position, op] of state.operations.entries()) {
    const root = typeof op.path === 'string' ? op.path.replace(/^\//, '').split(/[./]/)[0] : '';
    if (root === 'researchSources' || root === 'sourceNotes') {
      privateOmissions.push({position, recordId:op.recordId, path:op.path, reason:'private_field'});
      continue;
    }
    operations.push(op);
  }
  return {
    status:'handoff_ready_for_git_reconciliation',
    expectedMcpRevision: state.revision,
    sourceRevision: current.sourceRevision,
    publicRepository: 'pm4gis/gishistory26',
    publishingBranch: 'main',
    operations,
    privateOmissions,
    publicWebsiteUpdated: false,
    note: 'Revalidate against the current GitHub content and Git head before preparing a pull request. Do not commit the private MCP envelope to the public repository.'
  };
}

const CANONICAL_TOOLING_REVISION = 'canonical-tooling-2026-10-12.1';
const RELEASE_CHUNK_SIZE = 100000;
const RELEASE_MAX_BYTES = 6 * 1024 * 1024;
const RELEASE_HOSTS = new Set(['history.pm4gis.nz','nzgis-consolidation-transfer-202610.vercel.app']);
function canonicalJSON(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${canonicalJSON(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
async function sha256Bytes(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return [...digest].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function releaseToken() { return [...crypto.getRandomValues(new Uint8Array(32))].map(b=>b.toString(16).padStart(2,'0')).join(''); }
function releaseChunks(text) {
  const parts=[];
  for(let i=0;i<text.length;){let end=Math.min(text.length,i+RELEASE_CHUNK_SIZE);if(end<text.length&&text.charCodeAt(end-1)>=0xd800&&text.charCodeAt(end-1)<=0xdbff)end--;parts.push(text.slice(i,end));i=end;}
  if(!parts.length) parts.push('');
  if(parts.length>90) throw new Error('Release exceeds the D1 atomic batch limit');
  return parts;
}
function releaseCounts(data) {
  const records=data?.records||[];
  return {records:records.length,persons:records.filter(r=>r.kind==='Person').length,edges:(data?.edges||[]).length,events:(data?.events||[]).length,chapters:records.filter(r=>r.kind==='Chapter').length};
}
function releaseExpectedCounts(manifest) {
  const counts=manifest?.counts;
  if(!counts||typeof counts!=='object'||Array.isArray(counts)) throw new Error('Release manifest must contain a counts object');
  const personCount=counts.persons ?? counts.personCount ?? manifest?.personCount;
  if(counts.persons!=null&&manifest?.personCount!=null&&Number(counts.persons)!==Number(manifest.personCount)) throw new Error('Manifest Person count fields disagree');
  const expected={records:counts.records,persons:personCount,edges:counts.edges,events:counts.events,chapters:counts.chapters};
  for(const [k,v] of Object.entries(expected)) if(!Number.isInteger(v)||v<0) throw new Error(`Manifest count for ${k} must be a non-negative integer`);
  return expected;
}
function releaseValidateDataset(data, expected) {
  if(!data||!Array.isArray(data.records)||!Array.isArray(data.edges)||!Array.isArray(data.events)) throw new Error('Dataset must contain records, edges and events arrays');
  if(!expected||typeof expected!=='object') throw new Error('Expected release counts are required');
  const counts=releaseCounts(data);
  for(const k of ['records','persons','edges','events','chapters']) if(counts[k]!==expected[k]) throw new Error(`Count mismatch for ${k}: expected ${expected[k]}, received ${counts[k]}`);
  const ids=new Set(), names=new Set(), slugs=new Set(), chapters=new Set();
  for(const r of data.records){
    if(!r||typeof r.id!=='string'||!r.id.trim()) throw new Error('Every record needs a permanent ID');
    if(ids.has(r.id)) throw new Error(`Duplicate record ID: ${r.id}`); ids.add(r.id);
    if(r.kind==='Person') { const n=String(r.name||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase(); if(!n) throw new Error(`Person ${r.id} has no name`); if(names.has(n)) throw new Error(`Duplicate Person name: ${r.name}`); names.add(n); }
    if(r.slug){const s=String(r.slug).toLocaleLowerCase();if(slugs.has(s))throw new Error(`Duplicate slug: ${r.slug}`);slugs.add(s);}
    if(r.kind==='Chapter'){const n=Number(r.number);if(!Number.isInteger(n)||n<1||chapters.has(n))throw new Error(`Invalid or duplicate chapter number: ${r.number}`);chapters.add(n);}
  }
  for(const e of data.edges){const a=e?.a??e?.source??e?.from,b=e?.b??e?.target??e?.to;if(!ids.has(a)||!ids.has(b))throw new Error(`Broken edge endpoint: ${a||'?'} -> ${b||'?'}`);}
  return counts;
}
function releaseEndpoints(e){return [e?.a??e?.source??e?.from,e?.b??e?.target??e?.to];}
function releaseAssertRetains(base,target){
  const ids=new Set(target.records.map(x=>x.id));for(const r of base.records||[])if(!ids.has(r.id))throw new Error(`Release removes existing record: ${r.id}`);
  const edges=new Set((target.edges||[]).map(canonicalJSON));for(const e of base.edges||[])if(!edges.has(canonicalJSON(e)))throw new Error('Release removes an existing edge');
  const events=new Set((target.events||[]).map(canonicalJSON));for(const e of base.events||[])if(!events.has(canonicalJSON(e)))throw new Error('Release removes an existing event');
}
function releaseOpType(op){return String(op?.op||op?.action||op?.type||'').toLowerCase();}
async function releaseApplyPatch(base,patch){
  if(!Array.isArray(patch?.operations))throw new Error('Patch must contain an operations array');
  const data=structuredClone(base),stats={addedRecords:0,modifiedRecords:0,addedEdges:0,modifiedEdges:0,addedEvents:0,modifiedEvents:0,alreadyApplied:0};
  const ident=x=>canonicalJSON(x);
  for(const op of patch.operations){
    const type=releaseOpType(op);if(/delete|remove/.test(type))throw new Error('Release patch removes content');
    const col=/edge/.test(type)?'edges':/event/.test(type)?'events':'records';
    const item=op.after??op.record??op.edge??op.event;if(!item||typeof item!=='object')throw new Error('Patch operation has no after-value');
    if(col==='records'){
      const id=op.recordId||op.id||item.id;if(!id||item.id!==id)throw new Error('Record patch ID must match its record ID');
      const i=data.records.findIndex(x=>x.id===id);
      if(/add|insert/.test(type)){if(i>=0){if(ident(data.records[i])===ident(item)){stats.alreadyApplied++;continue;}throw new Error(`Duplicate-ID conflict: ${id}`);}data.records.push(structuredClone(item));stats.addedRecords++;}
      else if(/replace|update|modify/.test(type)){if(i<0)throw new Error(`Patch conflict: record not found: ${id}`);if(ident(data.records[i])===ident(item)){stats.alreadyApplied++;continue;}const before=op.before!==undefined?ident(data.records[i])===ident(op.before):op.beforeSha256&&null;if(before===false)throw new Error(`Patch conflict: before-value changed for ${id}`);if(typeof op.beforeSha256==='string'&&await sha256Bytes(new TextEncoder().encode(ident(data.records[i])))!==op.beforeSha256.toLowerCase())throw new Error(`Patch conflict: before-value changed for ${id}`);if(op.before===undefined&&!op.beforeSha256)throw new Error(`Patch conflict: missing before-value for ${id}`);data.records[i]=structuredClone(item);stats.modifiedRecords++;}
      else throw new Error(`Unsupported record patch operation: ${type}`);
    } else {
      const a=data[col],afterKey=ident(item),i=a.findIndex(x=>ident(x)===ident(op.before??item)),already=a.some(x=>ident(x)===afterKey);
      if(/add|insert/.test(type)){if(already){stats.alreadyApplied++;continue;}if(i>=0)throw new Error(`Patch conflict: duplicate ${col} entry`);a.push(structuredClone(item));stats[col==='edges'?'addedEdges':'addedEvents']++;}
      else if(/replace|update|modify/.test(type)){if(already){stats.alreadyApplied++;continue;}if(i<0)throw new Error(`Patch conflict: before-value changed for ${col}`);a[i]=structuredClone(item);stats[col==='edges'?'modifiedEdges':'modifiedEvents']++;}
      else throw new Error(`Unsupported ${col} patch operation: ${type}`);
    }
  }
  return {data,stats};
}
async function fetchReleaseAsset(urlText,checksum,label){
  let url;try{url=new URL(urlText);}catch{throw new Error(`Invalid ${label} URL`);}
  if(url.protocol!=='https:'||!RELEASE_HOSTS.has(url.hostname)||url.username||url.password)throw new Error(`Unapproved ${label} URL host`);
  const response=await fetch(url,{redirect:'manual',headers:{accept:'application/json'}});
  if(response.status<200||response.status>=300||response.headers.get('location'))throw new Error(`${label} fetch failed or redirected (${response.status})`);
  const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length>6*1024*1024)throw new Error(`${label} exceeds the 6 MiB asset limit`);
  const actual=await sha256Bytes(bytes);if(actual!==String(checksum||'').toLowerCase())throw new Error(`${label} checksum mismatch`);
  let value;try{value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new Error(`${label} is not valid UTF-8 JSON`);}
  return {bytes,value,sha256:actual};
}
async function readCanonicalState(env){
  const row=await env.EDITORIAL_DB.prepare('SELECT revision,sequence,active_release_id,previous_release_id FROM canonical_release_state WHERE id=1').first();
  if(!row)throw new Error('Canonical release state is not initialised');
  return {revision:row.revision,sequence:Number(row.sequence),activeReleaseId:row.active_release_id||null,previousReleaseId:row.previous_release_id||null};
}
async function previewCanonicalRelease(env,args){
  const supplied=args.manifestUrl||args.packageReference;
  if(!supplied||Boolean(args.manifestUrl)===Boolean(args.packageReference))throw new Error('Supply exactly one manifestUrl or packageReference');
  const ref=args.manifestUrl||(/^https:\/\//i.test(args.packageReference)?args.packageReference:`https://history.pm4gis.nz/releases/${encodeURIComponent(args.packageReference)}/manifest.json`);
  if(!/^[a-f0-9]{64}$/i.test(args.manifestSha256||''))throw new Error('Invalid manifest SHA-256');
  const state=await readCanonicalState(env);if(args.expectedRevision!==state.revision)throw new Error(`Stale revision: expected ${args.expectedRevision}, current ${state.revision}`);
  const mf=await fetchReleaseAsset(ref,args.manifestSha256,'Manifest'),m=mf.value;
  if(m.schemaVersion!==1||!m.releaseId||!m.counts)throw new Error('Unsupported or incomplete release manifest');
  const [base,target,patch,recon]=await Promise.all([
    fetchReleaseAsset(m.baseUrl,m.baseSha256,'Base dataset'),fetchReleaseAsset(m.targetUrl,m.targetSha256,'Target dataset'),fetchReleaseAsset(m.patchUrl,m.patchSha256,'Patch'),fetchReleaseAsset(m.reconciliationUrl,m.reconciliationSha256,'Reconciliation report')
  ]);
  const expected=releaseExpectedCounts(m);
  const actual=releaseValidateDataset(target.value,expected);
  releaseValidateDataset(base.value,releaseCounts(base.value));
  const applied=await releaseApplyPatch(base.value,patch.value);
  if(canonicalJSON(applied.data)!==canonicalJSON(target.value))throw new Error('Deterministic patch result does not match target dataset');
  releaseAssertRetains(base.value,target.value);
  const publicCurrent=await getData();
  releaseAssertRetains(publicCurrent,target.value);
  const report=recon.value;if(report.baseSha256&&report.baseSha256.toLowerCase()!==m.baseSha256.toLowerCase())throw new Error('Reconciliation base checksum mismatch');if(report.targetSha256&&report.targetSha256.toLowerCase()!==m.targetSha256.toLowerCase())throw new Error('Reconciliation target checksum mismatch');if(report.patchSha256&&report.patchSha256.toLowerCase()!==m.patchSha256.toLowerCase())throw new Error('Reconciliation patch checksum mismatch');
  const targetText=new TextDecoder().decode(target.bytes);if(target.bytes.length>RELEASE_MAX_BYTES)throw new Error('Target dataset exceeds the canonical release size limit');
  const chunks=releaseChunks(targetText),token=releaseToken(),now=new Date(),expires=new Date(now.getTime()+15*60*1000).toISOString();
  const stmts=[env.EDITORIAL_DB.prepare('INSERT INTO canonical_release_previews(preview_token,preview_type,release_id,rollback_release_id,expected_revision,manifest_sha256,target_sha256,counts_json,target_byte_length,chunk_count,expires_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(token,'release',m.releaseId,null,state.revision,mf.sha256,m.targetSha256.toLowerCase(),JSON.stringify(actual),target.bytes.length,chunks.length,expires,now.toISOString())];
  chunks.forEach((v,i)=>stmts.push(env.EDITORIAL_DB.prepare('INSERT INTO canonical_release_preview_chunks(preview_token,chunk_index,payload) VALUES(?,?,?)').bind(token,i,v)));
  stmts.push(env.EDITORIAL_DB.prepare("INSERT INTO canonical_release_audit(action,release_id,prior_release_id,revision_before,revision_after,manifest_sha256,target_sha256,counts_json,actor,detail_json,created_at) VALUES('preview',?,NULL,?,NULL,?,?,?,?,?,?)").bind(m.releaseId,state.revision,mf.sha256,m.targetSha256.toLowerCase(),JSON.stringify(actual),'chat-mcp',JSON.stringify({patchStats:applied.stats,expiresAt:expires,toolingRevision:CANONICAL_TOOLING_REVISION,expectedCounts:expected}),now.toISOString()));
  const res=await env.EDITORIAL_DB.batch(stmts);if(Number(res?.[0]?.meta?.changes)!==1)throw new Error('Canonical preview could not be retained');
  return {status:'preview',tool:'publish_canonical_release',releaseId:m.releaseId,revision:state.revision,previewToken:token,expiresAt:expires,counts:actual,patchStats:applied.stats,targetSha256:m.targetSha256.toLowerCase(),manifestSha256:mf.sha256,toolingRevision:CANONICAL_TOOLING_REVISION};
}
async function publishCanonicalRelease(env,args){
  const state=await readCanonicalState(env);if(args.expectedRevision!==state.revision)throw new Error(`Stale revision: expected ${args.expectedRevision}, current ${state.revision}`);
  const p=await env.EDITORIAL_DB.prepare("SELECT * FROM canonical_release_previews WHERE preview_token=? AND preview_type='release'").bind(args.previewToken||'').first();
  if(!p||Date.parse(p.expires_at)<=Date.now())throw new Error('Invalid, expired or already-used release preview token');
  if(p.expected_revision!==args.expectedRevision)throw new Error('Preview revision does not match publish request');
  const chunksQ=await env.EDITORIAL_DB.prepare('SELECT chunk_index,payload FROM canonical_release_preview_chunks WHERE preview_token=? ORDER BY chunk_index').bind(p.preview_token).all();
  const target=(chunksQ.results||[]).map(x=>x.payload).join('');if((chunksQ.results||[]).length!==Number(p.chunk_count)||new TextEncoder().encode(target).length!==Number(p.target_byte_length))throw new Error('Stored preview data is incomplete');
  if(await sha256Bytes(new TextEncoder().encode(target))!==p.target_sha256)throw new Error('Stored preview target checksum mismatch');
  const existing=await env.EDITORIAL_DB.prepare('SELECT target_sha256 FROM canonical_releases WHERE release_id=?').bind(p.release_id).first();
  if(existing&&existing.target_sha256!==p.target_sha256)throw new Error('Release ID already exists with a different target checksum');
  if(state.activeReleaseId===p.release_id){
    const at=new Date().toISOString();await env.EDITORIAL_DB.batch([env.EDITORIAL_DB.prepare('DELETE FROM canonical_release_preview_chunks WHERE preview_token=?').bind(p.preview_token),env.EDITORIAL_DB.prepare('DELETE FROM canonical_release_previews WHERE preview_token=?').bind(p.preview_token),env.EDITORIAL_DB.prepare("INSERT INTO canonical_release_audit(action,release_id,prior_release_id,revision_before,revision_after,manifest_sha256,target_sha256,counts_json,actor,detail_json,created_at) VALUES('publish',?,?,?, ?,?,?,?,?,?,?)").bind(p.release_id,state.previousReleaseId,state.revision,state.revision,p.manifest_sha256,p.target_sha256,p.counts_json,'chat-mcp',JSON.stringify({idempotent:true}),at)]);
    return {status:'already_published',releaseId:p.release_id,revision:state.revision,idempotent:true};
  }
  const seq=state.sequence+1,revision=`canonical-${String(seq).padStart(6,'0')}`,now=new Date().toISOString(),parts=releaseChunks(target);
  const stmts=[env.EDITORIAL_DB.prepare('UPDATE canonical_release_state SET revision=?,sequence=?,previous_release_id=active_release_id,active_release_id=?,updated_at=? WHERE id=1 AND revision=?').bind(revision,seq,p.release_id,now,args.expectedRevision)];
  stmts.push(env.EDITORIAL_DB.prepare('INSERT INTO canonical_releases(release_id,target_sha256,manifest_sha256,counts_json,byte_length,chunk_count,created_at,published_revision,published_sequence,retained) SELECT ?,?,?,?,?,?,?,?,?,1 WHERE EXISTS(SELECT 1 FROM canonical_release_state WHERE id=1 AND revision=? AND active_release_id=?) ON CONFLICT(release_id) DO NOTHING').bind(p.release_id,p.target_sha256,p.manifest_sha256,p.counts_json,p.target_byte_length,parts.length,now,revision,seq,revision,p.release_id));
  if(!existing)parts.forEach((v,i)=>stmts.push(env.EDITORIAL_DB.prepare('INSERT INTO canonical_release_chunks(release_id,chunk_index,payload) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM canonical_releases WHERE release_id=? AND target_sha256=?) ON CONFLICT(release_id,chunk_index) DO NOTHING').bind(p.release_id,i,v,p.release_id,p.target_sha256)));
  stmts.push(env.EDITORIAL_DB.prepare("INSERT INTO canonical_release_audit(action,release_id,prior_release_id,revision_before,revision_after,manifest_sha256,target_sha256,counts_json,actor,detail_json,created_at) SELECT 'publish',?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM canonical_release_state WHERE id=1 AND revision=? AND active_release_id=?)").bind(p.release_id,state.activeReleaseId,state.revision,revision,p.manifest_sha256,p.target_sha256,p.counts_json,'chat-mcp',JSON.stringify({previewToken:p.preview_token}),now,revision,p.release_id));
  const res=await env.EDITORIAL_DB.batch(stmts);
  if(Number(res?.[0]?.meta?.changes)!==1){const fresh=await readCanonicalState(env);if(fresh.activeReleaseId===p.release_id&&existing?.target_sha256===p.target_sha256)return {status:'already_published',releaseId:p.release_id,revision:fresh.revision,idempotent:true};throw new Error(`Concurrent canonical publication detected; current revision is ${fresh.revision}`);}
  await env.EDITORIAL_DB.batch([env.EDITORIAL_DB.prepare('DELETE FROM canonical_release_preview_chunks WHERE preview_token=?').bind(p.preview_token),env.EDITORIAL_DB.prepare('DELETE FROM canonical_release_previews WHERE preview_token=?').bind(p.preview_token)]);
  return {status:'published',releaseId:p.release_id,revision,previousReleaseId:state.activeReleaseId,counts:JSON.parse(p.counts_json),targetSha256:p.target_sha256,rollbackAvailable:Boolean(state.activeReleaseId)};
}
async function previewCanonicalRollback(env,args){
  const state=await readCanonicalState(env);if(args.expectedRevision!==state.revision)throw new Error(`Stale revision: expected ${args.expectedRevision}, current ${state.revision}`);
  const release=await env.EDITORIAL_DB.prepare('SELECT release_id,target_sha256,counts_json FROM canonical_releases WHERE release_id=? AND retained=1').bind(args.releaseId).first();if(!release)throw new Error(`Unknown retained release: ${args.releaseId}`);
  const token=releaseToken(),now=new Date(),expires=new Date(now.getTime()+15*60*1000).toISOString();
  await env.EDITORIAL_DB.batch([env.EDITORIAL_DB.prepare('INSERT INTO canonical_release_previews(preview_token,preview_type,release_id,rollback_release_id,expected_revision,manifest_sha256,target_sha256,counts_json,target_byte_length,chunk_count,expires_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(token,'rollback',release.release_id,release.release_id,state.revision,'rollback',release.target_sha256,release.counts_json,0,0,expires,now.toISOString()),env.EDITORIAL_DB.prepare("INSERT INTO canonical_release_audit(action,release_id,prior_release_id,revision_before,revision_after,manifest_sha256,target_sha256,counts_json,actor,detail_json,created_at) VALUES('preview',?,?,?,NULL,'rollback',?,?,?, ?,?)").bind(release.release_id,state.activeReleaseId,state.revision,release.target_sha256,release.counts_json,'chat-mcp',JSON.stringify({type:'rollback',expiresAt:expires}),now.toISOString())]);
  return {status:'preview',tool:'rollback_canonical_release',releaseId:release.release_id,currentReleaseId:state.activeReleaseId,revision:state.revision,previewToken:token,expiresAt:expires,counts:JSON.parse(release.counts_json)};
}
async function rollbackCanonicalRelease(env,args){
  const state=await readCanonicalState(env);if(args.expectedRevision!==state.revision)throw new Error(`Stale revision: expected ${args.expectedRevision}, current ${state.revision}`);
  const p=await env.EDITORIAL_DB.prepare("SELECT * FROM canonical_release_previews WHERE preview_token=? AND preview_type='rollback'").bind(args.previewToken||'').first();if(!p||Date.parse(p.expires_at)<=Date.now())throw new Error('Invalid, expired or already-used rollback preview token');if(p.expected_revision!==state.revision)throw new Error('Rollback preview revision is stale');
  const seq=state.sequence+1,revision=`canonical-${String(seq).padStart(6,'0')}`,now=new Date().toISOString();
  const res=await env.EDITORIAL_DB.batch([env.EDITORIAL_DB.prepare('UPDATE canonical_release_state SET revision=?,sequence=?,previous_release_id=active_release_id,active_release_id=?,updated_at=? WHERE id=1 AND revision=?').bind(revision,seq,p.rollback_release_id,now,args.expectedRevision),env.EDITORIAL_DB.prepare("INSERT INTO canonical_release_audit(action,release_id,prior_release_id,revision_before,revision_after,manifest_sha256,target_sha256,counts_json,actor,detail_json,created_at) SELECT 'rollback',?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM canonical_release_state WHERE id=1 AND revision=? AND active_release_id=?)").bind(p.rollback_release_id,state.activeReleaseId,state.revision,revision,'rollback',p.target_sha256,p.counts_json,'chat-mcp',JSON.stringify({previewToken:p.preview_token}),now,revision,p.rollback_release_id)]);
  if(Number(res?.[0]?.meta?.changes)!==1)throw new Error('Concurrent rollback detected; active release was not changed');
  await env.EDITORIAL_DB.prepare('DELETE FROM canonical_release_previews WHERE preview_token=?').bind(p.preview_token).run();
  return {status:'rolled_back',releaseId:p.rollback_release_id,revision,previousReleaseId:state.activeReleaseId,counts:JSON.parse(p.counts_json)};
}

function toolDefs() {
  const ro = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
  const wr = { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false };
  const opSchema = { type:'object', properties:{ recordId:{type:'string',maxLength:160}, path:{type:'string',maxLength:240}, before:{}, after:{} }, required:['recordId','path','before','after'], additionalProperties:false };
  return [
    { name: 'search_history', description: 'Search the current live NZ GIS History publication, including people, organisations, chapters, projects, technologies, sources and timeline material.', inputSchema: { type:'object', properties:{ query:{type:'string',minLength:1,maxLength:320}, kind:{type:'string',enum:['Person','Business','Organisation','Agency','Council','Project','Technology','Chapter','Timeline event','Source reference','Preface']}, limit:{type:'integer',minimum:1,maximum:10,default:10} }, required:['query'], additionalProperties:false }, annotations: ro },
    { name: 'get_entity_history', description: 'Retrieve a named person, business, organisation, agency, council, project or technology from the current live NZ GIS History publication, with references, chapters and labelled relationships.', inputSchema: { type:'object', properties:{ name:{type:'string',minLength:1,maxLength:320}, kind:{type:'string',enum:['Person','Business','Organisation','Agency','Council','Project','Technology']} }, required:['name'], additionalProperties:false }, annotations: ro },
    { name: 'trace_evidence', description: 'Retrieve live published passages and source references relevant to a claim. A search match describes the published account and does not independently verify the claim.', inputSchema: { type:'object', properties:{ claim:{type:'string',minLength:1,maxLength:320}, limit:{type:'integer',minimum:1,maximum:10,default:10} }, required:['claim'], additionalProperties:false }, annotations: ro },
    { name: 'list_timeline', description: 'List timeline events from the current live publication, optionally constrained by year.', inputSchema: { type:'object', properties:{ fromYear:{type:'integer'}, toYear:{type:'integer'}, limit:{type:'integer',minimum:1,maximum:200,default:100} }, additionalProperties:false }, annotations: ro },
    { name: 'get_publication_state', description: 'Inspect the private MCP sidecar revision, revision history, active patches, and separately identify the GitHub/Cloudflare public publication.', inputSchema: { type:'object', properties:{}, additionalProperties:false }, annotations: ro },
    { name: 'prepare_github_publication', description: 'Export the non-private operations in the owner-authorised MCP sidecar as a GitHub reconciliation handoff. Does not publish or expose internal research fields. Apply the current Git HEAD lease and full content validation before merging.', inputSchema: {type:'object', properties:{expectedRevision:{type:'string',minLength:1,maxLength:80}}, required:['expectedRevision'], additionalProperties:false}, annotations:ro },
    { name: 'preview_history_patch', description: 'Preview controlled replacements to existing published prose or reference arrays. The exact preview token is required for publication and expires after 15 minutes.', inputSchema: { type:'object', properties:{ expectedRevision:{type:'string',maxLength:80}, summary:{type:'string',minLength:1,maxLength:500}, operations:{type:'array',minItems:1,maxItems:30,items:opSchema} }, required:['expectedRevision','summary','operations'], additionalProperties:false }, annotations: wr },
    { name: 'publish_history_patch', description: 'Publish only to the audited private MCP D1 sidecar; it DOES NOT update the public website. Rejects stale revisions, changed before-values, invalid or replayed preview tokens, unknown records and unsupported paths.', inputSchema: { type:'object', properties:{ expectedRevision:{type:'string',maxLength:80}, summary:{type:'string',minLength:1,maxLength:500}, operations:{type:'array',minItems:1,maxItems:30,items:opSchema}, previewToken:{type:'string',minLength:64,maxLength:64} }, required:['expectedRevision','summary','operations','previewToken'], additionalProperties:false }, annotations: wr },
    { name: 'restore_history_revision', description: 'Restore a retained small-update revision as a new audited revision. Omit previewToken to preview; provide the returned token to publish the restoration.', inputSchema: { type:'object', properties:{ expectedRevision:{type:'string',maxLength:80}, revision:{type:'string',maxLength:80}, summary:{type:'string',minLength:1,maxLength:500}, previewToken:{type:'string',minLength:64,maxLength:64} }, required:['expectedRevision','revision','summary'], additionalProperties:false }, annotations: wr },
    { name: 'preview_canonical_release', description: 'Validate and preview a complete canonical release by manifest URL or package reference. Checks checksums, manifest-declared total record, Person, edge, event and chapter counts, unique IDs and names, chapter numbering, relationship endpoints, deterministic patch conflicts and content retention. Returns a 15-minute one-use token; nothing is published.', inputSchema: { type:'object', properties:{ manifestUrl:{type:'string',maxLength:500}, packageReference:{type:'string',maxLength:500}, manifestSha256:{type:'string',pattern:'^[a-fA-F0-9]{64}$'}, expectedRevision:{type:'string',maxLength:80} }, required:['manifestSha256','expectedRevision'], additionalProperties:false }, annotations: wr },
    { name: 'publish_canonical_release', description: 'Atomically publish the exact previously previewed canonical release by one-use preview token and expected revision. Retains the prior release for rollback and records an audit entry.', inputSchema: { type:'object', properties:{ previewToken:{type:'string',minLength:64,maxLength:64}, expectedRevision:{type:'string',maxLength:80} }, required:['previewToken','expectedRevision'], additionalProperties:false }, annotations: wr },
    { name: 'preview_canonical_rollback', description: 'Preview rollback to a retained canonical release. Returns a 15-minute one-use token; the active release remains unchanged until rollback_canonical_release is called.', inputSchema: { type:'object', properties:{ releaseId:{type:'string',maxLength:160}, expectedRevision:{type:'string',maxLength:80} }, required:['releaseId','expectedRevision'], additionalProperties:false }, annotations: wr },
    { name: 'rollback_canonical_release', description: 'Atomically activate the exact retained release from a rollback preview token, with revision checking and an audit entry.', inputSchema: { type:'object', properties:{ previewToken:{type:'string',minLength:64,maxLength:64}, expectedRevision:{type:'string',maxLength:80} }, required:['previewToken','expectedRevision'], additionalProperties:false }, annotations: wr },
  ];
}

async function callTool(name, args, env) {
  if(name==='preview_canonical_release')return previewCanonicalRelease(env,args);
  if(name==='publish_canonical_release')return publishCanonicalRelease(env,args);
  if(name==='preview_canonical_rollback')return previewCanonicalRollback(env,args);
  if(name==='rollback_canonical_release')return rollbackCanonicalRelease(env,args);
  const data = await getEffectiveData(env);
  switch (name) {
    case 'search_history': return { query: args.query, matched: searchHistory(data, args.query, args.kind, args.limit).length, results: searchHistory(data, args.query, args.kind, args.limit), publication: publicationSummary(data) };
    case 'get_entity_history': return getEntityHistory(data, args.name, args.kind);
    case 'trace_evidence': return traceEvidence(data, args.claim, args.limit);
    case 'list_timeline': return listTimeline(data, args.fromYear, args.toYear, args.limit);
    case 'get_publication_state': return getPublicationState(env);
    case 'prepare_github_publication': return prepareGitHubPublicationHandoff(env,args);
    case 'preview_history_patch': return previewHistoryPatch(env, args);
    case 'publish_history_patch': return publishHistoryPatch(env, args);
    case 'restore_history_revision': return restoreHistoryRevision(env, args);
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

function rpcResult(id, result) { return { jsonrpc:'2.0', id, result }; }
function rpcError(id, code, message, data) { return { jsonrpc:'2.0', id: id ?? null, error:{ code, message, ...(data ? {data} : {}) } }; }

async function handleRpc(msg, env) {
  const id = msg.id;
  switch (msg.method) {
    case 'initialize':
      return rpcResult(id, { protocolVersion: PROTOCOL_VERSION, capabilities:{ tools:{ listChanged:false } }, serverInfo:{ name:SERVER_NAME, version:SERVER_VERSION }, instructions:'Read the live NZ GIS History publication and prepare owner-only editorial changes. MCP patch publication changes only the D1 sidecar; public website releases require GitHub and Cloudflare Pages.' });
    case 'ping': return rpcResult(id, {});
    case 'tools/list': return rpcResult(id, { tools: toolDefs() });
    case 'tools/call': {
      try {
        const name = msg.params?.name;
        const args = msg.params?.arguments || {};
        const out = await callTool(name, args, env);
        return rpcResult(id, { content:[{type:'text',text:JSON.stringify(out)}], structuredContent:out, isError:false });
      } catch (e) {
        return rpcResult(id, { content:[{type:'text',text:String(e?.message || e)}], isError:true });
      }
    }
    case 'notifications/initialized': return null;
    default: return rpcError(id, -32601, `Method not found: ${msg.method}`);
  }
}


async function handleRequest(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, {status:204, headers:{'access-control-allow-origin':'*','access-control-allow-headers':'content-type, accept, mcp-session-id, mcp-protocol-version','access-control-allow-methods':'GET, POST, OPTIONS'}});
  const url = new URL(request.url);

  if (url.pathname === '/health' || (url.pathname === '/' && request.method === 'GET')) {
    try {
      const data = await getEffectiveData(env);
      return json({ ok:true, server:SERVER_NAME, version:SERVER_VERSION, publication:publicationSummary(data), mcp:'/mcp' });
    } catch (e) { return json({ok:false,error:String(e?.message||e)}, 502); }
  }
  if (url.pathname !== '/mcp') return json({error:'Not found'},404);
  if (request.method === 'GET') return json({name:SERVER_NAME,version:SERVER_VERSION,transport:'streamable-http',message:'POST JSON-RPC requests to /mcp'});
  if (request.method !== 'POST') return json({error:'Method not allowed'},405);
  let body;
  try { body = await request.json(); } catch { return json(rpcError(null,-32700,'Parse error'),400); }
  if (Array.isArray(body)) {
    const results = (await Promise.all(body.map(x => handleRpc(x, env)))).filter(Boolean);
    return results.length ? json(results) : new Response(null,{status:202});
  }
  const result = await handleRpc(body, env);
  return result ? json(result) : new Response(null,{status:202});
}


export default { async fetch(request, env, ctx) { return handleRequest(request, env); } };
