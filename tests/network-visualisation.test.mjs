import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { networkNeighbourhood, radialNetworkLayout, networkLabelLines, MAX_NETWORK_NEIGHBOURS } from '../src/lib/network-layout.mjs';

const records = [
  {id:'dataset:lenz',name:'Land Environments of New Zealand (LENZ)',kind:'dataset'},
  {id:'org:landcare',name:'Landcare Research',kind:'organisation'},
  {id:'person:jane',name:'Jane Smith',kind:'person'},
  {id:'event:release',name:'Dataset published',kind:'event'},
  {id:'organisation:cri',name:'CRI',kind:'organisation'}
];
const edges = [
  {id:'e1',a:'dataset:lenz',b:'org:landcare',label:'Produced by'},
  {id:'e2',a:'dataset:lenz',b:'person:jane',label:'Worked on'},
  {id:'e3',a:'event:release',b:'dataset:lenz',label:'Launched'},
  {id:'e4',a:'org:landcare',b:'organisation:cri',label:'Related to'}
];

test('single-hop network includes valid immediate neighbours and keeps evidence', () => {
  const result = networkNeighbourhood(records, edges, 'dataset:lenz');
  assert.equal(result.relationships.length, 3);
  assert.equal(result.visibleIds.length, 4);
  assert.equal(result.visibleRelationships.length, 3);
  assert.ok(!result.visibleIds.includes('organisation:cri'), 'do not include neighbours of neighbours');
  assert.equal(result.hiddenCount, 0);
});

test('missing records and duplicated neighbour relationships do not create orphan nodes', () => {
  const input = [...edges, {id:'e5',a:'dataset:lenz',b:'person:jane'}, {id:'e6',a:'dataset:lenz',b:'unknown'}];
  const result = networkNeighbourhood(records, input, 'dataset:lenz');
  assert.equal(result.neighbours.length, 3);
  assert.equal(result.relationships.length, 4);
  assert.equal(result.visibleRelationships.length, 4);
});

test('dense neighbourhoods cap visible nodes but retain all evidence', () => {
  const many = Array.from({length:MAX_NETWORK_NEIGHBOURS+5}, (_,i) => ({id:'person:'+i,name:'Person '+i}));
  const related = many.map((item,i) => ({id:'r'+i,a:'dataset:lenz',b:item.id}));
  const result = networkNeighbourhood([records[0],...many],related,'dataset:lenz');
  assert.equal(result.visibleIds.length, MAX_NETWORK_NEIGHBOURS+1);
  assert.equal(result.visibleRelationships.length, MAX_NETWORK_NEIGHBOURS);
  assert.equal(result.relationships.length, MAX_NETWORK_NEIGHBOURS+5);
  assert.equal(result.hiddenCount, 5);
});

test('positions are finite, unique and inside the SVG viewbox at normal and dense sizes', () => {
  for (const count of [1, 2, 5, 9, 25, 37]) {
    const ids = Array.from({length:count}, (_,i) => 'r'+i);
    const result = radialNetworkLayout(ids);
    assert.equal(result.positions.size, ids.length);
    assert.deepEqual(result.positions.get('r0'), {x:0,y:0});
    const points = [];
    for(const point of result.positions.values()){
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
      assert.ok(Math.abs(point.x) + 125 < result.width/2);
      assert.ok(Math.abs(point.y) + 48 < result.height/2);
      points.push(point.x+','+point.y);
    }
    assert.equal(new Set(points).size,count);
  }
});

test('long labels remain bounded and preserve complete title as separate SVG tooltip', () => {
  const title = 'Land Environments of New Zealand (LENZ), 2003';
  const lines = networkLabelLines(title);
  assert.ok(lines.length <= 2);
  assert.ok(lines.every(line => line.length <= 23));
  assert.deepEqual(networkLabelLines('Short'),['Short']);
  assert.deepEqual(networkLabelLines(''),['Unnamed entry']);
});

test('public network uses SVG without the broken WebGL rendering path', () => {
  const script = readFileSync('src/lib/network.ts','utf8');
  const page = readFileSync('src/pages/network/index.astro','utf8');
  const styles = readFileSync('src/styles/network.css','utf8');
  assert.match(script,/networkNeighbourhood/);
  assert.match(script,/radialNetworkLayout/);
  assert.match(script,/createElementNS/);
  assert.doesNotMatch(script,/Sigma|import\(['"]sigma['"]\)|WebGL|drawSvg/);
  assert.match(page,/id="graph"/);
  assert.match(page,/id="network-zoom-in"/);
  assert.match(page,/id="network-evidence-title"/);
  assert.match(styles,/var\(--surface\)/);
});
