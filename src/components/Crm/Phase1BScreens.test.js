import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import * as crm from '../../services/Apis/crm';
import ContactForm from '../ContactForm';
import Contacts from '../Contacts';
import ContactDetail from '../ContactDetail';
import ContactImport from '../ContactImport';
import ReassignmentRequests from '../ReassignmentRequests';
import StaffUsers from '../StaffUsers';

jest.mock('../../auth/AuthProvider', () => ({ useAuth: jest.fn() }));
jest.mock('../../services/Apis/crm', () => ({
  listContacts: jest.fn(), getContact: jest.fn(), createContact: jest.fn(), updateContact: jest.fn(),
  updateContactPreferences: jest.fn(), listContactActivities: jest.fn(), getLead: jest.fn(), updateLead: jest.fn(),
  assignLead: jest.fn(), listLeadAssignments: jest.fn(), listCounsellorOptions: jest.fn(),
  listReassignmentRequests: jest.fn(), createReassignmentRequest: jest.fn(), approveReassignmentRequest: jest.fn(), rejectReassignmentRequest: jest.fn(), cancelReassignmentRequest: jest.fn(),
  listStaffUsers: jest.fn(), createStaffUser: jest.fn(), updateStaffUser: jest.fn(), resetStaffPassword: jest.fn(),
  analyzeContactImport: jest.fn(), previewContactImport: jest.fn(), getContactImport: jest.fn(), commitContactImport: jest.fn(), downloadContactImportRejections: jest.fn(),
}));

const pagination = { page: 1, pageSize: 25, totalRecords: 0, totalPages: 0, hasNext: false, hasPrevious: false };
const admin = { id: 'admin-id', role: 'SUPER_ADMIN', displayName: 'Admin' };
const renderAt = (element, path = '/') => render(<MemoryRouter initialEntries={[path]}><Routes><Route path="*" element={element}/></Routes></MemoryRouter>);

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ user: admin, logout: jest.fn() });
  crm.listCounsellorOptions.mockResolvedValue({ data: { data: [] } });
});

test('Contact list loads server data and exposes production filters', async () => {
  crm.listContacts.mockResolvedValue({ data: { data: [], pagination } });
  renderAt(<Contacts/>, '/contacts');
  expect(await screen.findByRole('heading', { name: 'All Contacts' })).toBeInTheDocument();
  expect(screen.getByLabelText(/Name, phone, or email/i)).toBeInTheDocument();
  expect(await screen.findByText(/No records found/i)).toBeInTheDocument();
  expect(crm.listContacts).toHaveBeenCalledWith(expect.objectContaining({ page: 1, pageSize: 25 }));
});

test('Add Contact prevents duplicate ambiguity and links the existing Contact', async () => {
  crm.createContact.mockRejectedValue({ response: { data: { error: { message: 'Phone already exists.', fieldErrors: { existingContactId: 'existing-id', phone: 'Duplicate phone.' } } } } });
  renderAt(<ContactForm/>, '/contacts/new');
  fireEvent.change(screen.getByLabelText('Primary phone *'), { target: { value: '9876543210' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create Contact and Lead' }));
  expect(await screen.findByText('Open existing Contact')).toHaveAttribute('href', '/contacts/existing-id');
  expect(crm.createContact).toHaveBeenCalledTimes(1);
});

test('Contact detail correction uses optimistic version and activity data', async () => {
  crm.getContact.mockResolvedValue({ data: { data: { contact: { id: 'contact-id', displayName: 'Asha Sen', normalizedPhone: '919876543210', city: 'Old City', version: 3 }, activeLead: null, preferences: { version: 1 }, assignedCounsellor: null } } });
  crm.listContactActivities.mockResolvedValue({ data: { data: [], pagination } });
  crm.updateContact.mockResolvedValue({ data: { data: {} } });
  render(<MemoryRouter initialEntries={['/contacts/contact-id']}><Routes><Route path="/contacts/:contactId" element={<ContactDetail/>}/></Routes></MemoryRouter>);
  await screen.findByRole('heading', { name: 'Asha Sen' });
  fireEvent.click(screen.getByRole('button', { name: 'Edit Contact' }));
  fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Kolkata' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save corrections' }));
  await waitFor(() => expect(crm.updateContact).toHaveBeenCalledWith('contact-id', expect.objectContaining({ version: 3, city: 'Kolkata' })));
});

test('Import wizard analyzes, dynamically maps, previews, and commits once', async () => {
  window.confirm = jest.fn(() => true);
  crm.analyzeContactImport.mockResolvedValue({ data: { data: { id: 'import-id', headers: ['Name', 'Phone'], sampleRows: [], totalRows: 1, originalFilename: 'contacts.csv', fileType: 'CSV' } } });
  const detail = { import: { id: 'import-id', status: 'PREVIEWED', counts: { validRows: 1 } }, rows: [{ id: 'row-id', rowNumber: 2, validationStatus: 'VALID', normalizedData: { normalizedPhone: '919876543210' } }], pagination };
  crm.previewContactImport.mockResolvedValue({ data: { data: detail } });
  crm.commitContactImport.mockResolvedValue({ data: { data: { ...detail.import, status: 'COMPLETED', counts: { importedContacts: 1 } } } });
  renderAt(<ContactImport/>, '/contacts/import');
  const file = new File(['Name,Phone\nAsha,9876543210'], 'contacts.csv', { type: 'text/csv' });
  fireEvent.change(screen.getByLabelText(/CSV or XLSX/i), { target: { files: [file] } });
  fireEvent.click(screen.getByRole('button', { name: 'Analyze safely' }));
  expect(await screen.findByText(/1 rows found/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Validate and preview' }));
  expect(await screen.findByText('Valid')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Commit valid rows' }));
  await waitFor(() => expect(crm.commitContactImport).toHaveBeenCalledTimes(1));
});

test('Staff screen creates users and forces logout after self email security change', async () => {
  const logout = jest.fn(); useAuth.mockReturnValue({ user: admin, logout });
  const staff = { id: 'admin-id', displayName: 'Admin', email: 'admin@example.com', role: 'SUPER_ADMIN', isActive: true, mustChangePassword: false, version: 1 };
  crm.listStaffUsers.mockResolvedValue({ data: { data: [staff], pagination: { ...pagination, totalRecords: 1, totalPages: 1 } } });
  crm.createStaffUser.mockResolvedValue({ data: { data: {} } });
  crm.updateStaffUser.mockResolvedValue({ data: { data: { reauthenticationRequired: true } } });
  renderAt(<StaffUsers/>, '/staff-users');
  await screen.findByRole('heading', { name: 'Staff users' });
  fireEvent.change(screen.getByLabelText('Email', { selector: '#staff-email' }), { target: { value: 'new@example.com' } });
  fireEvent.change(screen.getByLabelText('Display name', { selector: '#staff-displayName' }), { target: { value: 'New User' } });
  fireEvent.change(screen.getByLabelText('Temporary password'), { target: { value: 'Temporary!Pass4827' } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'Temporary!Pass4827' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create user' }));
  await waitFor(() => expect(crm.createStaffUser).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(crm.listStaffUsers).toHaveBeenCalledTimes(2));
  await screen.findByRole('button', { name: 'Save' });
  fireEvent.change(screen.getAllByLabelText('Email').at(-1), { target: { value: 'admin2@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
});

test('Super Admin can approve or reject pending reassignment requests', async () => {
  const request = { id: 'request-id', version: 1, status: 'PENDING', reasonCode: 'WORKLOAD', contact: { id: 'contact-id', displayName: 'Asha' }, currentCounsellor: { displayName: 'Current' }, requestedTargetCounsellorId: 'target-id' };
  crm.listReassignmentRequests.mockResolvedValue({ data: { data: [request], pagination: { ...pagination, totalRecords: 1, totalPages: 1 } } });
  crm.listCounsellorOptions.mockResolvedValue({ data: { data: [{ id: 'target-id', displayName: 'Target' }] } });
  crm.approveReassignmentRequest.mockResolvedValue({ data: { data: {} } });
  renderAt(<ReassignmentRequests/>, '/reassignment-requests');
  await screen.findByText('Asha');
  fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
  await waitFor(() => expect(crm.approveReassignmentRequest).toHaveBeenCalledWith('request-id', expect.objectContaining({ version: 1, targetCounsellorId: 'target-id' })));
});
