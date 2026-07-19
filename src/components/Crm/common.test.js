import { formatDate, localDateTimeToUtcIso, parseApiDateTime } from './common';

const utcMillis = Date.UTC(2026, 6, 19, 8, 43, 0);

test('UTC Z, UTC offset, and legacy naive UTC parse to the same instant', () => {
  expect(parseApiDateTime('2026-07-19T08:43:00Z').getTime()).toBe(utcMillis);
  expect(parseApiDateTime('2026-07-19T08:43:00+00:00').getTime()).toBe(utcMillis);
  expect(parseApiDateTime('2026-07-19T08:43:00').getTime()).toBe(utcMillis);
});

test('formats in the browser locale and does not double-convert UTC timestamps', () => {
  expect(formatDate('2026-07-19T08:43:00Z', true)).toBe(formatDate('2026-07-19T08:43:00', true));
});

test('local datetime inputs submit timezone-qualified UTC ISO values and date-only values are not datetimes', () => {
  expect(localDateTimeToUtcIso('2026-07-19T14:13')).toMatch(/Z$/);
  expect(localDateTimeToUtcIso('2026-07-19')).toBeNull();
});
