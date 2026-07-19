import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import WhatsAppBroadcasts from './index';
import * as crm from '../../services/Apis/crm';

jest.mock('../../services/Apis/crm', () => ({ listWhatsAppTemplates: jest.fn(), createWhatsAppBroadcast: jest.fn(), prepareWhatsAppBroadcast: jest.fn(), listWhatsAppBroadcastRecipients: jest.fn(), deleteWhatsAppBroadcast: jest.fn(), confirmWhatsAppBroadcast: jest.fn(), executeWhatsAppBroadcastBatch: jest.fn(), getWhatsAppBroadcastExecution: jest.fn(), retryWhatsAppBroadcastFailures: jest.fn(), cancelWhatsAppBroadcast: jest.fn() }));

const template = { id: 'template-id', name: 'welcome', language: 'en_US', category: 'MARKETING', headers: [{ text: 'Hello {{1}}' }], body: { text: 'Mode: {{1}}' }, footer: { text: 'GEO IAS' }, buttons: [] };
const draft = { id: 'broadcast-id', version: 1, status: 'DRAFT', templateName: 'welcome', templateLanguage: 'en_US', templateCategory: 'MARKETING', preparationCounts: { eligible: 0, skipped: 0, rejected: 0, byReason: {} } };
const prepared = { ...draft, version: 2, preparedAt: '2026-07-19T10:00:00Z', preparationCounts: { eligible: 2, skipped: 1, rejected: 1, byReason: { DO_NOT_CONTACT: 1 } } };
const execution = { broadcastId: 'broadcast-id', status: 'EXECUTING', version: 3, totals: { accepted: 1, retryableFailure: 1, finalFailure: 0, remaining: 2, processing: 1, skipped: 1 } };

beforeEach(() => { jest.clearAllMocks(); window.confirm = jest.fn(() => true); crm.listWhatsAppTemplates.mockResolvedValue({ data: { data: [template] } }); crm.createWhatsAppBroadcast.mockResolvedValue({ data: { data: draft } }); crm.prepareWhatsAppBroadcast.mockResolvedValue({ data: { data: prepared } }); crm.listWhatsAppBroadcastRecipients.mockResolvedValue({ data: { data: [{ id: 'recipient-id', displayName: 'Asha', normalizedPhone: '919876543210', renderedText: 'Hello Asha', status: 'ACCEPTED', executionStatus: 'ACCEPTED' }], pagination: { page: 1, totalPages: 1 } } }); crm.confirmWhatsAppBroadcast.mockResolvedValue({ data: { data: execution } }); crm.executeWhatsAppBroadcastBatch.mockResolvedValue({ data: { data: { ...execution, totals: { ...execution.totals, accepted: 2, remaining: 1, processing: 0 }, batch: { claimed: 1 } } } }); crm.getWhatsAppBroadcastExecution.mockResolvedValue({ data: { data: execution } }); crm.retryWhatsAppBroadcastFailures.mockResolvedValue({ data: { data: execution } }); crm.cancelWhatsAppBroadcast.mockResolvedValue({ data: { data: { ...execution, status: 'CANCELLED', totals: { ...execution.totals, remaining: 0 } } } }); });

async function createAndPrepare() {
  render(<WhatsAppBroadcasts />); await screen.findByText('Create broadcast draft');
  fireEvent.change(screen.getByLabelText('Approved template'), { target: { value: 'template-id' } }); await screen.findByLabelText('Variable source 2');
  fireEvent.click(screen.getByRole('button', { name: 'Create draft' })); await screen.findByText('Broadcast: welcome');
  fireEvent.click(screen.getByRole('button', { name: 'Prepare recipients' })); await screen.findByLabelText(/I understand that confirmation freezes/i);
}

test('keeps mapping/preview behavior and requires explicit confirmation before execution', async () => {
  await createAndPrepare();
  const confirmButton = screen.getByRole('button', { name: 'Confirm and start execution' });
  expect(confirmButton).toBeDisabled();
  fireEvent.click(screen.getByLabelText(/I understand that confirmation freezes/i)); fireEvent.click(confirmButton);
  await waitFor(() => expect(crm.confirmWhatsAppBroadcast).toHaveBeenCalledWith('broadcast-id', 2));
  expect(await screen.findByText('Execution: EXECUTING')).toBeInTheDocument();
  expect(screen.getByText('Pending').parentElement).toHaveTextContent('1');
});

test('runs a selected batch once, refreshes totals, and shows safe recipient outcomes', async () => {
  await createAndPrepare(); fireEvent.click(screen.getByLabelText(/I understand that confirmation freezes/i)); fireEvent.click(screen.getByRole('button', { name: 'Confirm and start execution' })); await screen.findByText('Execution: EXECUTING');
  fireEvent.change(screen.getByLabelText('Batch size'), { target: { value: '25' } }); fireEvent.click(screen.getByRole('button', { name: 'Run next batch' }));
  await waitFor(() => expect(crm.executeWhatsAppBroadcastBatch).toHaveBeenCalledWith('broadcast-id', 25));
  expect(crm.getWhatsAppBroadcastExecution).toHaveBeenCalledWith('broadcast-id');
  expect(await screen.findByText('Asha')).toBeInTheDocument(); expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
});

test('approves only retryable failures, cancels remaining unsent, and handles version conflicts', async () => {
  await createAndPrepare(); fireEvent.click(screen.getByLabelText(/I understand that confirmation freezes/i)); fireEvent.click(screen.getByRole('button', { name: 'Confirm and start execution' })); await screen.findByText('Execution: EXECUTING');
  fireEvent.click(screen.getByRole('button', { name: 'Retry retryable failures' })); await waitFor(() => expect(crm.retryWhatsAppBroadcastFailures).toHaveBeenCalledWith('broadcast-id', 3)); await screen.findByText(/Retryable failures were approved/i);
  fireEvent.click(screen.getByRole('button', { name: 'Cancel remaining unsent' })); await waitFor(() => expect(crm.cancelWhatsAppBroadcast).toHaveBeenCalledWith('broadcast-id', 3));
  expect(await screen.findByText(/Remaining unsent recipients were cancelled/i)).toBeInTheDocument();
});

test('shows a clear optimistic-version conflict without duplicate control actions', async () => {
  crm.confirmWhatsAppBroadcast.mockRejectedValue({ response: { status: 409 } });
  await createAndPrepare(); fireEvent.click(screen.getByLabelText(/I understand that confirmation freezes/i)); fireEvent.click(screen.getByRole('button', { name: 'Confirm and start execution' }));
  expect(await screen.findByText(/changed elsewhere/i)).toBeInTheDocument(); expect(crm.executeWhatsAppBroadcastBatch).not.toHaveBeenCalled();
});
