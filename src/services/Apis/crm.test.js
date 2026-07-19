import apiClient from './client';
import {
  analyzeContactImport, createContact, getWhatsAppTemplate, listContacts,
  listWhatsAppTemplates, listWhatsAppConversations, listWhatsAppConversationMessages, markWhatsAppConversationViewed, sendWhatsAppTemplate, syncWhatsAppTemplates, updateStaffUser,
} from './crm';

jest.mock('./client', () => ({ get: jest.fn(), post: jest.fn(), patch: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

test('CRM calls reuse the authenticated shared API client', () => {
  listContacts({ page: 2, search: 'Asha' });
  createContact({ phone: '9876543210' });
  updateStaffUser('staff-id', { version: 1, displayName: 'Asha' });
  expect(apiClient.get).toHaveBeenCalledWith('/contacts', { params: { page: 2, search: 'Asha' } });
  expect(apiClient.post).toHaveBeenCalledWith('/contacts', { phone: '9876543210' });
  expect(apiClient.patch).toHaveBeenCalledWith('/users/staff-id', { version: 1, displayName: 'Asha' });
});

test('WhatsApp template catalogue calls reuse the authenticated shared API client', () => {
  listWhatsAppTemplates({ page: 2, language: 'en_US' });
  getWhatsAppTemplate('template-id');
  syncWhatsAppTemplates();
  sendWhatsAppTemplate({ contactId: 'contact-id', templateId: 'template-id', variableValues: ['Asha'] }, 'idempotency-key');
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-templates', { params: { page: 2, language: 'en_US' } });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-templates/template-id');
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-templates/sync');
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-template-sends', { contactId: 'contact-id', templateId: 'template-id', variableValues: ['Asha'] }, { headers: { 'Idempotency-Key': 'idempotency-key' } });
  listWhatsAppConversations({ unreadOnly: true }); listWhatsAppConversationMessages('conversation-id', { cursor: 'cursor' }); markWhatsAppConversationViewed('conversation-id');
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-conversations', { params: { unreadOnly: true } });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-conversations/conversation-id/messages', { params: { cursor: 'cursor' } });
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-conversations/conversation-id/view');
});

test('import analysis sends multipart form data without a second HTTP client', () => {
  const file = new File(['Name,Phone'], 'contacts.csv', { type: 'text/csv' });
  analyzeContactImport(file);
  expect(apiClient.post).toHaveBeenCalledTimes(1);
  expect(apiClient.post.mock.calls[0][0]).toBe('/contact-imports/analyze');
  expect(apiClient.post.mock.calls[0][1]).toBeInstanceOf(FormData);
});
