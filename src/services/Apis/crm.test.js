import apiClient from './client';
import {
  analyzeContactImport, createContact, getWhatsAppTemplate, listContacts,
  cancelWhatsAppBroadcast, confirmWhatsAppBroadcast, createWhatsAppBroadcast, createFollowUp, deleteWhatsAppBroadcast, executeWhatsAppBroadcastBatch, getFollowUp, getWhatsAppBroadcast, getWhatsAppBroadcastAnalytics, getWhatsAppBroadcastExecution, getWhatsAppBroadcastRecipient, getWhatsAppBroadcastSchedule, listFollowUps, listWhatsAppBroadcastRecipients, listWhatsAppBroadcastReport, listWhatsAppBroadcasts, listWhatsAppTemplates, listWhatsAppConversations, listWhatsAppConversationMessages, markWhatsAppConversationViewed, prepareWhatsAppBroadcast, retryWhatsAppBroadcastFailures, scheduleWhatsAppBroadcast, sendWhatsAppTemplate, syncWhatsAppTemplates, unscheduleWhatsAppBroadcast, updateFollowUp, completeFollowUp, cancelFollowUp, updateStaffUser,
} from './crm';

jest.mock('./client', () => ({ get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() }));

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
  createWhatsAppBroadcast({ templateId: 'template-id' }); listWhatsAppBroadcasts({ page: 1, pageSize: 25 }); getWhatsAppBroadcast('broadcast-id'); prepareWhatsAppBroadcast('broadcast-id', 3); listWhatsAppBroadcastRecipients('broadcast-id', { status: 'ELIGIBLE' }); deleteWhatsAppBroadcast('broadcast-id', 3);
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-broadcasts', { templateId: 'template-id' });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts', { params: { page: 1, pageSize: 25 } });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id');
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/prepare', { version: 3 });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/recipients', { params: { status: 'ELIGIBLE' } });
  expect(apiClient.delete).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id', { params: { version: 3 } });
  confirmWhatsAppBroadcast('broadcast-id', 3); executeWhatsAppBroadcastBatch('broadcast-id', 25); getWhatsAppBroadcastExecution('broadcast-id'); retryWhatsAppBroadcastFailures('broadcast-id', 4); cancelWhatsAppBroadcast('broadcast-id', 4);
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/confirm', { version: 3 });
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/execute-batch', { batchSize: 25 });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/execution');
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/retry-failures', { version: 4 });
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/cancel', { version: 4 });
  getWhatsAppBroadcastAnalytics('broadcast-id'); listWhatsAppBroadcastReport('broadcast-id', { deliveryStatus: 'READ', page: 2 }); getWhatsAppBroadcastRecipient('broadcast-id', 'recipient-id');
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/analytics');
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/report', { params: { deliveryStatus: 'READ', page: 2 } });
  listWhatsAppBroadcastReport('broadcast-id', { executionStatus: '', deliveryStatus: '', page: 1, pageSize: 25 });
  listWhatsAppBroadcastReport('broadcast-id', { executionStatus: 'ACCEPTED', deliveryStatus: '', page: 1, pageSize: 25 });
  listWhatsAppBroadcastReport('broadcast-id', { executionStatus: '', deliveryStatus: 'READ', page: 1, pageSize: 25 });
  listWhatsAppBroadcastReport('broadcast-id', { executionStatus: 'ACCEPTED', deliveryStatus: 'READ', page: 1, pageSize: 25 });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/report', { params: { page: 1, pageSize: 25 } });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/report', { params: { executionStatus: 'ACCEPTED', page: 1, pageSize: 25 } });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/report', { params: { deliveryStatus: 'READ', page: 1, pageSize: 25 } });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/report', { params: { executionStatus: 'ACCEPTED', deliveryStatus: 'READ', page: 1, pageSize: 25 } });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/recipients/recipient-id');
  scheduleWhatsAppBroadcast('broadcast-id', { version: 4, scheduledFor: '2030-01-01T00:00:00.000Z' }); getWhatsAppBroadcastSchedule('broadcast-id'); unscheduleWhatsAppBroadcast('broadcast-id', 4);
  expect(apiClient.post).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/schedule', { version: 4, scheduledFor: '2030-01-01T00:00:00.000Z' });
  expect(apiClient.get).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/schedule');
  expect(apiClient.delete).toHaveBeenCalledWith('/whatsapp-broadcasts/broadcast-id/schedule', { params: { version: 4 } });
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

test('follow-up calls use the authenticated shared API client and versioned actions', () => {
  listFollowUps({ page: 1, overdue: true }); getFollowUp('follow-up-id'); createFollowUp({ contactId: 'contact-id', assignedCounsellorId: 'staff-id', dueAt: '2030-01-01T00:00:00.000Z' });
  updateFollowUp('follow-up-id', { version: 1, purpose: 'Call back' }); completeFollowUp('follow-up-id', { version: 2 }); cancelFollowUp('follow-up-id', { version: 2 });
  expect(apiClient.get).toHaveBeenCalledWith('/follow-ups', { params: { page: 1, overdue: true } });
  expect(apiClient.get).toHaveBeenCalledWith('/follow-ups/follow-up-id');
  expect(apiClient.post).toHaveBeenCalledWith('/follow-ups', expect.objectContaining({ contactId: 'contact-id' }));
  expect(apiClient.patch).toHaveBeenCalledWith('/follow-ups/follow-up-id', { version: 1, purpose: 'Call back' });
  expect(apiClient.post).toHaveBeenCalledWith('/follow-ups/follow-up-id/complete', { version: 2 });
  expect(apiClient.post).toHaveBeenCalledWith('/follow-ups/follow-up-id/cancel', { version: 2 });
});
