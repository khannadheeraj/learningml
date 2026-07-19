import { localDateTime } from './FollowUpForm';

test('local datetime display preserves the local calendar input value', () => {
  expect(localDateTime('2030-01-02T03:04:00.000Z')).toMatch(/^2030-01-0[12]T/);
});

test('follow-up option sets cover creation and editing values', () => {
  const { FOLLOW_UP_TYPES, FOLLOW_UP_PRIORITIES } = require('./FollowUpForm');
  expect(FOLLOW_UP_TYPES).toEqual(expect.arrayContaining(['CALL', 'WHATSAPP', 'MEETING', 'DOCUMENT', 'PAYMENT', 'GENERAL']));
  expect(FOLLOW_UP_PRIORITIES).toEqual(expect.arrayContaining(['LOW', 'MEDIUM', 'HIGH', 'URGENT']));
});
