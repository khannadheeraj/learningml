import navigation from './index';

test('counsellor navigation exposes only assigned CRM workflows', () => {
  const counsellorItems = navigation.filter((item) => item.roles.includes('COUNSELLOR')).map((item) => item.name);
  expect(counsellorItems).toEqual(['Dashboard', 'Add Contact', 'My Leads', 'Reassignment Requests']);
});

test('legacy campaign screens are absent from all navigation', () => {
  const names = navigation.map((item) => item.name);
  expect(names).not.toEqual(expect.arrayContaining(['Upload Contacts', 'Invitation', 'Manage Contacts']));
});
