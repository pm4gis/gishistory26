function validYear(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const year = Number(value);
  return Number.isInteger(year) && year >= 1000 && year <= 2100 ? year : null;
}

export function eventYear(event) {
  if (!event || event.datePrecision === 'unknown') return null;
  const year = validYear(event.year);
  if (year !== null) return year;
  const match = String(event.startDate || '').match(/^(\d{4})/);
  return match ? Number(match[1]) : null;
}

function eventEndYear(event, startYear) {
  const match = String(event?.endDate || '').match(/^(\d{4})/);
  return match ? Number(match[1]) : startYear;
}

export function eventMatchesTimeline(event, filters = {}) {
  const startYear = eventYear(event);
  if (startYear === null && filters.includeUndated === false) return false;
  if (!timelineSearchMatches(event, filters.term)) return false;
  if (startYear === null) return true;

  const endYear = eventEndYear(event, startYear);
  const from = validYear(filters.from);
  const to = validYear(filters.to);
  return (from === null || endYear >= from) && (to === null || startYear <= to);
}

function timelineSearchMatches(event, term = '') {
  const query = String(term || '').trim().toLocaleLowerCase('en-NZ');
  if (!query) return true;
  return [event.label, event.summary, event.dateDisplay]
    .some((value) => String(value || '').toLocaleLowerCase('en-NZ').includes(query));
}

export function filterTimelineEvents(events, filters = {}) {
  return events
    .filter((event) => eventMatchesTimeline(event, filters))
    .sort((a, b) => (eventYear(a) ?? Infinity) - (eventYear(b) ?? Infinity) || a.id.localeCompare(b.id));
}

export function readTimelineState(search, events = []) {
  const params = new URLSearchParams(search || '');
  const state = {
    from: validYear(params.get('from'))?.toString() || '',
    to: validYear(params.get('to'))?.toString() || '',
    term: params.get('q') || '',
    includeUndated: params.get('undated') !== '0' && params.get('undated') !== 'false',
    selected: null,
  };
  const selectedId = params.get('event');
  if (selectedId) {
    state.selected = filterTimelineEvents(events, state).find((event) => event.id === selectedId) || null;
  }
  return state;
}

export function timelineSearchParams(search, state) {
  const params = new URLSearchParams(search || '');
  for (const key of ['from', 'to', 'undated', 'event', 'q']) params.delete(key);

  const from = validYear(state.from);
  const to = validYear(state.to);
  if (from !== null) params.set('from', String(from));
  if (to !== null) params.set('to', String(to));
  if (state.includeUndated === false) params.set('undated', '0');
  if (state.term?.trim()) params.set('q', state.term.trim());
  if (state.selected && eventMatchesTimeline(state.selected, state)) params.set('event', state.selected.id);
  return params;
}
