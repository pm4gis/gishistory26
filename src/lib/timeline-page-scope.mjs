// Keep the compact chapter timeline aligned with the passage being read.
export function timelineEventsForScope(events, passageId, showChapterEvents = false) {
  if (!Array.isArray(events)) return [];
  if (!passageId || showChapterEvents) return events;
  return events.filter(event =>
    Array.isArray(event?.passageIds) && event.passageIds.includes(passageId)
  );
}
