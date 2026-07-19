import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CButton, CCard, CCardBody, CFormInput, CFormLabel, CFormSelect,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import { listWhatsAppTemplates, syncWhatsAppTemplates } from '../../services/Apis/crm';
import {
  apiMessage, EmptyState, ErrorState, formatDate, labelFor, LoadingState, PaginationControls, StatusBadge,
} from '../Crm/common';
import '../Crm/crm.css';


const queryObject = (searchParams) => {
  const result = { page: Number(searchParams.get('page') || 1), pageSize: 25 };
  ['search', 'language', 'category'].forEach((key) => {
    if (searchParams.get(key)) result[key] = searchParams.get(key);
  });
  return result;
};

const WhatsAppTemplates = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => queryObject(searchParams), [searchParams]);
  const [filters, setFilters] = useState(params);
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => { setFilters(params); }, [params]);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await listWhatsAppTemplates(params);
      setTemplates(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (requestError) {
      setError(apiMessage(requestError, 'Approved WhatsApp templates could not be loaded.'));
    } finally { setLoading(false); }
  }, [params]);
  useEffect(() => { load(); }, [load]);

  const update = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const applyFilters = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    Object.entries({ ...filters, page: 1 }).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null && !(key === 'page' && Number(value) === 1)) next.set(key, value);
    });
    setSearchParams(next);
  };
  const setPage = (page) => {
    const next = new URLSearchParams(searchParams);
    if (page === 1) next.delete('page'); else next.set('page', page);
    setSearchParams(next);
  };
  const sync = async () => {
    setSyncing(true); setError(''); setSyncResult(null);
    try {
      const response = await syncWhatsAppTemplates();
      setSyncResult(response.data.data);
      await load();
    } catch (requestError) {
      setError(apiMessage(requestError, 'WhatsApp templates could not be synchronized.'));
    } finally { setSyncing(false); }
  };
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return <main className="crm-page">
    <div className="crm-page-header">
      <div><h1>WhatsApp Templates</h1><p>Approved templates available for future CRM messaging workflows.</p></div>
      {isSuperAdmin && <div className="crm-actions"><CButton onClick={sync} disabled={syncing}>{syncing ? 'Syncing from Meta…' : 'Sync from Meta'}</CButton></div>}
    </div>
    {syncResult && <CCard className="crm-section"><CCardBody role="status">
      Sync complete: {syncResult.created} created, {syncResult.updated} updated, {syncResult.deactivated} deactivated, {syncResult.skipped} skipped.
    </CCardBody></CCard>}
    <CCard className="crm-section"><CCardBody>
      <form className="crm-toolbar" onSubmit={applyFilters}>
        <div><CFormLabel htmlFor="template-search">Template name</CFormLabel><CFormInput id="template-search" value={filters.search || ''} onChange={(event) => update('search', event.target.value)} /></div>
        <div><CFormLabel htmlFor="template-language">Language</CFormLabel><CFormInput id="template-language" value={filters.language || ''} onChange={(event) => update('language', event.target.value)} placeholder="e.g. en_US" /></div>
        <div><CFormLabel htmlFor="template-category">Category</CFormLabel><CFormSelect id="template-category" value={filters.category || ''} onChange={(event) => update('category', event.target.value)}><option value="">All categories</option><option value="UTILITY">Utility</option><option value="MARKETING">Marketing</option><option value="AUTHENTICATION">Authentication</option></CFormSelect></div>
        <div><CButton type="submit">Apply</CButton></div><div><CButton type="button" variant="outline" onClick={() => setSearchParams({})}>Clear</CButton></div>
      </form>
    </CCardBody></CCard>
    {error && <ErrorState message={error} onRetry={load} />}
    {loading ? <LoadingState label="Loading approved templates…" /> : !templates.length ? <EmptyState title="No approved templates found" detail="Try changing the filters or ask a Super Admin to synchronize templates." /> : (
      <CCard className="crm-section"><CCardBody className="crm-table-wrap"><CTable hover responsive align="middle">
        <CTableHead><CTableRow>{['Name', 'Status', 'Category', 'Language', 'Last synchronized', ''].map((column) => <CTableHeaderCell key={column}>{column}</CTableHeaderCell>)}</CTableRow></CTableHead>
        <CTableBody>{templates.map((template) => <CTableRow key={template.id}>
          <CTableDataCell><Link to={`/whatsapp-templates/${template.id}`}>{template.name}</Link></CTableDataCell>
          <CTableDataCell><StatusBadge value={template.status} /></CTableDataCell>
          <CTableDataCell>{labelFor(template.category)}</CTableDataCell>
          <CTableDataCell>{template.language}</CTableDataCell>
          <CTableDataCell>{formatDate(template.lastSyncedAt, true)}</CTableDataCell>
          <CTableDataCell><CButton component={Link} to={`/whatsapp-templates/${template.id}`} size="sm" variant="outline">Preview</CButton></CTableDataCell>
        </CTableRow>)}</CTableBody>
      </CTable><PaginationControls pagination={pagination} onPage={setPage} /></CCardBody></CCard>
    )}
  </main>;
};

export default WhatsAppTemplates;
