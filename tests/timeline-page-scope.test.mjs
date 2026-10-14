import test from 'node:test';
import assert from 'node:assert/strict';
import {timelineEventsForScope} from '../src/lib/timeline-page-scope.mjs';

const events = [
  {id:'one', passageIds:['p1']},
  {id:'two', passageIds:['p2','p1']},
  {id:'chapter-only'},
  {id:'malformed', passageIds:'p1'}
];

test('page scope returns only events linked to the current passage',()=>{
  assert.deepEqual(
    timelineEventsForScope(events,'p1'),
    [events[0],events[1]]
  );
  assert.deepEqual(
    timelineEventsForScope(events,'p2'),
    [events[1]]
  );
});

test('chapter scope keeps all chapter events available from a page',()=>{
  assert.deepEqual(timelineEventsForScope(events,'p1',true),events);
});

test('chapter reading and missing data are handled safely',()=>{
  assert.deepEqual(timelineEventsForScope(events,null),events);
  assert.deepEqual(timelineEventsForScope(null,'p1'),[]);
  assert.deepEqual(timelineEventsForScope(events,'unknown'),[]);
});
