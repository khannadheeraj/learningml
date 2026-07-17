import { routesForRole } from './index';

test('Super Admin CRM routes include operational screens and exclude legacy campaign screens', () => {
  const paths = routesForRole('SUPER_ADMIN').map((route) => route.path);
  expect(paths).toEqual(expect.arrayContaining(['/contacts', '/contacts/new', '/contacts/import', '/leads', '/leads/unassigned', '/reassignment-requests', '/staff-users']));
  expect(paths).not.toEqual(expect.arrayContaining(['/upload-contacts', '/send-invitation', '/manage-contacts']));
});

test('Counsellor routes expose assigned workflows but not global administration', () => {
  const paths = routesForRole('COUNSELLOR').map((route) => route.path);
  expect(paths).toEqual(expect.arrayContaining(['/dashboard', '/my-leads', '/contacts/new', '/contacts/:contactId', '/reassignment-requests']));
  expect(paths).not.toEqual(expect.arrayContaining(['/contacts', '/contacts/import', '/leads', '/staff-users']));
});
