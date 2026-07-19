import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow } from '@coreui/react';
import { useSearchParams } from 'react-router-dom';

import { listWhatsAppConversationMessages, listWhatsAppConversations, markWhatsAppConversationViewed, sendWhatsAppConversationReply } from '../../services/Apis/crm';
import { apiMessage, EmptyState, ErrorState, formatDate, labelFor, LoadingState, PaginationControls, StatusBadge } from '../Crm/common';
import '../Crm/crm.css';

const paramsFrom = (searchParams) => ({ page: Number(searchParams.get('page') || 1), pageSize: 25, search: searchParams.get('search') || '', reconciliationStatus: searchParams.get('reconciliationStatus') || '', unreadOnly: searchParams.get('unreadOnly') === 'true' });
const messageText = (message) => message.renderedText || message.selectedButton?.title || message.selectedButton?.id || message.templateName || 'No displayable message content.';

const WhatsAppInbox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => paramsFrom(searchParams), [searchParams]);
  const [filters, setFilters] = useState(params);
  const [conversations, setConversations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagePage, setMessagePage] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [reply, setReply] = useState(''); const [replyKey, setReplyKey] = useState(null); const [replying, setReplying] = useState(false);

  useEffect(() => { setFilters(params); }, [params]);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const response = await listWhatsAppConversations(params); setConversations(response.data.data || []); setPagination(response.data.pagination || null); }
    catch (requestError) { setError(apiMessage(requestError, 'WhatsApp conversations could not be loaded.')); }
    finally { setLoading(false); }
  }, [params]);
  useEffect(() => { load(); }, [load]);
  const apply = (event) => { event.preventDefault(); const next = new URLSearchParams(); Object.entries({ ...filters, page: 1 }).forEach(([key, value]) => { if (value && !(key === 'page' && Number(value) === 1)) next.set(key, value); }); setSearchParams(next); };
  const page = (value) => { const next = new URLSearchParams(searchParams); if (value === 1) next.delete('page'); else next.set('page', value); setSearchParams(next); };
  const loadMessages = async (conversation, cursor, append = false) => {
    setMessageLoading(true); setMessageError('');
    try { const response = await listWhatsAppConversationMessages(conversation.id, { pageSize: 50, ...(cursor ? { cursor } : {}) }); setMessages((current) => append ? [...current, ...(response.data.data || [])] : (response.data.data || [])); setMessagePage(response.data.pagination); }
    catch (requestError) { setMessageError(apiMessage(requestError, 'Message history could not be loaded.')); }
    finally { setMessageLoading(false); }
  };
  const select = async (conversation) => {
    setSelected(conversation); setMessages([]); setMessagePage(null); await loadMessages(conversation);
    try { await markWhatsAppConversationViewed(conversation.id); setConversations((current) => current.map((item) => item.id === conversation.id ? { ...item, unreadCount: 0 } : item)); setSelected((current) => current ? { ...current, unreadCount: 0 } : current); }
    catch (requestError) { setMessageError(apiMessage(requestError, 'The conversation was opened, but could not be marked viewed.')); }
  };
  const sendReply = async () => { const currentKey = replyKey || `reply-${Date.now()}-${Math.random()}`; setReplyKey(currentKey); setReplying(true); try { const response = await sendWhatsAppConversationReply(selected.id, reply, currentKey); setMessages((current) => [...current, response.data.data.message]); setReply(''); setReplyKey(null); } catch (requestError) { setMessageError(apiMessage(requestError, 'Reply could not be sent.')); } finally { setReplying(false); } };

  return <main className="crm-page"><div className="crm-page-header"><div><h1>WhatsApp Inbox</h1><p>Read-only conversation history for authorized CRM staff.</p></div></div>
    <CCard className="crm-section"><CCardBody><form className="crm-toolbar" onSubmit={apply}><div><CFormLabel htmlFor="inbox-search">Contact or phone</CFormLabel><CFormInput id="inbox-search" value={filters.search} onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))} /></div><div><CFormLabel htmlFor="inbox-reconciliation">Reconciliation</CFormLabel><CFormSelect id="inbox-reconciliation" value={filters.reconciliationStatus} onChange={(e) => setFilters((current) => ({ ...current, reconciliationStatus: e.target.value }))}><option value="">All conversations</option><option value="MATCHED">Matched</option><option value="UNKNOWN_NUMBER">Unknown number</option></CFormSelect></div><div><CFormLabel htmlFor="inbox-unread">Unread</CFormLabel><CFormSelect id="inbox-unread" value={String(filters.unreadOnly)} onChange={(e) => setFilters((current) => ({ ...current, unreadOnly: e.target.value === 'true' }))}><option value="false">All</option><option value="true">Unread only</option></CFormSelect></div><div><CButton type="submit">Apply</CButton></div><div><CButton type="button" variant="outline" onClick={() => setSearchParams({})}>Clear</CButton></div></form></CCardBody></CCard>
    {error && <ErrorState message={error} onRetry={load} />}{loading ? <LoadingState label="Loading WhatsApp conversations…" /> : !conversations.length ? <EmptyState title="No conversations found" detail="Try changing the inbox filters." /> : <CRow className="g-3"><CCol lg={5}><CCard className="crm-section"><CCardHeader>Conversations</CCardHeader><CCardBody className="p-0">{conversations.map((item) => <button type="button" className={`w-100 text-start border-0 p-3 ${selected?.id === item.id ? 'bg-light' : 'bg-white'}`} key={item.id} onClick={() => select(item)}><div className="d-flex justify-content-between gap-2"><strong>{item.contact?.displayName || 'Unknown number'}</strong>{item.unreadCount > 0 && <CBadge color="danger">{item.unreadCount}</CBadge>}</div><small>{item.contact?.phone || item.phone}</small><div className="text-truncate">{item.lastMessagePreview || 'No message preview'}</div><small className="text-muted">{labelFor(item.lastMessageDirection)} · {formatDate(item.lastMessageAt, true)} · <StatusBadge value={item.reconciliationStatus} /></small></button>)}<div className="p-3"><PaginationControls pagination={pagination} onPage={page} /></div></CCardBody></CCard></CCol><CCol lg={7}><CCard className="crm-section"><CCardHeader>{selected ? `${selected.contact?.displayName || 'Unknown number'} · Message history` : 'Message history'}</CCardHeader><CCardBody>{!selected ? <EmptyState title="Select a conversation" detail="Choose an authorized conversation to view its messages." /> : <>{messageError && <ErrorState message={messageError} onRetry={() => loadMessages(selected)} />}{messageLoading && !messages.length ? <LoadingState label="Loading message history…" /> : <div aria-label="Message history">{messages.map((message) => <div key={message.id} className={`p-3 mb-2 rounded ${message.direction === 'INBOUND' ? 'bg-light me-5' : 'bg-primary text-white ms-5'}`}><div>{messageText(message)}</div><small className={message.direction === 'INBOUND' ? 'text-muted' : 'text-white-50'}>{labelFor(message.type)} · {labelFor(message.status)} · {formatDate(message.createdAt, true)}</small></div>)}</div>}{messagePage?.hasNext && <CButton variant="outline" disabled={messageLoading} onClick={() => loadMessages(selected, messagePage.nextCursor, true)}>Load more messages</CButton>}</>}</CCardBody></CCard></CCol></CRow>}</main>;
};

export default WhatsAppInbox;
