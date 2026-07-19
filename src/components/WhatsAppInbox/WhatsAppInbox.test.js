import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WhatsAppInbox from './index';
import * as crm from '../../services/Apis/crm';

jest.mock('../../services/Apis/crm', () => ({ listWhatsAppConversations: jest.fn(), listWhatsAppConversationMessages: jest.fn(), markWhatsAppConversationViewed: jest.fn(), sendWhatsAppConversationReply: jest.fn() }));

const pagination = { page: 1, pageSize: 25, totalRecords: 1, totalPages: 1, hasNext: false, hasPrevious: false };
const conversation = { id: 'conversation-id', phone: '919876543210', reconciliationStatus: 'MATCHED', lastMessagePreview: 'Please call me', lastMessageDirection: 'INBOUND', lastMessageType: 'TEXT', lastMessageAt: '2026-07-19T10:00:00Z', unreadCount: 2, contact: { id: 'contact-id', displayName: 'Asha Sen', phone: '919876543210' }, activeLead: { id: 'lead-id' }, assignedCounsellor: { id: 'owner-id', displayName: 'Owner' } };
const message = { id: 'message-id', direction: 'INBOUND', type: 'BUTTON_REPLY', renderedText: 'Interested', status: 'READ', createdAt: '2026-07-19T10:00:00Z' };

beforeEach(() => { jest.clearAllMocks(); crm.listWhatsAppConversations.mockResolvedValue({ data: { data: [conversation], pagination } }); crm.listWhatsAppConversationMessages.mockResolvedValue({ data: { data: [message], pagination: { hasNext: false, nextCursor: null } } }); crm.markWhatsAppConversationViewed.mockResolvedValue({ data: { data: {} } }); });

test('loads authorized conversations, marks selection viewed, and shows chronological messages', async () => {
  render(<MemoryRouter initialEntries={['/whatsapp-inbox']}><Routes><Route path="/whatsapp-inbox" element={<WhatsAppInbox />} /></Routes></MemoryRouter>);
  expect(await screen.findByText('Asha Sen')).toBeInTheDocument();
  expect(screen.getAllByText('+91 98765 43210').length).toBeGreaterThan(0);
  expect(screen.getByText('2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Asha Sen/i }));
  expect(await screen.findByText('Interested')).toBeInTheDocument();
  await waitFor(() => expect(crm.markWhatsAppConversationViewed).toHaveBeenCalledWith('conversation-id'));
  expect(screen.queryByText('2')).not.toBeInTheDocument();
});

test('uses normalized phone fallback and shows unknown phone as title and header', async () => {
  const normalized = { ...conversation, contact: { displayName: 'Fallback', normalizedPhone: '919111122233', phone: '' }, phone: '' };
  const unknown = { ...conversation, id: 'unknown-id', contact: null, phone: '919222233344', remotePhone: '919222233344' };
  crm.listWhatsAppConversations.mockResolvedValue({ data: { data: [normalized, unknown], pagination: { ...pagination, totalRecords: 2 } } });
  render(<MemoryRouter initialEntries={['/whatsapp-inbox']}><Routes><Route path="/whatsapp-inbox" element={<WhatsAppInbox />} /></Routes></MemoryRouter>);
  expect(await screen.findByText('Fallback')).toBeInTheDocument();
  expect(screen.getAllByText('+91 91111 22233').length).toBeGreaterThan(0);
  expect(screen.getAllByText('+91 92222 33344').length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: /\+91 92222 33344/ }));
  expect(screen.getAllByText('+91 92222 33344').length).toBeGreaterThan(0);
});

test('renders active window, sends once, and retries uncertain replies with the same key', async () => {
  const currentMessage = { ...message, createdAt: new Date().toISOString() };
  crm.listWhatsAppConversationMessages.mockResolvedValue({ data: { data: [currentMessage], pagination: { hasNext: false } } });
  crm.sendWhatsAppConversationReply.mockRejectedValueOnce({ request: {} }).mockResolvedValueOnce({ data: { data: { message: { id: 'outbound-id', direction: 'OUTBOUND', renderedText: 'Thanks' } } } });
  render(<MemoryRouter initialEntries={['/whatsapp-inbox']}><Routes><Route path="/whatsapp-inbox" element={<WhatsAppInbox />} /></Routes></MemoryRouter>);
  await screen.findByText('Asha Sen'); fireEvent.click(screen.getByRole('button', { name: /Asha Sen/i }));
  expect(await screen.findByText(/window is active/i)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Reply'), { target: { value: 'Thanks' } }); fireEvent.click(screen.getByRole('button', { name: 'Send reply' }));
  expect(await screen.findByText(/result is uncertain/i)).toBeInTheDocument(); const firstKey = crm.sendWhatsAppConversationReply.mock.calls[0][2];
  fireEvent.click(screen.getByRole('button', { name: 'Retry with same key' })); await waitFor(() => expect(crm.sendWhatsAppConversationReply).toHaveBeenCalledTimes(2)); expect(crm.sendWhatsAppConversationReply.mock.calls[1][2]).toBe(firstKey); expect(await screen.findByText('Thanks')).toBeInTheDocument();
});

test('applies unread and reconciliation filters and shows controlled errors', async () => {
  render(<MemoryRouter initialEntries={['/whatsapp-inbox']}><Routes><Route path="/whatsapp-inbox" element={<WhatsAppInbox />} /></Routes></MemoryRouter>);
  await screen.findByText('Asha Sen');
  fireEvent.change(screen.getByLabelText('Unread'), { target: { value: 'true' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  await waitFor(() => expect(crm.listWhatsAppConversations).toHaveBeenLastCalledWith(expect.objectContaining({ unreadOnly: true })));
  crm.listWhatsAppConversations.mockRejectedValue({ response: { data: { error: { message: 'Inbox unavailable' } } } });
  fireEvent.change(screen.getByLabelText('Contact or phone'), { target: { value: 'retry' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  expect(await screen.findByText('Inbox unavailable')).toBeInTheDocument();
});
