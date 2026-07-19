import React, { useState } from 'react';
import { CAlert, CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { createFollowUp } from '../../services/Apis/crm';
import { apiMessage } from '../Crm/common';
import { FollowUpForm } from '../FollowUps/FollowUpForm';

const FollowUpPanel = ({ contactId, activeLead, user, counsellors, onSaved }) => {
  const [open, setOpen] = useState(false); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  const admin = user?.role === 'SUPER_ADMIN';
  if (!activeLead || (!admin && activeLead.assignedCounsellorId !== user?.id)) return null;
  const submit = async (form) => { setSaving(true); setError(''); try { await createFollowUp({ contactId, assignedCounsellorId: form.assignedCounsellorId, type: form.type, dueAt: form.dueAt, priority: form.priority, purpose: form.purpose, internalNote: form.internalNote }); setMessage('Follow-up created.'); setOpen(false); await onSaved(); } catch (e) { setError(apiMessage(e, 'Follow-up could not be created.')); } finally { setSaving(false); } };
  return <CCard className="crm-section"><CCardHeader className="d-flex justify-content-between align-items-center"><span>Follow-ups</span><CButton size="sm" onClick={() => setOpen((value) => !value)}>{open ? 'Cancel' : 'Create Follow-up'}</CButton></CCardHeader><CCardBody>{message && <CAlert color="success">{message}</CAlert>}{error && <CAlert color="danger">{error}</CAlert>}{open ? <FollowUpForm contactId={contactId} assignedCounsellorId={activeLead.assignedCounsellorId || user?.id} counsellors={counsellors} admin={admin} onSubmit={submit} saving={saving} submitLabel="Create follow-up" /> : <p className="text-muted mb-0">Create and manage task follow-ups from the Follow-ups workspace.</p>}</CCardBody></CCard>;
};
export default FollowUpPanel;
