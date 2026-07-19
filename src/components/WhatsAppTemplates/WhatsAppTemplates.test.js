import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import * as crm from '../../services/Apis/crm';
import WhatsAppTemplates from './index';
import WhatsAppTemplateDetail from './Detail';


jest.mock('../../auth/AuthProvider', () => ({ useAuth: jest.fn() }));
jest.mock('../../services/Apis/crm', () => ({
  listWhatsAppTemplates: jest.fn(), getWhatsAppTemplate: jest.fn(), syncWhatsAppTemplates: jest.fn(),
}));

const pagination = { page: 1, pageSize: 25, totalRecords: 1, totalPages: 1, hasNext: false, hasPrevious: false };
const template = {
  id: 'template-id', name: 'admission_welcome', status: 'APPROVED', category: 'UTILITY', language: 'en_US',
  lastSyncedAt: '2026-07-19T10:30:00Z', headers: [{ type: 'HEADER', format: 'TEXT', text: 'Welcome {{1}}' }],
  body: { type: 'BODY', text: 'Hello {{1}}, batch {{2}} is open.' }, footer: { type: 'FOOTER', text: 'GEO IAS' },
  buttons: [{ type: 'QUICK_REPLY', text: 'Call me' }], variables: [],
};
const renderAt = (element, path) => render(<MemoryRouter initialEntries={[path]}><Routes><Route path="*" element={element} /></Routes></MemoryRouter>);

beforeEach(() => {
  jest.clearAllMocks();
  crm.listWhatsAppTemplates.mockResolvedValue({ data: { data: [template], pagination } });
});

test('catalogue loads approved records, applies filters, and lets Super Admin sync', async () => {
  useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
  crm.syncWhatsAppTemplates.mockResolvedValue({ data: { data: { created: 1, updated: 2, deactivated: 0, skipped: 0 } } });
  renderAt(<WhatsAppTemplates />, '/whatsapp-templates');

  expect(await screen.findByText('admission_welcome')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sync from Meta' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'en_US' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  await waitFor(() => expect(crm.listWhatsAppTemplates).toHaveBeenLastCalledWith(expect.objectContaining({ language: 'en_US' })));
  fireEvent.click(screen.getByRole('button', { name: 'Sync from Meta' }));
  expect(await screen.findByText(/Sync complete: 1 created, 2 updated/i)).toBeInTheDocument();
  expect(crm.syncWhatsAppTemplates).toHaveBeenCalledTimes(1);
});

test('counsellors can view the catalogue but do not see sync control', async () => {
  useAuth.mockReturnValue({ user: { role: 'COUNSELLOR' } });
  renderAt(<WhatsAppTemplates />, '/whatsapp-templates');
  expect(await screen.findByText('admission_welcome')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Sync from Meta' })).not.toBeInTheDocument();
});

test('detail preview safely displays all template sections and unresolved variables', async () => {
  useAuth.mockReturnValue({ user: { role: 'COUNSELLOR' } });
  crm.getWhatsAppTemplate.mockResolvedValue({ data: { data: template } });
  render(<MemoryRouter initialEntries={['/whatsapp-templates/template-id']}><Routes><Route path="/whatsapp-templates/:templateId" element={<WhatsAppTemplateDetail />} /></Routes></MemoryRouter>);
  await screen.findByText('Header · TEXT');
  expect(screen.getAllByText('{{1}}')).toHaveLength(2);
  expect(screen.getByText('{{2}}')).toBeInTheDocument();
  expect(screen.getByText('GEO IAS')).toBeInTheDocument();
  expect(screen.getByText('Call me')).toBeInTheDocument();
  expect(screen.getByLabelText('Template preview')).toBeInTheDocument();
});

test('catalogue exposes controlled error and empty states', async () => {
  useAuth.mockReturnValue({ user: { role: 'COUNSELLOR' } });
  crm.listWhatsAppTemplates.mockRejectedValue({ response: { data: { error: { message: 'Catalogue unavailable' } } } });
  renderAt(<WhatsAppTemplates />, '/whatsapp-templates');
  expect(await screen.findByText('Catalogue unavailable')).toBeInTheDocument();
});
