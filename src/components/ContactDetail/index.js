import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel,
  CFormSelect, CFormTextarea, CRow,
} from '@coreui/react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import {
  assignLead, createReassignmentRequest, getContact, getLead, listContactActivities,
  listCounsellorOptions, listLeadAssignments, updateContact, updateContactPreferences, updateLead,
} from '../../services/Apis/crm';
import {
  apiFieldErrors, apiMessage, ErrorState, formatDate, labelFor, LEAD_STATUSES,
  LoadingState, MODES, PRIORITIES, SOURCES,
} from '../Crm/common';
import '../Crm/crm.css';
import WhatsAppTemplateSendPanel from './WhatsAppTemplateSendPanel';


const contactFields = [
  ['firstName', 'First name'], ['lastName', 'Last name'], ['displayName', 'Display name'],
  ['phone', 'Primary phone'], ['alternatePhone', 'Alternate phone'], ['email', 'Email'],
  ['city', 'City'], ['state', 'State'], ['companyOrCollege', 'Company or college'],
  ['instagramProfile', 'Instagram profile'], ['facebookProfile', 'Facebook profile'],
  ['linkedinProfile', 'LinkedIn profile'], ['sourceDetails', 'Source details'], ['notes', 'Notes'],
];

const ContactDetail = () => {
  const { contactId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const admin = user?.role === 'SUPER_ADMIN';
  const [detail, setDetail] = useState(null);
  const [leadDetail, setLeadDetail] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityPagination, setActivityPagination] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [contactForm, setContactForm] = useState({});
  const [leadForm, setLeadForm] = useState({});
  const [preferenceForm, setPreferenceForm] = useState({ reason: '' });
  const [assignmentForm, setAssignmentForm] = useState({ counsellorId: '', reasonCode: 'MANUAL_ASSIGNMENT', reason: '' });
  const [requestForm, setRequestForm] = useState({ reasonCode: 'WORKLOAD', requestedTargetCounsellorId: '', note: '' });
  const [editingContact, setEditingContact] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ownerMap = useMemo(() => Object.fromEntries(counsellors.map((item) => [item.id, item.displayName])), [counsellors]);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const contactResponse = await getContact(contactId);
      const nextDetail = contactResponse.data.data;
      const requests = [listContactActivities(contactId, { page: 1, pageSize: 20 }), listCounsellorOptions()];
      if (nextDetail.activeLead) requests.push(getLead(nextDetail.activeLead.id), listLeadAssignments(nextDetail.activeLead.id, { page: 1, pageSize: 100 }));
      const [activityResponse, counsellorResponse, leadResponse, assignmentResponse] = await Promise.all(requests);
      setDetail(nextDetail); setContactForm(nextDetail.contact); setPreferenceForm({ ...nextDetail.preferences, reason: '' });
      setActivities(activityResponse.data.data); setActivityPagination(activityResponse.data.pagination);
      setCounsellors(counsellorResponse.data.data);
      if (leadResponse) {
        setLeadDetail(leadResponse.data.data);
        setLeadForm(leadResponse.data.data.lead);
        setAssignmentForm((current) => ({ ...current, counsellorId: nextDetail.activeLead.assignedCounsellorId || '' }));
        setAssignments(assignmentResponse.data.data);
      } else { setLeadDetail(null); setLeadForm({}); setAssignments([]); }
    } catch (requestError) { setError(apiMessage(requestError, 'Contact details could not be loaded.')); }
    finally { setLoading(false); }
  }, [contactId]);
  useEffect(() => { load(); }, [load]);

  const run = async (action, success) => {
    setSaving(true); setMessage(''); setError(''); setFieldErrors({});
    try { await action(); setMessage(success); await load(); return true; }
    catch (requestError) { setError(apiMessage(requestError)); setFieldErrors(apiFieldErrors(requestError)); return false; }
    finally { setSaving(false); }
  };

  const saveContact = async (event) => {
    event.preventDefault();
    const allowed = Object.fromEntries(contactFields.map(([field]) => [field, contactForm[field] ?? '']));
    if (admin) allowed.source = contactForm.source || null;
    const ok = await run(() => updateContact(contactId, { version: detail.contact.version, ...allowed }), 'Contact details updated.');
    if (ok) setEditingContact(false);
  };
  const saveLead = (event) => {
    event.preventDefault();
    const payload = {
      version: detail.activeLead.version, status: leadForm.status, priority: leadForm.priority,
      preferredMode: leadForm.preferredMode || null,
      targetExamYear: leadForm.targetExamYear ? Number(leadForm.targetExamYear) : null,
      lostReason: leadForm.lostReason || null,
    };
    if (admin) payload.sourceDetails = leadForm.sourceDetails || null;
    return run(() => updateLead(detail.activeLead.id, payload), 'Lead updated.');
  };
  const savePreferences = async (event) => {
    event.preventDefault();
    const unsuppressing = detail.preferences?.doNotContact && !preferenceForm.doNotContact;
    if (unsuppressing && !window.confirm('Unsuppress this Contact and allow future eligible communication?')) return;
    if (!unsuppressing && preferenceForm.doNotContact !== detail.preferences?.doNotContact
      && !window.confirm('Apply this global do-not-contact change?')) return;
    await run(() => updateContactPreferences(contactId, {
      version: detail.preferences.version,
      whatsappAllowed: Boolean(preferenceForm.whatsappAllowed),
      marketingAllowed: Boolean(preferenceForm.marketingAllowed),
      doNotContact: Boolean(preferenceForm.doNotContact),
      optOutSource: preferenceForm.optOutSource || 'ADMIN',
      reason: preferenceForm.reason,
    }), 'Communication preferences updated.');
  };
  const submitAssignment = (event) => {
    event.preventDefault();
    if (!window.confirm('Confirm this Lead assignment change?')) return;
    return run(() => assignLead(detail.activeLead.id, { ...assignmentForm, version: detail.activeLead.version }), 'Lead assignment updated.');
  };
  const submitReassignment = (event) => {
    event.preventDefault();
    const payload = { reasonCode: requestForm.reasonCode, note: requestForm.note || undefined };
    if (requestForm.requestedTargetCounsellorId) payload.requestedTargetCounsellorId = requestForm.requestedTargetCounsellorId;
    return run(() => createReassignmentRequest(detail.activeLead.id, payload), 'Reassignment request submitted.');
  };
  const loadMoreActivities = async () => {
    const response = await listContactActivities(contactId, { page: activityPagination.page + 1, pageSize: 20 });
    setActivities((current) => [...current, ...response.data.data]); setActivityPagination(response.data.pagination);
  };

  if (loading) return <LoadingState label="Loading Contact…" />;
  if (!detail) return <main className="crm-page"><ErrorState message={error || 'Contact not found.'} onRetry={load} /></main>;
  const contact = detail.contact; const lead = detail.activeLead;
  const backTo = location.state?.returnTo || (admin ? '/contacts' : '/my-leads');

  return (
    <main className="crm-page">
      <div className="crm-page-header"><div><h1>{contact.displayName || 'Incomplete Contact'}</h1><p>{contact.normalizedPhone}</p></div><CButton component={Link} to={backTo} variant="outline">Back to list</CButton></div>
      {message && <CAlert color="success">{message}</CAlert>}{error && <ErrorState message={error} onRetry={error.includes('changed after') ? load : undefined} />}
      <CCard className="crm-section"><CCardHeader className="d-flex justify-content-between align-items-center"><span>Identity</span><CButton size="sm" variant="outline" onClick={() => setEditingContact((value) => !value)}>{editingContact ? 'Cancel editing' : 'Edit Contact'}</CButton></CCardHeader><CCardBody>
        {!editingContact ? <dl className="crm-definition-grid">
          {contactFields.map(([field, label]) => <div key={field}><dt>{label}</dt><dd>{contact[field] || '—'}</dd></div>)}
          <div><dt>Source</dt><dd>{labelFor(contact.source)}</dd></div><div><dt>Created</dt><dd>{formatDate(contact.createdAt, true)}</dd></div><div><dt>Last updated</dt><dd>{formatDate(contact.updatedAt, true)}</dd></div>
        </dl> : <form onSubmit={saveContact}><CRow className="g-3">{contactFields.map(([field, label]) => <CCol md={6} key={field}><CFormLabel htmlFor={`edit-${field}`}>{label}</CFormLabel><CFormInput id={`edit-${field}`} value={contactForm[field] || ''} onChange={(e) => setContactForm((current) => ({ ...current, [field]: e.target.value }))} invalid={Boolean(fieldErrors[field])} />{fieldErrors[field] && <div className="crm-field-error">{fieldErrors[field]}</div>}</CCol>)}{admin && <CCol md={6}><CFormLabel htmlFor="edit-source">Source</CFormLabel><CFormSelect id="edit-source" value={contactForm.source || ''} onChange={(e) => setContactForm((current) => ({ ...current, source: e.target.value }))}>{SOURCES.map((item) => <option key={item}>{item}</option>)}</CFormSelect></CCol>}</CRow><div className="crm-form-actions"><CButton type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save corrections'}</CButton></div></form>}
      </CCardBody></CCard>
      {lead && <CCard className="crm-section"><CCardHeader>Lead summary and update</CCardHeader><CCardBody><form onSubmit={saveLead}><CRow className="g-3">
        <CCol md={3}><CFormLabel htmlFor="edit-status">Status</CFormLabel><CFormSelect id="edit-status" value={leadForm.status || ''} onChange={(e) => setLeadForm((current) => ({ ...current, status: e.target.value }))}>{LEAD_STATUSES.map((item) => <option key={item}>{item}</option>)}</CFormSelect></CCol>
        <CCol md={3}><CFormLabel htmlFor="edit-priority">Priority</CFormLabel><CFormSelect id="edit-priority" value={leadForm.priority || ''} onChange={(e) => setLeadForm((current) => ({ ...current, priority: e.target.value }))}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</CFormSelect></CCol>
        <CCol md={3}><CFormLabel htmlFor="edit-mode">Preferred mode</CFormLabel><CFormSelect id="edit-mode" value={leadForm.preferredMode || ''} onChange={(e) => setLeadForm((current) => ({ ...current, preferredMode: e.target.value }))}><option value="">Unspecified</option>{MODES.map((item) => <option key={item}>{item}</option>)}</CFormSelect></CCol>
        <CCol md={3}><CFormLabel htmlFor="edit-year">Target exam year</CFormLabel><CFormInput id="edit-year" type="number" value={leadForm.targetExamYear || ''} onChange={(e) => setLeadForm((current) => ({ ...current, targetExamYear: e.target.value }))} /></CCol>
        {admin && <CCol xs={12}><CFormLabel htmlFor="lead-source-details">Lead source details</CFormLabel><CFormInput id="lead-source-details" value={leadForm.sourceDetails || ''} onChange={(e) => setLeadForm((current) => ({ ...current, sourceDetails: e.target.value }))}/></CCol>}
        {leadForm.status === 'LOST' && <CCol xs={12}><CFormLabel htmlFor="lost-reason">Lost reason *</CFormLabel><CFormTextarea id="lost-reason" required value={leadForm.lostReason || ''} onChange={(e) => setLeadForm((current) => ({ ...current, lostReason: e.target.value }))} /></CCol>}
      </CRow><div className="crm-definition-grid mt-3"><div><dt>Assigned counsellor</dt><dd>{detail.assignedCounsellor?.displayName || 'Unassigned'}</dd></div><div><dt>Created</dt><dd>{formatDate(lead.createdAt, true)}</dd></div><div><dt>Last activity</dt><dd>{formatDate(lead.lastActivityAt, true)}</dd></div><div><dt>Course interests</dt><dd>{leadDetail?.courseInterests?.map((item) => item.temporaryCourseLabel).filter(Boolean).join(', ') || '—'}</dd></div></div><div className="crm-form-actions"><CButton type="submit" disabled={saving}>Save Lead</CButton></div></form></CCardBody></CCard>}
      {admin && detail.preferences && <CCard className="crm-section"><CCardHeader>Communication preferences and suppression</CCardHeader><CCardBody><form onSubmit={savePreferences}><CRow className="g-3"><CCol md={3}><CFormLabel htmlFor="whatsapp-allowed">WhatsApp allowed</CFormLabel><CFormSelect id="whatsapp-allowed" value={String(Boolean(preferenceForm.whatsappAllowed))} onChange={(e) => setPreferenceForm((current) => ({ ...current, whatsappAllowed: e.target.value === 'true' }))}><option value="true">Yes</option><option value="false">No</option></CFormSelect></CCol><CCol md={3}><CFormLabel htmlFor="marketing-allowed">Marketing allowed</CFormLabel><CFormSelect id="marketing-allowed" value={String(Boolean(preferenceForm.marketingAllowed))} onChange={(e) => setPreferenceForm((current) => ({ ...current, marketingAllowed: e.target.value === 'true' }))}><option value="true">Yes</option><option value="false">No</option></CFormSelect></CCol><CCol md={3}><CFormLabel htmlFor="dnc-state">Do not contact</CFormLabel><CFormSelect id="dnc-state" value={String(Boolean(preferenceForm.doNotContact))} onChange={(e) => setPreferenceForm((current) => ({ ...current, doNotContact: e.target.value === 'true' }))}><option value="true">Enabled</option><option value="false">Disabled</option></CFormSelect></CCol><CCol md={3}><CFormLabel htmlFor="preference-reason">Reason *</CFormLabel><CFormInput id="preference-reason" required minLength={2} value={preferenceForm.reason || ''} onChange={(e) => setPreferenceForm((current) => ({ ...current, reason: e.target.value }))} /></CCol></CRow><p className="text-muted mt-3 mb-0">Opt-out source: {preferenceForm.optOutSource || '—'} · Opt-out time: {formatDate(preferenceForm.optOutAt, true)}</p><div className="crm-form-actions"><CButton type="submit" disabled={saving}>Update preferences</CButton></div></form></CCardBody></CCard>}
      {lead && admin && <CCard className="crm-section"><CCardHeader>Lead assignment</CCardHeader><CCardBody><form onSubmit={submitAssignment}><CRow className="g-3"><CCol md={4}><CFormLabel htmlFor="assignment-owner">Target counsellor</CFormLabel><CFormSelect id="assignment-owner" required value={assignmentForm.counsellorId} onChange={(e) => setAssignmentForm((current) => ({ ...current, counsellorId: e.target.value }))}><option value="">Select</option>{counsellors.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</CFormSelect></CCol><CCol md={3}><CFormLabel htmlFor="assignment-code">Reason code</CFormLabel><CFormInput id="assignment-code" required value={assignmentForm.reasonCode} onChange={(e) => setAssignmentForm((current) => ({ ...current, reasonCode: e.target.value }))} /></CCol><CCol md={5}><CFormLabel htmlFor="assignment-reason">Reason</CFormLabel><CFormInput id="assignment-reason" required value={assignmentForm.reason} onChange={(e) => setAssignmentForm((current) => ({ ...current, reason: e.target.value }))} /></CCol></CRow><div className="crm-form-actions"><CButton type="submit" disabled={saving}>Confirm assignment</CButton></div></form><hr /><h3 className="h6">Assignment history</h3><ul>{assignments.map((item) => <li key={item.id}>{formatDate(item.assignedAt, true)} — {ownerMap[item.toCounsellorId] || 'Unknown counsellor'} ({item.reason || item.reasonCode})</li>)}</ul></CCardBody></CCard>}
      {lead && !admin && <CCard className="crm-section"><CCardHeader>Request reassignment</CCardHeader><CCardBody><form onSubmit={submitReassignment}><CRow className="g-3"><CCol md={4}><CFormLabel htmlFor="request-code">Reason</CFormLabel><CFormSelect id="request-code" value={requestForm.reasonCode} onChange={(e) => setRequestForm((current) => ({ ...current, reasonCode: e.target.value }))}>{['LANGUAGE_REQUIREMENT', 'COURSE_SPECIALIZATION', 'COUNSELLOR_UNAVAILABLE', 'LEAD_REQUESTED_CHANGE', 'WORKLOAD', 'WRONG_ASSIGNMENT', 'OTHER'].map((item) => <option key={item}>{item}</option>)}</CFormSelect></CCol><CCol md={4}><CFormLabel htmlFor="requested-owner">Requested counsellor (optional)</CFormLabel><CFormSelect id="requested-owner" value={requestForm.requestedTargetCounsellorId} onChange={(e) => setRequestForm((current) => ({ ...current, requestedTargetCounsellorId: e.target.value }))}><option value="">No preference</option>{counsellors.filter((item) => item.id !== user.id).map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</CFormSelect></CCol><CCol md={4}><CFormLabel htmlFor="request-note">Note</CFormLabel><CFormInput id="request-note" value={requestForm.note} onChange={(e) => setRequestForm((current) => ({ ...current, note: e.target.value }))} /></CCol></CRow><div className="crm-form-actions"><CButton type="submit" disabled={saving}>Submit request</CButton></div></form></CCardBody></CCard>}
      <WhatsAppTemplateSendPanel contactId={contactId} contact={contact} preferences={detail.preferences} activeLead={lead} user={user} onSent={load} />
      <CCard className="crm-section"><CCardHeader>Activity timeline</CCardHeader><CCardBody>{!activities.length ? <p className="text-muted">No activities recorded.</p> : <ul className="crm-timeline">{activities.map((item) => <li key={item.id}><strong>{labelFor(item.type)}</strong><div>{item.summary}</div><small className="text-muted">{formatDate(item.createdAt, true)}</small></li>)}</ul>}{activityPagination?.hasNext && <CButton variant="outline" onClick={loadMoreActivities}>Load more</CButton>}</CCardBody></CCard>
    </main>
  );
};

export default ContactDetail;
