import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CButton, CCard, CCardBody, CFormInput, CFormLabel, CFormSelect,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import { listCounsellorOptions, listLeads } from '../../services/Apis/crm';
import {
  apiMessage, EmptyState, ErrorState, formatDate, labelFor, LEAD_STATUSES,
  LoadingState, MODES, PaginationControls, PRIORITIES, StatusBadge,
} from '../Crm/common';
import '../Crm/crm.css';


const EMPTY_PRESET = {};

const LeadList = ({ title = 'All Leads', preset = EMPTY_PRESET }) => {
  const { user } = useAuth();
  const admin = user?.role === 'SUPER_ADMIN';
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => {
    const values = { page: Number(searchParams.get('page') || 1), pageSize: 25, ...preset };
    ['search', 'status', 'priority', 'assignedCounsellorId', 'source', 'preferredMode', 'targetYear', 'createdFrom', 'createdTo', 'lastActivityFrom', 'lastActivityTo', 'sort']
      .forEach((key) => { if (!preset[key] && searchParams.get(key)) values[key] = searchParams.get(key); });
    return values;
  }, [searchParams, preset]);
  const [filters, setFilters] = useState(params);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => setFilters(params), [params]);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const requests = [listLeads(params)];
      if (admin) requests.push(listCounsellorOptions());
      const [leadResponse, counsellorResponse] = await Promise.all(requests);
      setRecords(leadResponse.data.data); setPagination(leadResponse.data.pagination);
      if (counsellorResponse) setCounsellors(counsellorResponse.data.data);
    } catch (requestError) { setError(apiMessage(requestError, 'Leads could not be loaded.')); }
    finally { setLoading(false); }
  }, [admin, params]);
  useEffect(() => { load(); }, [load]);

  const update = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const apply = (event) => {
    event.preventDefault(); const next = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (!preset[key] && value !== '' && value !== undefined && value !== null && key !== 'pageSize' && !(key === 'page' && Number(value) === 1)) next.set(key, value);
    });
    setSearchParams(next);
  };
  const setPage = (page) => { const next = new URLSearchParams(searchParams); if (page === 1) next.delete('page'); else next.set('page', page); setSearchParams(next); };

  return (
    <main className="crm-page">
      <div className="crm-page-header"><div><h1>{title}</h1><p>Server-filtered admission Leads with current ownership and activity.</p></div><CButton component={Link} to="/contacts/new">Add Contact</CButton></div>
      <CCard className="crm-section"><CCardBody><form className="crm-toolbar" onSubmit={apply}>
        <div><CFormLabel htmlFor="lead-search">Name or phone</CFormLabel><CFormInput id="lead-search" value={filters.search || ''} onChange={(e) => update('search', e.target.value)} /></div>
        {!preset.status && <div><CFormLabel htmlFor="lead-status">Status</CFormLabel><CFormSelect id="lead-status" value={filters.status || ''} onChange={(e) => update('status', e.target.value)}><option value="">All</option>{LEAD_STATUSES.map((item) => <option key={item}>{item}</option>)}</CFormSelect></div>}
        <div><CFormLabel htmlFor="lead-priority">Priority</CFormLabel><CFormSelect id="lead-priority" value={filters.priority || ''} onChange={(e) => update('priority', e.target.value)}><option value="">All</option>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</CFormSelect></div>
        {admin && <div><CFormLabel htmlFor="lead-owner">Counsellor</CFormLabel><CFormSelect id="lead-owner" value={filters.assignedCounsellorId || ''} onChange={(e) => update('assignedCounsellorId', e.target.value)}><option value="">All</option>{counsellors.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</CFormSelect></div>}
        <div><CFormLabel htmlFor="lead-mode">Mode</CFormLabel><CFormSelect id="lead-mode" value={filters.preferredMode || ''} onChange={(e) => update('preferredMode', e.target.value)}><option value="">All</option>{MODES.map((item) => <option key={item}>{item}</option>)}</CFormSelect></div>
        <div><CFormLabel htmlFor="lead-year">Target year</CFormLabel><CFormInput id="lead-year" type="number" value={filters.targetYear || ''} onChange={(e) => update('targetYear', e.target.value)} /></div>
        <div><CFormLabel htmlFor="lead-source">Source</CFormLabel><CFormInput id="lead-source" value={filters.source || ''} onChange={(e) => update('source', e.target.value)} /></div>
        <div><CButton type="submit">Apply</CButton></div><div><CButton type="button" variant="outline" onClick={() => setSearchParams({})}>Clear</CButton></div>
      </form></CCardBody></CCard>
      {error && <ErrorState message={error} onRetry={load} />}
      {loading ? <LoadingState label="Loading Leads…" /> : !records.length ? <EmptyState title="No Leads found" /> : (
        <CCard className="crm-section"><CCardBody className="crm-table-wrap"><CTable hover align="middle">
          <CTableHead><CTableRow>{['Contact', 'Phone', 'Status', 'Priority', 'Counsellor', 'Mode', 'Target year', 'Source', 'Last activity', 'Created'].map((item) => <CTableHeaderCell key={item}>{item}</CTableHeaderCell>)}</CTableRow></CTableHead>
          <CTableBody>{records.map((lead) => <CTableRow key={lead.id}>
            <CTableDataCell><Link to={`/contacts/${lead.contact?.id}`} state={{ returnTo: `${location.pathname}${location.search}` }}>{lead.contact?.displayName || 'Incomplete Contact'}</Link></CTableDataCell>
            <CTableDataCell>{lead.contact?.normalizedPhone || '—'}</CTableDataCell><CTableDataCell><StatusBadge value={lead.status} /></CTableDataCell><CTableDataCell><StatusBadge value={lead.priority} /></CTableDataCell>
            <CTableDataCell>{lead.assignedCounsellor?.displayName || 'Unassigned'}</CTableDataCell><CTableDataCell>{labelFor(lead.preferredMode)}</CTableDataCell><CTableDataCell>{lead.targetExamYear || '—'}</CTableDataCell>
            <CTableDataCell>{labelFor(lead.source)}</CTableDataCell><CTableDataCell>{formatDate(lead.lastActivityAt, true)}</CTableDataCell><CTableDataCell>{formatDate(lead.createdAt)}</CTableDataCell>
          </CTableRow>)}</CTableBody>
        </CTable><PaginationControls pagination={pagination} onPage={setPage} /></CCardBody></CCard>
      )}
    </main>
  );
};

export default LeadList;
