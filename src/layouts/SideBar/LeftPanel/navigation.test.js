import navigation from './index';

test('counsellor navigation excludes current Super Admin-only legacy screens', () => {
  const counsellorItems = navigation.filter((item) => item.roles.includes('COUNSELLOR')).map((item) => item.name);
  expect(counsellorItems).toEqual(['Dashboard']);
});
