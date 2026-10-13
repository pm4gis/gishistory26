export const MAX_NETWORK_NEIGHBOURS = 36;

/** Prepare a one-hop view without dropping evidence from the accompanying list. */
export function networkNeighbourhood(records, edges, focusId, maxNeighbours = MAX_NETWORK_NEIGHBOURS) {
  const recordMap = new Map(records.map(record => [record.id, record]));
  const relationships = edges.filter(edge =>
    (edge.a === focusId || edge.b === focusId) &&
    recordMap.has(edge.a) && recordMap.has(edge.b)
  );
  const neighbours = [...new Set(relationships.map(edge => edge.a === focusId ? edge.b : edge.a))]
    .sort((a, b) => recordMap.get(a).name.localeCompare(recordMap.get(b).name, 'en-NZ'));
  const visibleNeighbours = neighbours.slice(0, Math.max(0, maxNeighbours));
  const visibleIds = [focusId, ...visibleNeighbours];
  const visibleSet = new Set(visibleIds);
  return {
    relationships,
    neighbours,
    visibleIds,
    visibleRelationships: relationships.filter(edge => visibleSet.has(edge.a) && visibleSet.has(edge.b)),
    hiddenCount: neighbours.length - visibleNeighbours.length
  };
}

/** Positions use logical SVG coordinates, so device pixel ratio cannot distort the network. */
export function radialNetworkLayout(ids) {
  const positions = new Map([[ids[0], { x: 0, y: 0 }]]);
  const ringSizes = [8, 12, 16, 20, 24];
  let offset = 1;
  let ring = 0;
  let outerX = 0;
  let outerY = 0;
  while (offset < ids.length) {
    const count = Math.min(ringSizes[Math.min(ring, ringSizes.length - 1)], ids.length - offset);
    const radiusX = 315 + 215 * ring;
    const radiusY = 205 + 175 * ring;
    outerX = radiusX;
    outerY = radiusY;
    for (let i = 0; i < count; i++) {
      const theta = -Math.PI / 2 + 2 * Math.PI * i / count + (ring % 2 ? Math.PI / count : 0);
      positions.set(ids[offset + i], {
        x: Math.round(Math.cos(theta) * radiusX),
        y: Math.round(Math.sin(theta) * radiusY)
      });
    }
    offset += count;
    ring++;
  }
  return {
    positions,
    width: Math.max(980, 2 * (outerX + 145)),
    height: Math.max(620, 2 * (outerY + 115))
  };
}

/** Split long labels into two bounded lines. Preserve the full title in an SVG title. */
export function networkLabelLines(value, limit = 23) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  for (const word of words) {
    if (!lines.length) lines.push('');
    const current = lines.length - 1;
    const candidate = lines[current] ? lines[current] + ' ' + word : word;
    if (candidate.length <= limit) lines[current] = candidate;
    else if (lines[current] && lines.length < 2) lines.push(word);
    else if (!lines[current]) lines[current] = word;
    else lines[current] = candidate;
  }
  if (lines.length > 2) lines.length = 2;
  if (lines[0] && lines[0].length > limit) lines[0] = lines[0].slice(0, limit - 1).trimEnd() + '…';
  if (lines[1] && lines[1].length > limit) lines[1] = lines[1].slice(0, limit - 1).trimEnd() + '…';
  return lines.length ? lines : ['Unnamed entry'];
}
