import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CButton, CCard, CCardBody, CFormInput, CFormLabel, CFormSelect,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { listContacts, listCounsellorOptions } from '../../services/Apis/crm';
import {
  apiMessage, EmptyState, ErrorState, formatDate, labelFor, LoadingState, PaginationControls, StatusBadge,
} from '../Crm/common';
import '../Crm/crm.css';


const queryObject = (searchParams) => {
  const result = { page: Number(searchParams.get('page') || 1), pageSize: 25 };
  ['search', 'city', 'source', 'isActive', 'doNotContact', 'assignedCounsellorId', 'createdFrom', 'createdTo', 'sort']
    .forEach((key) => { if (searchParams.get(key) !== null && searchParams.get(key) !== '') result[key] = searchParams.get(key); });
  return result;
};

const Contacts = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useMemo(() => queryObject(searchParams), [searchParams]);
  const [filters, setFilters] = useState(params);

  useEffect(() => { setFilters(params); }, [params]);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [contactsResponse, counsellorResponse] = await Promise.all([
        listContacts(params), listCounsellorOptions(),
      ]);
      setRecords(contactsResponse.data.data);
      setPagination(contactsResponse.data.pagination);
      setCounsellors(counsellorResponse.data.data);
    } catch (requestError) {
      setError(apiMessage(requestError, 'Contacts could not be loaded.'));
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
  const clearFilters = () => setSearchParams({});
  const setPage = (page) => {
    const next = new URLSearchParams(searchParams);
    if (page === 1) next.delete('page'); else next.set('page', page);
    setSearchParams(next);
  };

  return (
    <main className="crm-page">
      <div className="crm-page-header">
        <div><h1>All Contacts</h1><p>Search normalized Contact records and open the active admission journey.</p></div>
        <div className="crm-actions"><CButton component={Link} to="/contacts/import" variant="outline">Import Contacts</CButton><CButton component={Link} to="/contacts/new">Add Contact</CButton></div>
      </div>
      <CCard className="crm-section"><CCardBody>
        <form className="crm-toolbar" onSubmit={applyFilters}>
          <div><CFormLabel htmlFor="contact-search">Name, phone, or email</CFormLabel><CFormInput id="contact-search" value={filters.search || ''} onChange={(e) => update('search', e.target.value)} /></div>
          <div><CFormLabel htmlFor="contact-city">City</CFormLabel><CFormInput id="contact-city" value={filters.city || ''} onChange={(e) => update('city', e.target.value)} /></div>
          <div><CFormLabel htmlFor="contact-source">Source</CFormLabel><CFormInput id="contact-source" value={filters.source || ''} onChange={(e) => update('source', e.target.value)} /></div>
          <div><CFormLabel htmlFor="contact-active">Active state</CFormLabel><CFormSelect id="contact-active" value={filters.isActive || ''} onChange={(e) => update('isActive', e.target.value)}><option value="">All</option><option value="true">Active</option><option value="false">Inactive</option></CFormSelect></div>
          <div><CFormLabel htmlFor="contact-dnc">Do not contact</CFormLabel><CFormSelect id="contact-dnc" value={filters.doNotContact || ''} onChange={(e) => update('doNotContact', e.target.value)}><option value="">All</option><option value="true">Enabled</option><option value="false">Disabled</option></CFormSelect></div>
          <div><CFormLabel htmlFor="contact-owner">Assigned counsellor</CFormLabel><CFormSelect id="contact-owner" value={filters.assignedCounsellorId || ''} onChange={(e) => update('assignedCounsellorId', e.target.value)}><option value="">All</option>{counsellors.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</CFormSelect></div>
          <div><CFormLabel htmlFor="contact-from">Created from</CFormLabel><CFormInput id="contact-from" type="date" value={filters.createdFrom || ''} onChange={(e) => update('createdFrom', e.target.value)} /></div>
          <div><CFormLabel htmlFor="contact-to">Created to</CFormLabel><CFormInput id="contact-to" type="date" value={filters.createdTo || ''} onChange={(e) => update('createdTo', e.target.value)} /></div>
          <div><CButton type="submit">Apply</CButton></div><div><CButton type="button" variant="outline" onClick={clearFilters}>Clear</CButton></div>
        </form>
      </CCardBody></CCard>
      {error && <ErrorState message={error} onRetry={load} />}
      {loading ? <LoadingState label="Loading Contacts…" /> : !records.length ? <EmptyState /> : (
        <CCard className="crm-section"><CCardBody className="crm-table-wrap">
          <CTable hover responsive align="middle">
            <CTableHead><CTableRow>
              {['Name', 'Primary phone', 'Email', 'City', 'Source', 'Do not contact', 'Active lead', 'Assigned counsellor', 'Created', 'Updated'].map((column) => <CTableHeaderCell key={column}>{column}</CTableHeaderCell>)}
            </CTableRow></CTableHead>
            <CTableBody>{records.map((contact) => (
              <CTableRow key={contact.id}>
                <CTableDataCell><Link to={`/contacts/${contact.id}`} state={{ returnTo: `${location.pathname}${location.search}` }}>{contact.displayName || 'Incomplete Contact'}</Link></CTableDataCell>
                <CTableDataCell>{contact.normalizedPhone}</CTableDataCell><CTableDataCell>{contact.email || '—'}</CTableDataCell><CTableDataCell>{contact.city || '—'}</CTableDataCell>
                <CTableDataCell>{labelFor(contact.source)}</CTableDataCell><CTableDataCell><StatusBadge value={contact.communicationPreferences?.doNotContact ? 'DO_NOT_CONTACT' : 'ALLOWED'} /></CTableDataCell>
                <CTableDataCell><StatusBadge value={contact.activeLead?.status} /></CTableDataCell><CTableDataCell>{contact.assignedCounsellor?.displayName || 'Unassigned'}</CTableDataCell>
                <CTableDataCell>{formatDate(contact.createdAt)}</CTableDataCell><CTableDataCell>{formatDate(contact.updatedAt)}</CTableDataCell>
              </CTableRow>
            ))}</CTableBody>
          </CTable>
          <PaginationControls pagination={pagination} onPage={setPage} />
        </CCardBody></CCard>
      )}
    </main>
  );
};

export default Contacts;
