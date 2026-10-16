/** Directory references retain their permanent routes and source records. */
export function isListedRecord(record) {
  return record.kind !== 'Story' && record.listingStatus !== 'reference-only' && record.listingStatus !== 'alias-only';
}

/** A person's profile must lead to an entry, event or reading passage. */
export function orphanPersonIds({records=[], relationships=[], events=[], passages=[]}) {
  const recordIds = new Set(records.map(r => r.id));
  const connected = new Set();
  for (const edge of relationships) {
    if (recordIds.has(edge.a) && recordIds.has(edge.b) && edge.a !== edge.b) {
      connected.add(edge.a); connected.add(edge.b);
    }
  }
  for (const item of [...events, ...passages]) {
    for (const id of item.recordIds || []) connected.add(id);
  }
  return records.filter(r => r.kind === 'Person' && !connected.has(r.id)).map(r => r.id);
}
