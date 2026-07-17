import React, { useEffect, useState } from 'react';
import {
  CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput,
  CFormLabel, CFormSelect, CFormTextarea, CRow,
} from '@coreui/react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import { createContact, listCounsellorOptions } from '../../services/Apis/crm';
import { apiFieldErrors, apiMessage, MODES, PRIORITIES, SOURCES, labelFor } from '../Crm/common';
import '../Crm/crm.css';


const initial = {
  firstName: '', lastName: '', displayName: '', phone: '', alternatePhone: '', email: '',
  city: '', state: '', companyOrCollege: '', instagramProfile: '', facebookProfile: '',
  linkedinProfile: '', source: 'MANUAL_ENTRY', sourceDetails: '', notes: '',
  courseInterest: '', leadPriority: 'MEDIUM', preferredMode: '', targetExamYear: '',
  assignedCounsellorId: '', createLead: true,
};

const Field = ({ id, label, error, ...props }) => (
  <CCol md={6}><CFormLabel htmlFor={id}>{label}</CFormLabel><CFormInput id={id} invalid={Boolean(error)} {...props} />{error && <div className="crm-field-error">{error}</div>}</CCol>
);

const ContactForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const admin = user?.role === 'SUPER_ADMIN';
  const [form, setForm] = useState(initial);
  const [counsellors, setCounsellors] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [existingId, setExistingId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (admin) listCounsellorOptions().then((response) => setCounsellors(response.data.data)).catch(() => setCounsellors([]));
    else setForm((current) => ({ ...current, source: 'COUNSELLOR_MANUAL_ENTRY' }));
  }, [admin]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true); setErrors({}); setMessage(''); setExistingId('');
    const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ''));
    if (payload.targetExamYear) payload.targetExamYear = Number(payload.targetExamYear);
    if (!admin) delete payload.assignedCounsellorId;
    try {
      const response = await createContact(payload);
      navigate(`/contacts/${response.data.data.contact.id}`, { replace: true, state: { created: true } });
    } catch (requestError) {
      const fieldErrors = apiFieldErrors(requestError);
      setErrors(fieldErrors);
      setExistingId(fieldErrors.existingContactId || '');
      setMessage(apiMessage(requestError, 'The Contact could not be created.'));
    } finally { setSubmitting(false); }
  };

  return (
    <main className="crm-page">
      <div className="crm-page-header"><div><h1>Add Contact</h1><p>Create the Contact and active admission Lead in one workflow.</p></div><CButton component={Link} to={admin ? '/contacts' : '/my-leads'} variant="outline">Cancel</CButton></div>
      {message && <CAlert color="danger">{message}{existingId && <> <Link to={`/contacts/${existingId}`}>Open existing Contact</Link>.</>}</CAlert>}
      <CForm onSubmit={submit}>
        <CCard className="crm-section"><CCardHeader>Identity and profile</CCardHeader><CCardBody><CRow className="g-3">
          <Field id="first-name" label="First name" value={form.firstName} error={errors.firstName} onChange={(e) => update('firstName', e.target.value)} />
          <Field id="last-name" label="Last name" value={form.lastName} error={errors.lastName} onChange={(e) => update('lastName', e.target.value)} />
          <Field id="display-name" label="Display name (optional)" value={form.displayName} error={errors.displayName} onChange={(e) => update('displayName', e.target.value)} />
          <Field id="primary-phone" label="Primary phone *" required value={form.phone} error={errors.phone} onChange={(e) => update('phone', e.target.value)} />
          <Field id="alternate-phone" label="Alternate phone" value={form.alternatePhone} error={errors.alternatePhone} onChange={(e) => update('alternatePhone', e.target.value)} />
          <Field id="contact-email" label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => update('email', e.target.value)} />
          <Field id="contact-city" label="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
          <Field id="contact-state" label="State" value={form.state} onChange={(e) => update('state', e.target.value)} />
          <Field id="contact-company" label="Company or college" value={form.companyOrCollege} onChange={(e) => update('companyOrCollege', e.target.value)} />
          <Field id="contact-instagram" label="Instagram profile" value={form.instagramProfile} onChange={(e) => update('instagramProfile', e.target.value)} />
          <Field id="contact-facebook" label="Facebook profile" value={form.facebookProfile} onChange={(e) => update('facebookProfile', e.target.value)} />
          <Field id="contact-linkedin" label="LinkedIn profile" value={form.linkedinProfile} onChange={(e) => update('linkedinProfile', e.target.value)} />
        </CRow></CCardBody></CCard>
        <CCard className="crm-section"><CCardHeader>Lead setup</CCardHeader><CCardBody><CRow className="g-3">
          <CCol md={6}><CFormLabel htmlFor="lead-source">Source</CFormLabel><CFormSelect id="lead-source" disabled={!admin} value={form.source} onChange={(e) => update('source', e.target.value)}>{SOURCES.map((value) => <option key={value} value={value}>{labelFor(value)}</option>)}</CFormSelect></CCol>
          <Field id="source-details" label="Source details" value={form.sourceDetails} onChange={(e) => update('sourceDetails', e.target.value)} />
          <CCol md={4}><CFormLabel htmlFor="lead-priority">Initial priority</CFormLabel><CFormSelect id="lead-priority" value={form.leadPriority} onChange={(e) => update('leadPriority', e.target.value)}>{PRIORITIES.map((value) => <option key={value}>{value}</option>)}</CFormSelect></CCol>
          <CCol md={4}><CFormLabel htmlFor="preferred-mode">Preferred mode</CFormLabel><CFormSelect id="preferred-mode" value={form.preferredMode} onChange={(e) => update('preferredMode', e.target.value)}><option value="">Unspecified</option>{MODES.map((value) => <option key={value}>{value}</option>)}</CFormSelect></CCol>
          <Field id="target-year" label="Target exam year" type="number" min="2020" max="2100" value={form.targetExamYear} onChange={(e) => update('targetExamYear', e.target.value)} />
          <Field id="course-interest" label="Initial course interest" value={form.courseInterest} onChange={(e) => update('courseInterest', e.target.value)} />
          {admin && <CCol md={6}><CFormLabel htmlFor="initial-owner">Initial assignment</CFormLabel><CFormSelect id="initial-owner" value={form.assignedCounsellorId} onChange={(e) => update('assignedCounsellorId', e.target.value)}><option value="">Leave unassigned</option>{counsellors.map((item) => <option value={item.id} key={item.id}>{item.displayName}</option>)}</CFormSelect></CCol>}
          <CCol xs={12}><CFormLabel htmlFor="contact-note">Short note</CFormLabel><CFormTextarea id="contact-note" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} /></CCol>
        </CRow><div className="crm-form-actions"><CButton type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create Contact and Lead'}</CButton></div></CCardBody></CCard>
      </CForm>
    </main>
  );
};

export default ContactForm;
