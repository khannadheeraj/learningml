import React from 'react';

const Dashboard = React.lazy(() => import('../components/Dashboard'));
const Contacts = React.lazy(() => import('../components/Contacts'));
const ContactForm = React.lazy(() => import('../components/ContactForm'));
const ContactDetail = React.lazy(() => import('../components/ContactDetail'));
const LeadList = React.lazy(() => import('../components/LeadList'));
const ContactImport = React.lazy(() => import('../components/ContactImport'));
const ReassignmentRequests = React.lazy(() => import('../components/ReassignmentRequests'));
const StaffUsers = React.lazy(() => import('../components/StaffUsers'));

const allRoles = ['SUPER_ADMIN', 'COUNSELLOR'];
const admin = ['SUPER_ADMIN'];
const routes = [
  { path: '/', name: 'Home', roles: allRoles, element: <Dashboard /> },
  { path: '/dashboard', name: 'Dashboard', roles: allRoles, element: <Dashboard /> },
  { path: '/contacts', name: 'Contacts', roles: admin, element: <Contacts /> },
  { path: '/contacts/new', name: 'Add Contact', roles: allRoles, element: <ContactForm /> },
  { path: '/contacts/import', name: 'Import Contacts', roles: admin, element: <ContactImport /> },
  { path: '/contacts/:contactId', name: 'Contact details', roles: allRoles, element: <ContactDetail /> },
  { path: '/leads', name: 'All Leads', roles: admin, element: <LeadList /> },
  { path: '/leads/unassigned', name: 'Unassigned Leads', roles: admin, element: <LeadList title="Unassigned Leads" preset={{ unassigned: true }} /> },
  { path: '/leads/needs-contact', name: 'Needs Contact', roles: admin, element: <LeadList title="Needs Contact" preset={{ status: 'NEEDS_CONTACT' }} /> },
  { path: '/leads/interested', name: 'Interested Leads', roles: admin, element: <LeadList title="Interested Leads" preset={{ status: 'INTERESTED' }} /> },
  { path: '/my-leads', name: 'My Leads', roles: ['COUNSELLOR'], element: <LeadList title="My Leads" /> },
  { path: '/reassignment-requests', name: 'Reassignment Requests', roles: allRoles, element: <ReassignmentRequests /> },
  { path: '/staff-users', name: 'Staff Users', roles: admin, element: <StaffUsers /> },
];
export default routes;
