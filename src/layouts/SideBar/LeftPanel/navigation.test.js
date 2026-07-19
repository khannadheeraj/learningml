import navigation, { navigationForRole } from './index';

test('Super Admin navigation includes every Phase 1B administrator workflow', () => {
  expect(navigationForRole('SUPER_ADMIN').map((item) => item.name)).toEqual([
    'Dashboard', 'All Contacts', 'Add Contact', 'Import Contacts', 'All Leads',
    'Unassigned Leads', 'Needs Contact', 'Interested Leads', 'Reassignment Requests', 'WhatsApp Templates', 'WhatsApp Inbox', 'Staff Users',
  ]);
});

test('counsellor navigation exposes only assigned CRM workflows', () => {
  const counsellorItems = navigationForRole('COUNSELLOR').map((item) => item.name);
  expect(counsellorItems).toEqual(['Dashboard', 'Add Contact', 'My Leads', 'Reassignment Requests', 'WhatsApp Templates', 'WhatsApp Inbox']);
});

test('legacy campaign screens are absent from all navigation', () => {
  const names = navigation.map((item) => item.name);
  expect(names).not.toEqual(expect.arrayContaining(['Upload Contacts', 'Invitation', 'Manage Contacts']));
});
