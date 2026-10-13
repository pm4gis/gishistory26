// The public chronology ends on 31 December 2025, irrespective of the build date.
export const TIMELINE_LAST_YEAR = 2025;
export const TIMELINE_LAST_DATE = '2025-12-31';

// Event dates retain their original precision; this checks only their year.
const yearFromDate = value => {
  const match = String(value ?? '').match(/^(\d{4})(?:-|$)/);
  return match ? Number(match[1]) : null;
};

// Do not expose retrospective descriptions which mention events beyond the
// historical end date as if they belonged in the published chronology.
export function timelineTextWithinPeriod(value) {
  if (value == null) return true;
  const text = String(value);
  return !/\b(?:202[6-9]|20[3-9]\d|2[1-9]\d{2})\b/.test(text);
}

export function isTimelineEventInPeriod(event) {
  if (!event || typeof event !== 'object') return false;
  if (Number.isFinite(event.year) && event.year > TIMELINE_LAST_YEAR) return false;
  if ([event.startDate, event.endDate].some(value => {
    const year = yearFromDate(value);
    return year !== null && year > TIMELINE_LAST_YEAR;
  })) return false;
  return [event.dateDisplay, event.label, event.summary]
    .every(timelineTextWithinPeriod);
}
