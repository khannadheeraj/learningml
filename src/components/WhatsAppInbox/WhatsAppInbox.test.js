import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WhatsAppInbox from './index';
import * as crm from '../../services/Apis/crm';

jest.mock('../../services/Apis/crm', () => ({ listWhatsAppConversations: jest.fn(), listWhatsAppConversationMessages: jest.fn(), markWhatsAppConversationViewed: jest.fn() }));

const pagination = { page: 1, pageSize: 25, totalRecords: 1, totalPages: 1, hasNext: false, hasPrevious: false };
const conversation = { id: 'conversation-id', phone: '919876543210', reconciliationStatus: 'MATCHED', lastMessagePreview: 'Please call me', lastMessageDirection: 'INBOUND', lastMessageType: 'TEXT', lastMessageAt: '2026-07-19T10:00:00Z', unreadCount: 2, contact: { id: 'contact-id', displayName: 'Asha Sen', phone: '919876543210' }, activeLead: { id: 'lead-id' }, assignedCounsellor: { id: 'owner-id', displayName: 'Owner' } };
const message = { id: 'message-id', direction: 'INBOUND', type: 'BUTTON_REPLY', renderedText: 'Interested', status: 'READ', createdAt: '2026-07-19T10:00:00Z' };

beforeEach(() => { jest.clearAllMocks(); crm.listWhatsAppConversations.mockResolvedValue({ data: { data: [conversation], pagination } }); crm.listWhatsAppConversationMessages.mockResolvedValue({ data: { data: [message], pagination: { hasNext: false, nextCursor: null } } }); crm.markWhatsAppConversationViewed.mockResolvedValue({ data: { data: {} } }); });

test('loads authorized conversations, marks selection viewed, and shows chronological messages', async () => {
  render(<MemoryRouter initialEntries={['/whatsapp-inbox']}><Routes><Route path="/whatsapp-inbox" element={<WhatsAppInbox />} /></Routes></MemoryRouter>);
  expect(await screen.findByText('Asha Sen')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Asha Sen/i }));
  expect(await screen.findByText('Interested')).toBeInTheDocument();
  await waitFor(() => expect(crm.markWhatsAppConversationViewed).toHaveBeenCalledWith('conversation-id'));
  expect(screen.queryByText('2')).not.toBeInTheDocument();
});

test('applies unread and reconciliation filters and shows controlled errors', async () => {
  render(<MemoryRouter initialEntries={['/whatsapp-inbox']}><Routes><Route path="/whatsapp-inbox" element={<WhatsAppInbox />} /></Routes></MemoryRouter>);
  await screen.findByText('Asha Sen');
  fireEvent.change(screen.getByLabelText('Reconciliation'), { target: { value: 'UNKNOWN_NUMBER' } });
  fireEvent.change(screen.getByLabelText('Unread'), { target: { value: 'true' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  await waitFor(() => expect(crm.listWhatsAppConversations).toHaveBeenLastCalledWith(expect.objectContaining({ reconciliationStatus: 'UNKNOWN_NUMBER', unreadOnly: true })));
  crm.listWhatsAppConversations.mockRejectedValue({ response: { data: { error: { message: 'Inbox unavailable' } } } });
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(await screen.findByText('Inbox unavailable')).toBeInTheDocument();
});
