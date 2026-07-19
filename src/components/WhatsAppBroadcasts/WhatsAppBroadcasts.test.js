import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import WhatsAppBroadcasts from './index';
import * as crm from '../../services/Apis/crm';

jest.mock('../../services/Apis/crm', () => ({ listWhatsAppTemplates: jest.fn(), createWhatsAppBroadcast: jest.fn(), prepareWhatsAppBroadcast: jest.fn(), listWhatsAppBroadcastRecipients: jest.fn(), deleteWhatsAppBroadcast: jest.fn() }));

const template = { id: 'template-id', name: 'welcome', language: 'en_US', category: 'MARKETING', headers: [{ text: 'Hello {{1}}' }], body: { text: 'Mode: {{1}}' }, footer: { text: 'GEO IAS' }, buttons: [] };
const draft = { id: 'broadcast-id', version: 1, templateName: 'welcome', templateLanguage: 'en_US', templateCategory: 'MARKETING', preparationCounts: { eligible: 0, skipped: 0, rejected: 0, byReason: {} } };

beforeEach(() => { jest.clearAllMocks(); crm.listWhatsAppTemplates.mockResolvedValue({ data: { data: [template] } }); crm.createWhatsAppBroadcast.mockResolvedValue({ data: { data: draft } }); crm.prepareWhatsAppBroadcast.mockResolvedValue({ data: { data: { ...draft, version: 2, preparationCounts: { eligible: 1, skipped: 1, rejected: 1, byReason: { DO_NOT_CONTACT: 1 } } } } }); crm.listWhatsAppBroadcastRecipients.mockResolvedValue({ data: { data: [{ id: 'recipient-id', displayName: 'Asha', normalizedPhone: '919876543210', renderedText: 'Hello Asha', exclusionReason: null }], pagination: { page: 1, totalPages: 1 } } }); });

test('creates a mapped draft, previews the template, and prepares recipient tabs', async () => {
  render(<WhatsAppBroadcasts />); await screen.findByText('Create broadcast draft');
  fireEvent.change(screen.getByLabelText('Approved template'), { target: { value: 'template-id' } });
  expect(screen.getByLabelText('Template preview')).toBeInTheDocument();
  expect(screen.getAllByText('{{1}}').length).toBeGreaterThan(0);
  await screen.findByLabelText('Variable source 2');
  fireEvent.change(screen.getByLabelText('Variable source 2'), { target: { value: 'LEAD' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create draft' }));
  await screen.findByText('Draft: welcome');
  expect(crm.createWhatsAppBroadcast).toHaveBeenCalledWith(expect.objectContaining({ templateId: 'template-id', variableMappings: expect.any(Array) }));
  fireEvent.click(screen.getByRole('button', { name: 'Prepare recipients' }));
  await waitFor(() => expect(crm.prepareWhatsAppBroadcast).toHaveBeenCalledWith('broadcast-id', 1));
  expect(await screen.findByText('DO_NOT_CONTACT: 1')).toBeInTheDocument();
  expect(crm.listWhatsAppBroadcastRecipients).toHaveBeenCalledWith('broadcast-id', expect.objectContaining({ status: 'ELIGIBLE' }));
});

test('shows a clear conflict message and supports recipient tab selection', async () => {
  crm.createWhatsAppBroadcast.mockResolvedValue({ data: { data: draft } }); crm.prepareWhatsAppBroadcast.mockRejectedValue({ response: { status: 409 } });
  render(<WhatsAppBroadcasts />); await screen.findByText('Create broadcast draft');
  fireEvent.change(screen.getByLabelText('Approved template'), { target: { value: 'template-id' } }); fireEvent.click(screen.getByRole('button', { name: 'Create draft' })); await screen.findByText('Draft: welcome');
  fireEvent.click(screen.getByRole('button', { name: 'Prepare recipients' })); expect(await screen.findByText(/changed elsewhere/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'SKIPPED' })); await waitFor(() => expect(crm.listWhatsAppBroadcastRecipients).toHaveBeenCalledWith('broadcast-id', expect.objectContaining({ status: 'SKIPPED' })));
});
