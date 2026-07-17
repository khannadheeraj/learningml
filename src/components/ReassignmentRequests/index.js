import React, { useCallback, useEffect, useState } from 'react';
import { CAlert, CButton, CCard, CCardBody, CFormInput, CFormSelect, CTable } from '@coreui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { approveReassignmentRequest, cancelReassignmentRequest, listCounsellorOptions, listReassignmentRequests, rejectReassignmentRequest } from '../../services/Apis/crm';
import { apiMessage, ErrorState, formatDate, LoadingState, PaginationControls, StatusBadge } from '../Crm/common';
import '../Crm/crm.css';

const ReassignmentRequests = () => {
  const { user } = useAuth();
  const admin = user?.role === 'SUPER_ADMIN';
  const [items, setItems] = useState([]); const [pagination, setPagination] = useState(null);
  const [status, setStatus] = useState('PENDING'); const [page, setPage] = useState(1);
  const [counsellors, setCounsellors] = useState([]); const [targets, setTargets] = useState({});
  const [notes, setNotes] = useState({}); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); const [message, setMessage] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const requests = [listReassignmentRequests({ page, pageSize: 25, status: status || undefined })];
      if (admin) requests.push(listCounsellorOptions());
      const [response, options] = await Promise.all(requests);
      setItems(response.data.data); setPagination(response.data.pagination);
      if (options) setCounsellors(options.data.data);
    } catch (requestError) { setError(apiMessage(requestError)); }
    finally { setLoading(false); }
  }, [admin, page, status]);
  useEffect(() => { load(); }, [load]);
  const act = async (action, success) => {
    setError(''); setMessage('');
    try { await action(); setMessage(success); await load(); }
    catch (requestError) { setError(apiMessage(requestError)); }
  };
  if (loading) return <LoadingState label="Loading reassignment requests…" />;
  return <main className="crm-page">
    <div className="crm-page-header"><div><h1>Reassignment requests</h1><p>{admin ? 'Review and decide counsellor requests.' : 'Track requests you submitted.'}</p></div></div>
    {message && <CAlert color="success">{message}</CAlert>}{error && <ErrorState message={error} onRetry={load} />}
    <CCard className="crm-section"><CCardBody><CFormSelect aria-label="Request status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{['PENDING','APPROVED','REJECTED','CANCELLED'].map((item) => <option key={item}>{item}</option>)}</CFormSelect></CCardBody></CCard>
    <CCard className="crm-section"><CCardBody className="p-0"><CTable responsive hover><thead><tr><th>Contact</th><th>Current owner</th><th>Reason</th><th>Status</th><th>Requested</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.contact ? <Link to={`/contacts/${item.contact.id}`}>{item.contact.displayName || item.contact.normalizedPhone}</Link> : '—'}</td><td>{item.currentCounsellor?.displayName || 'Unassigned'}</td><td>{item.reasonCode}<br/><small>{item.note}</small></td><td><StatusBadge value={item.status}/></td><td>{formatDate(item.requestedAt || item.createdAt, true)}</td><td>{item.status !== 'PENDING' ? '—' : admin ? <div className="d-flex gap-2 flex-wrap"><CFormSelect aria-label="Target counsellor" value={targets[item.id] || item.requestedTargetCounsellorId || ''} onChange={(e) => setTargets((current) => ({ ...current, [item.id]: e.target.value }))}><option value="">Choose owner</option>{counsellors.map((option) => <option key={option.id} value={option.id}>{option.displayName}</option>)}</CFormSelect><CFormInput aria-label="Decision note" placeholder="Decision note" value={notes[item.id] || ''} onChange={(e) => setNotes((current) => ({ ...current, [item.id]: e.target.value }))}/><CButton size="sm" onClick={() => act(() => approveReassignmentRequest(item.id, { version: item.version, targetCounsellorId: targets[item.id] || item.requestedTargetCounsellorId || null, decisionNote: notes[item.id] || null }), 'Request approved.')} disabled={!(targets[item.id] || item.requestedTargetCounsellorId)}>Approve</CButton><CButton size="sm" color="danger" variant="outline" onClick={() => act(() => rejectReassignmentRequest(item.id, { decisionNote: notes[item.id] || 'Request rejected by administrator.' }), 'Request rejected.')}>Reject</CButton></div> : <CButton size="sm" color="danger" variant="outline" onClick={() => act(() => cancelReassignmentRequest(item.id), 'Request cancelled.')}>Cancel</CButton>}</td></tr>)}</tbody></CTable>{!items.length && <p className="p-4 text-muted">No requests match this filter.</p>}</CCardBody></CCard>
    <PaginationControls pagination={pagination} onPage={setPage}/>
  </main>;
};
export default ReassignmentRequests;
