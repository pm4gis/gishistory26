import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {timelineMedia,decorateTimelineEvents} from '../src/lib/timeline-media.mjs';

test('curated event illustrations refer to local, attributed image records',()=>{
  assert.ok(Object.keys(timelineMedia).length>=25);
  for(const [eventId,ref] of Object.entries(timelineMedia)){
    assert.ok(existsSync(join('src/content/events',eventId+'.json')),eventId+' event is missing');
    const recordPath=join('src/content/images',ref.slug+'.json');
    assert.ok(existsSync(recordPath),ref.slug+' image record is missing');
    const img=JSON.parse(readFileSync(recordPath,'utf8'));
    assert.ok(existsSync(join('public',img.thumbnailPath||img.assetPath)),ref.slug+' card asset missing');
    assert.ok(existsSync(join('public',img.assetPath)),ref.slug+' display asset missing');
    assert.ok(img.sourceUrl&&img.credit&&img.licenceUrl,ref.slug+' image source incomplete');
    assert.ok(ref.relation&&ref.relation.length>30,eventId+' needs an accurate contextual caption');
  }
});
test('event presentation includes existing source narrative and archival image details',()=>{
  const event={id:'1939-first-nzms1',label:'First NZMS1 sheet published',passageIds:['passage:x'],recordIds:['record:x'],sources:[]};
  const paragraph='A historical account documenting the introduction of national map sheets.';
  const passages=[{id:'passage:x',title:'National sheets',blocks:[{type:'paragraph',text:paragraph,sources:[{label:'Published source',url:'https://example.org/source'}]}]}];
  const records=[{id:'record:x',name:'Lands and Survey',kind:'organisation',url:'/browse/lands-and-survey/'}];
  const file=JSON.parse(readFileSync('src/content/images/clutha-molyneux-nzms13-1955.json','utf8'));
  const [out]=decorateTimelineEvents([event],passages,records,[file]);
  assert.equal(out.contextParagraphs[0],paragraph);
  assert.equal(out.featuredImage.slug,file.slug);
  assert.match(out.featuredImage.relation,/not the original NZMS 1 N134/);
  assert.equal(out.relatedRecords[0].name,'Lands and Survey');
  assert.equal(out.contextualSources[0].label,'Published source');
  assert.ok(out.imageSourceLink.includes('natlib.govt.nz'));
});
