import React, { useCallback, useEffect, useState } from 'react';
import { CCard, CCardBody } from '@coreui/react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import { getDashboardSummary } from '../../services/Apis/crm';
import { apiMessage, ErrorState, LoadingState } from '../Crm/common';
import '../Crm/crm.css';


const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const response = await getDashboardSummary();
      setSummary(response.data.data);
    } catch (requestError) {
      setError(apiMessage(requestError, 'Dashboard counts could not be loaded.'));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const admin = user?.role === 'SUPER_ADMIN';
  const cards = admin ? [
    ['Total Contacts', summary?.totalContacts, '/contacts'],
    ['Active Leads', summary?.activeLeads, '/leads'],
    ['Unassigned Leads', summary?.unassignedLeads, '/leads/unassigned'],
    ['Needs Contact', summary?.needsContact, '/leads/needs-contact'],
    ['Interested Leads', summary?.interested, '/leads/interested'],
    ['Pending Reassignments', summary?.pendingReassignmentRequests, '/reassignment-requests'],
    ['Active Counsellors', summary?.activeCounsellors, '/staff-users'],
  ] : [
    ['My Leads', summary?.myLeads, '/my-leads'],
    ['New', summary?.new, '/my-leads?status=NEW'],
    ['Needs Contact', summary?.needsContact, '/my-leads?status=NEEDS_CONTACT'],
    ['Interested', summary?.interested, '/my-leads?status=INTERESTED'],
    ['Pending Reassignments', summary?.pendingReassignmentRequests, '/reassignment-requests'],
  ];

  return (
    <main className="crm-page">
      <div className="crm-page-header">
        <div><h1>{admin ? 'Operations Dashboard' : 'My Work Dashboard'}</h1><p>Current CRM workload and quick navigation.</p></div>
      </div>
      {error && <ErrorState message={error} onRetry={load} />}
      {!summary && !error ? <LoadingState label="Loading dashboard…" /> : (
        <div className="crm-card-grid">
          {cards.map(([label, value, to]) => (
            <CCard className="crm-metric" key={label}>
              <CCardBody>
                <div className="text-muted small">{label}</div>
                <div className="crm-metric-value">{value ?? 0}</div>
                <Link to={to}>Open queue</Link>
              </CCardBody>
            </CCard>
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
