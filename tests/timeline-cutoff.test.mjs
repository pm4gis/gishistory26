import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {TIMELINE_LAST_YEAR,TIMELINE_LAST_DATE,isTimelineEventInPeriod,timelineTextWithinPeriod} from '../src/lib/timeline-cutoff.mjs';

test('public timeline has a permanent endpoint of 31 December 2025',()=>{
 assert.equal(TIMELINE_LAST_YEAR,2025);
 assert.equal(TIMELINE_LAST_DATE,'2025-12-31');
 const component=readFileSync('src/components/Timeline.svelte','utf8');
 assert.match(component,/max=TIMELINE_LAST_YEAR/);
 assert.match(component,/Array\.from\(\{length:Math\.floor\(\(max-1900\)\/10\)\+1\}/);
 assert.match(component,/history\.pushState/);
 assert.match(component,/addEventListener\('popstate'/);
 assert.doesNotMatch(component,/new Date\(\)\.getFullYear\(\)/);
});

test('dates after the endpoint and retrospective future references are excluded',()=>{
 const base={id:'test',startDate:'2025-12-31',dateDisplay:'2025-12-31',year:2025,label:'End of 2025',summary:'Historical account'};
 assert.ok(isTimelineEventInPeriod(base));
 assert.equal(isTimelineEventInPeriod({...base,startDate:'2026-01-01'}),false);
 assert.equal(isTimelineEventInPeriod({...base,year:2026}),false);
 assert.equal(isTimelineEventInPeriod({...base,endDate:'2026-01-01'}),false);
 assert.equal(isTimelineEventInPeriod({...base,dateDisplay:'2026'}),false);
 assert.equal(isTimelineEventInPeriod({...base,summary:'In 2027 there was another event.'}),false);
 assert.ok(isTimelineEventInPeriod({...base,startDate:'unknown',dateDisplay:'Unknown',year:undefined}));
 assert.equal(timelineTextWithinPeriod('A 2025 survey'),true);
 assert.equal(timelineTextWithinPeriod('The programme resumed in 2026'),false);
});

test('source chronology contains no post-2025 event',()=>{
 const files=readdirSync('src/content/events').filter(name=>name.endsWith('.json'));
 assert.ok(files.length>200);
 const later=files.flatMap(file=>{
  const event=JSON.parse(readFileSync(join('src/content/events',file),'utf8'));
  return isTimelineEventInPeriod(event)?[]:[file+' ('+event.startDate+')'];
 });
 assert.deepEqual(later,[],'post-2025 event records must not be published');
});

test('all public consumers use the same timeline event gate',()=>{
 const data=readFileSync('src/lib/data.ts','utf8');
 const timeline=readFileSync('src/pages/timeline/index.astro','utf8');
 const decorator=readFileSync('src/lib/timeline-media.mjs','utf8');
 assert.match(data,/out\.events=out\.events\.filter\(isTimelineEventInPeriod\)/);
 assert.match(timeline,/const d=await dataset\(\)/);
 assert.match(decorator,/events\.filter\(isTimelineEventInPeriod\)/);
});
