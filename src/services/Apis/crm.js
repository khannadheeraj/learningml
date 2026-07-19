import apiClient from './client';

export const listContacts = (params) => apiClient.get('/contacts', { params });
export const getContact = (contactId) => apiClient.get(`/contacts/${contactId}`);
export const createContact = (payload) => apiClient.post('/contacts', payload);
export const updateContact = (contactId, payload) => apiClient.patch(`/contacts/${contactId}`, payload);
export const updateContactPreferences = (contactId, payload) => apiClient.patch(`/contacts/${contactId}/preferences`, payload);
export const listContactActivities = (contactId, params) => apiClient.get(`/contacts/${contactId}/activities`, { params });

export const listLeads = (params) => apiClient.get('/leads', { params });
export const getLead = (leadId) => apiClient.get(`/leads/${leadId}`);
export const updateLead = (leadId, payload) => apiClient.patch(`/leads/${leadId}`, payload);
export const assignLead = (leadId, payload) => apiClient.post(`/leads/${leadId}/assignments`, payload);
export const listLeadAssignments = (leadId, params) => apiClient.get(`/leads/${leadId}/assignments`, { params });

export const listReassignmentRequests = (params) => apiClient.get('/reassignment-requests', { params });
export const createReassignmentRequest = (leadId, payload) => apiClient.post(`/leads/${leadId}/reassignment-requests`, payload);
export const approveReassignmentRequest = (requestId, payload) => apiClient.post(`/reassignment-requests/${requestId}/approve`, payload);
export const rejectReassignmentRequest = (requestId, payload) => apiClient.post(`/reassignment-requests/${requestId}/reject`, payload);
export const cancelReassignmentRequest = (requestId) => apiClient.post(`/reassignment-requests/${requestId}/cancel`);

export const listStaffUsers = (params) => apiClient.get('/users', { params });
export const listCounsellorOptions = () => apiClient.get('/users/counsellor-options');
export const createStaffUser = (payload) => apiClient.post('/users', payload);
export const updateStaffUser = (userId, payload) => apiClient.patch(`/users/${userId}`, payload);
export const resetStaffPassword = (userId, payload) => apiClient.post(`/users/${userId}/reset-password`, payload);

export const getDashboardSummary = () => apiClient.get('/dashboards/summary');

export const listWhatsAppTemplates = (params) => apiClient.get('/whatsapp-templates', { params });
export const getWhatsAppTemplate = (templateId) => apiClient.get(`/whatsapp-templates/${templateId}`);
export const syncWhatsAppTemplates = () => apiClient.post('/whatsapp-templates/sync');
export const sendWhatsAppTemplate = (payload, idempotencyKey) => apiClient.post('/whatsapp-template-sends', payload, {
  headers: { 'Idempotency-Key': idempotencyKey },
});
export const listWhatsAppConversations = (params) => apiClient.get('/whatsapp-conversations', { params });
export const listWhatsAppConversationMessages = (conversationId, params) => apiClient.get(`/whatsapp-conversations/${conversationId}/messages`, { params });
export const markWhatsAppConversationViewed = (conversationId) => apiClient.post(`/whatsapp-conversations/${conversationId}/view`);
export const sendWhatsAppConversationReply = (conversationId, text, idempotencyKey) => apiClient.post(`/whatsapp-conversations/${conversationId}/replies`, { text }, { headers: { 'Idempotency-Key': idempotencyKey } });
export const createWhatsAppBroadcast = (payload) => apiClient.post('/whatsapp-broadcasts', payload);
export const getWhatsAppBroadcast = (broadcastId) => apiClient.get(`/whatsapp-broadcasts/${broadcastId}`);
export const prepareWhatsAppBroadcast = (broadcastId, version) => apiClient.post(`/whatsapp-broadcasts/${broadcastId}/prepare`, { version });
export const listWhatsAppBroadcastRecipients = (broadcastId, params) => apiClient.get(`/whatsapp-broadcasts/${broadcastId}/recipients`, { params });
export const deleteWhatsAppBroadcast = (broadcastId, version) => apiClient.delete(`/whatsapp-broadcasts/${broadcastId}`, { params: { version } });
export const confirmWhatsAppBroadcast = (broadcastId, version) => apiClient.post(`/whatsapp-broadcasts/${broadcastId}/confirm`, { version });
export const executeWhatsAppBroadcastBatch = (broadcastId, batchSize) => apiClient.post(`/whatsapp-broadcasts/${broadcastId}/execute-batch`, { batchSize });
export const getWhatsAppBroadcastExecution = (broadcastId) => apiClient.get(`/whatsapp-broadcasts/${broadcastId}/execution`);
export const getWhatsAppBroadcastAnalytics = (broadcastId) => apiClient.get(`/whatsapp-broadcasts/${broadcastId}/analytics`);
export const listWhatsAppBroadcastReport = (broadcastId, params) => apiClient.get(`/whatsapp-broadcasts/${broadcastId}/report`, { params });
export const getWhatsAppBroadcastRecipient = (broadcastId, recipientId) => apiClient.get(`/whatsapp-broadcasts/${broadcastId}/recipients/${recipientId}`);
export const retryWhatsAppBroadcastFailures = (broadcastId, version) => apiClient.post(`/whatsapp-broadcasts/${broadcastId}/retry-failures`, { version });
export const cancelWhatsAppBroadcast = (broadcastId, version) => apiClient.post(`/whatsapp-broadcasts/${broadcastId}/cancel`, { version });

export const analyzeContactImport = (file) => {
  const form = new FormData();
  form.append('file', file);
  return apiClient.post('/contact-imports/analyze', form);
};
export const previewContactImport = (importId, payload, params) => apiClient.post(`/contact-imports/${importId}/preview`, payload, { params });
export const getContactImport = (importId, params) => apiClient.get(`/contact-imports/${importId}`, { params });
export const commitContactImport = (importId) => apiClient.post(`/contact-imports/${importId}/commit`);
export const downloadContactImportRejections = (importId) => apiClient.get(`/contact-imports/${importId}/rejections`, { responseType: 'blob' });
