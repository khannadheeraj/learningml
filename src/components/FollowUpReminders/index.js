import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { useAuth } from '../../auth/AuthProvider';
import { dismissFollowUpReminder, getFollowUpReminderSummary, listCounsellorOptions, listFollowUpReminders, snoozeFollowUpReminder } from '../../services/Apis/crm';
import { localDateTimeToUtcIso, formatDate } from '../Crm/common';
import { LoadingState, ErrorState } from '../Crm/common';

const PAGE_SIZE = 25;
const categories = ['ALL', 'OVERDUE', 'DUE_NOW', 'DUE_SOON'];
const responseData = (response) => response?.data?.data || response?.data || {};
const errorText = (error) => error?.response?.data?.detail || error?.response?.data?.message || 'Unable to load reminders.';

export default function FollowUpReminders() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN';
  const [category, setCategory] = useState('ALL');
  const [counsellorId, setCounsellorId] = useState('');
  const [counsellors, setCounsellors] = useState([]);
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({ OVERDUE: 0, DUE_NOW: 0, DUE_SOON: 0 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [snooze, setSnooze] = useState(null);
  const [snoozeValue, setSnoozeValue] = useState('');
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    if (isAdmin) listCounsellorOptions().then((r) => setCounsellors(responseData(r) || [])).catch(() => setCounsellors([]));
  }, [isAdmin]);

  const load = useCallback(async (requestedPage = page) => {
    setLoading(true); setError('');
    const params = { page: requestedPage, pageSize: PAGE_SIZE };
    if (category !== 'ALL') params.category = category;
    if (isAdmin && counsellorId) params.assignedCounsellorId = counsellorId;
    try {
      const [listResponse, summaryResponse] = await Promise.all([listFollowUpReminders(params), getFollowUpReminderSummary(isAdmin && counsellorId ? { assignedCounsellorId: counsellorId } : undefined)]);
      const list = responseData(listResponse);
      setItems(Array.isArray(list) ? list : list.data || []);
      setPagination(list.pagination || { page: requestedPage, totalPages: 1 });
      setCounts(responseData(summaryResponse) || {});
    } catch (err) { setError(errorText(err)); }
    finally { setLoading(false); }
  }, [category, counsellorId, isAdmin, page]);

  useEffect(() => { load(page); }, [load, page]);
  const refresh = () => load(page);
  const changeCategory = (value) => { setCategory(value); setPage(1); };
  const actionRefresh = async (action) => { setActionBusy(true); setActionError(''); try { await action(); await load(1); setPage(1); } catch (err) { setActionError(errorText(err)); } finally { setActionBusy(false); } };
  const submitSnooze = () => {
    const timestamp = localDateTimeToUtcIso(snoozeValue);
    if (!timestamp || new Date(timestamp) <= new Date()) { setActionError('Choose a future date and time.'); return; }
    actionRefresh(() => snoozeFollowUpReminder(snooze.followUpId, timestamp)).then(() => { setSnooze(null); setSnoozeValue(''); });
  };
  const displayName = (item) => item.contact?.displayName || item.contact?.name || item.contact?.normalizedPhone || item.phone || 'Unknown contact';
  const counsellorName = (item) => counsellors.find((c) => c.id === item.assignedCounsellorId)?.displayName || item.assignedCounsellorId || '—';

  return <CCard>
    <CCardHeader className="d-flex justify-content-between align-items-center"><strong>Follow-up Reminders</strong><CButton size="sm" color="secondary" onClick={refresh} disabled={loading || actionBusy}>Refresh</CButton></CCardHeader>
    <CCardBody>
      {actionError && <CAlert color="danger" dismissible onClose={() => setActionError('')}>{actionError}</CAlert>}
      <div className="d-flex flex-wrap gap-2 mb-3">{categories.map((value) => <CButton key={value} color={category === value ? 'primary' : 'light'} onClick={() => changeCategory(value)}>{value.replace('_', ' ')} {value !== 'ALL' && <span className="ms-1">({counts[value] || 0})</span>}</CButton>)}{isAdmin && <CFormSelect aria-label="Filter by counsellor" value={counsellorId} onChange={(e) => { setCounsellorId(e.target.value); setPage(1); }} style={{ maxWidth: 240 }}><option value="">All counsellors</option>{counsellors.map((c) => <option key={c.id} value={c.id}>{c.displayName || c.name}</option>)}</CFormSelect>}</div>
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={refresh} /> : items.length === 0 ? <div className="text-muted py-4">No actionable reminders.</div> : <CTable responsive hover><CTableHead><CTableRow><CTableHeaderCell>Contact</CTableHeaderCell><CTableHeaderCell>Lead</CTableHeaderCell><CTableHeaderCell>Task</CTableHeaderCell><CTableHeaderCell>Due</CTableHeaderCell><CTableHeaderCell>Purpose</CTableHeaderCell><CTableHeaderCell>Actions</CTableHeaderCell></CTableRow></CTableHead><CTableBody>{items.map((item) => <CTableRow key={item.followUpId} className={item.category === 'OVERDUE' ? 'table-danger' : ''}><CTableDataCell><Link to={`/contacts/${item.contact?.id || item.contactId}`}>{displayName(item)}</Link><div className="small text-muted">{item.contact?.normalizedPhone || item.contact?.phone || item.phone || '—'}</div></CTableDataCell><CTableDataCell>{item.lead?.status || '—'}<div className="small text-muted">{counsellorName(item)}</div></CTableDataCell><CTableDataCell><span className={item.priority === 'HIGH' || item.priority === 'URGENT' ? 'fw-bold text-danger' : ''}>{item.taskType || item.type} · {item.priority}</span></CTableDataCell><CTableDataCell>{formatDate(item.dueAt, true)}<div className="small">{item.category.replace('_', ' ')}</div></CTableDataCell><CTableDataCell>{item.purpose || '—'}</CTableDataCell><CTableDataCell><div className="d-flex gap-1"><Link className="btn btn-sm btn-outline-primary" to="/follow-ups">Open follow-up</Link><CButton size="sm" color="light" onClick={() => { setSnooze(item); setSnoozeValue(''); }}>Snooze</CButton><CButton size="sm" color="light" onClick={() => window.confirm('Dismiss this reminder?') && actionRefresh(() => dismissFollowUpReminder(item.followUpId))}>Dismiss</CButton></div></CTableDataCell></CTableRow>)}</CTableBody></CTable>}
      {!loading && !error && pagination.totalPages > 1 && <div className="d-flex justify-content-between align-items-center"><CButton size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</CButton><span>Page {page} of {pagination.totalPages}</span><CButton size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</CButton></div>}
    </CCardBody>
    <CModal visible={Boolean(snooze)} onClose={() => setSnooze(null)}><CModalHeader><CModalTitle>Snooze reminder</CModalTitle></CModalHeader><CModalBody><label htmlFor="snooze-until" className="form-label">Snooze until</label><CFormInput id="snooze-until" type="datetime-local" value={snoozeValue} onChange={(e) => setSnoozeValue(e.target.value)} /></CModalBody><CModalFooter><CButton color="secondary" onClick={() => setSnooze(null)}>Cancel</CButton><CButton color="primary" disabled={actionBusy} onClick={submitSnooze}>Snooze</CButton></CModalFooter></CModal>
  </CCard>;
}
