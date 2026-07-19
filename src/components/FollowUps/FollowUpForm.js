import React, { useEffect, useState } from 'react';
import { CButton, CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow } from '@coreui/react';

export const FOLLOW_UP_TYPES = ['CALL', 'WHATSAPP', 'MEETING', 'DOCUMENT', 'PAYMENT', 'GENERAL'];
export const FOLLOW_UP_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const localDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value); const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const FollowUpForm = ({ task, contactId, assignedCounsellorId, counsellors = [], admin, onSubmit, saving, submitLabel = 'Save follow-up' }) => {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  useEffect(() => setForm({
    type: 'CALL', priority: 'MEDIUM', purpose: '', internalNote: '', ...task,
    contactId: task?.contactId || contactId || '',
    assignedCounsellorId: task?.assignedCounsellorId || assignedCounsellorId || '',
    dueAt: task?.dueAt ? localDateTime(task.dueAt) : '',
  }), [task, contactId, assignedCounsellorId]);
  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault(); setError('');
    if (!form.contactId || !form.assignedCounsellorId || !form.purpose.trim() || !form.dueAt) { setError('Contact, counsellor, purpose and due date/time are required.'); return; }
    const due = new Date(form.dueAt);
    if (Number.isNaN(due.getTime()) || due <= new Date()) { setError('Choose a future due date and time.'); return; }
    onSubmit({ ...form, purpose: form.purpose.trim(), internalNote: form.internalNote.trim() || undefined, dueAt: due.toISOString() });
  };
  return <form onSubmit={submit} aria-label="Follow-up form"><CRow className="g-3">
    <CCol md={admin ? 4 : 6}><CFormLabel>Type</CFormLabel><CFormSelect value={form.type} onChange={(e) => change('type', e.target.value)}>{FOLLOW_UP_TYPES.map((value) => <option key={value}>{value}</option>)}</CFormSelect></CCol>
    <CCol md={admin ? 4 : 6}><CFormLabel>Priority</CFormLabel><CFormSelect value={form.priority} onChange={(e) => change('priority', e.target.value)}>{FOLLOW_UP_PRIORITIES.map((value) => <option key={value}>{value}</option>)}</CFormSelect></CCol>
    {admin && <CCol md={4}><CFormLabel>Assigned counsellor</CFormLabel><CFormSelect required value={form.assignedCounsellorId} onChange={(e) => change('assignedCounsellorId', e.target.value)}><option value="">Select</option>{counsellors.map((person) => <option key={person.id} value={person.id}>{person.displayName}</option>)}</CFormSelect></CCol>}
    <CCol md={6}><CFormLabel>Due date and time</CFormLabel><CFormInput type="datetime-local" required value={form.dueAt} onChange={(e) => change('dueAt', e.target.value)} /></CCol>
    <CCol md={6}><CFormLabel>Purpose</CFormLabel><CFormInput required maxLength={500} value={form.purpose} onChange={(e) => change('purpose', e.target.value)} /></CCol>
    <CCol xs={12}><CFormLabel>Internal note (optional)</CFormLabel><CFormTextarea maxLength={2000} value={form.internalNote || ''} onChange={(e) => change('internalNote', e.target.value)} /><small className="text-muted">Internal CRM note only. It is never sent through WhatsApp.</small></CCol>
  </CRow>{error && <div className="crm-field-error mt-2">{error}</div>}<div className="crm-form-actions"><CButton type="submit" disabled={saving}>{saving ? 'Saving…' : submitLabel}</CButton></div></form>;
};
