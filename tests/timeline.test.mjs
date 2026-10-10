import test from 'node:test';
import assert from 'node:assert/strict';
import {
  eventMatchesTimeline,
  eventYear,
  filterTimelineEvents,
  readTimelineState,
  timelineSearchParams,
} from '../src/lib/timeline.mjs';

const events = [
  { id: 'range', year: 1981, startDate: '1981', endDate: '1984', datePrecision: 'year-range', label: 'GIS adoption' },
  { id: 'point', year: 1985, startDate: '1985', datePrecision: 'year', label: 'Land information system' },
  { id: 'unknown', year: null, datePrecision: 'unknown' },
];

test('range events remain visible when any part overlaps the selected period', () => {
  assert.deepEqual(filterTimelineEvents(events, { from: '1983', to: '1983' }).map((event) => event.id), ['range', 'unknown']);
  assert.equal(eventMatchesTimeline(events[0], { from: '1983', to: '1983' }), true);
  assert.equal(eventMatchesTimeline(events[0], { from: '1985', to: '1990' }), false);
});

test('undated visibility is a distinct, shareable timeline setting', () => {
  const visible = filterTimelineEvents(events, { includeUndated: true }).map((event) => event.id);
  const hidden = filterTimelineEvents(events, { includeUndated: false }).map((event) => event.id);
  assert.deepEqual(visible, ['range', 'point', 'unknown']);
  assert.deepEqual(hidden, ['range', 'point']);
  assert.equal(eventYear(events[2]), null);
});

test('timeline URLs restore filters and only select an event inside the filtered period', () => {
  const state = readTimelineState('?from=1980&to=1990&undated=false&event=range&view=list', events);
  assert.equal(state.from, '1980');
  assert.equal(state.to, '1990');
  assert.equal(state.includeUndated, false);
  assert.equal(state.selected.id, 'range');

  const excluded = readTimelineState('?from=1985&to=1990&event=range', events);
  assert.equal(excluded.selected, null);
});

test('timeline updates preserve unrelated query state and remove stale event selections', () => {
  const params = timelineSearchParams('?from=2000&to=2010&event=point&focus=record-1', {
    from: '1980',
    to: '1982',
    includeUndated: false,
    selected: events[1],
  });
  assert.equal(params.get('focus'), 'record-1');
  assert.equal(params.get('from'), '1980');
  assert.equal(params.get('to'), '1982');
  assert.equal(params.get('undated'), '0');
  assert.equal(params.has('event'), false);
});

test('event search terms round-trip and clear selections that do not match', () => {
  const state = readTimelineState('?q=GIS&event=range&focus=record-1', events);
  assert.equal(state.term, 'GIS');
  assert.equal(state.selected.id, 'range');
  assert.equal(readTimelineState('?q=property&event=range', events).selected, null);

  const params = timelineSearchParams('?focus=record-1', {
    from: '',
    to: '',
    term: 'GIS ',
    includeUndated: true,
    selected: events[0],
  });
  assert.equal(params.get('q'), 'GIS');
  assert.equal(params.get('event'), 'range');
  assert.equal(params.get('focus'), 'record-1');
});

test('invalid URL years are discarded instead of becoming misleading filters', () => {
  const state = readTimelineState('?from=not-a-year&to=2101&undated=true', events);
  assert.equal(state.from, '');
  assert.equal(state.to, '');
  assert.equal(state.includeUndated, true);
});
