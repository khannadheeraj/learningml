import React, { useEffect, useMemo, useState } from 'react';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react';

import { getWhatsAppTemplate, listWhatsAppTemplates, sendWhatsAppTemplate } from '../../services/Apis/crm';
import { apiMessage, ErrorState, LoadingState } from '../Crm/common';
import TemplatePreview from '../WhatsAppTemplates/TemplatePreview';

const tokenPattern = /{{\s*(\d+)\s*}}/g;

export const createIdempotencyKey = () => {
  if (window.crypto?.randomUUID) return `whatsapp-template-${window.crypto.randomUUID()}`;
  return `whatsapp-template-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const tokensIn = (value) => [...String(value || '').matchAll(tokenPattern)].map((match) => match[1]);

export const templateVariableFields = (template) => {
  const fields = [];
  (template?.headers || []).forEach((header, headerIndex) => tokensIn(header.text).forEach((token, index) => fields.push({
    key: `header-${headerIndex}-${index}`, section: 'Header', token, headerIndex,
    label: `Header variable {{${token}}}`,
  })));
  tokensIn(template?.body).forEach((token, index) => fields.push({
    key: `body-${index}`, section: 'Body', token, label: `Body variable {{${token}}}`,
  }));
  (template?.buttons || []).forEach((button, buttonIndex) => {
    if (button.type === 'URL' && button.url) tokensIn(button.url).forEach((token, index) => fields.push({
      key: `button-${buttonIndex}-${index}`, section: 'Dynamic URL button', token, buttonIndex,
      label: `Dynamic URL button variable {{${token}}}`,
    }));
  });
  return fields;
};

const renderWithValues = (text, fields, values, predicate) => {
  let tokenIndex = 0;
  return String(text || '').replace(tokenPattern, (match) => {
    const field = fields.find((item) => predicate(item, tokenIndex));
    tokenIndex += 1;
    return field && values[field.key] ? values[field.key] : match;
  });
};

export const renderTemplateWithValues = (template, fields, values) => ({
  ...template,
  headers: (template.headers || []).map((header, headerIndex) => ({ ...header,
    text: renderWithValues(header.text, fields, values, (field, tokenIndex) => field.section === 'Header' && field.headerIndex === headerIndex && Number(field.key.split('-').slice(-1)[0]) === tokenIndex),
  })),
  body: renderWithValues(template.body, fields, values, (field, tokenIndex) => field.section === 'Body' && Number(field.key.split('-').slice(-1)[0]) === tokenIndex),
  footer: template.footer,
  buttons: (template.buttons || []).map((button, buttonIndex) => ({ ...button,
    url: renderWithValues(button.url, fields, values, (field, tokenIndex) => field.section === 'Dynamic URL button' && field.buttonIndex === buttonIndex && Number(field.key.split('-').slice(-1)[0]) === tokenIndex),
  })),
});

const validWhatsAppPhone = (phone) => /^91[6-9]\d{9}$/.test(String(phone || ''));

const WhatsAppTemplateSendPanel = ({ contactId, contact, preferences, activeLead, user, onSent }) => {
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [catalogueError, setCatalogueError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [template, setTemplate] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [values, setValues] = useState({});
  const [sending, setSending] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const isAdmin = user?.role === 'SUPER_ADMIN';
  const isAssignedCounsellor = user?.role === 'COUNSELLOR' && activeLead?.assignedCounsellorId === user?.id;
  const canSend = isAdmin || isAssignedCounsellor;
  const fields = useMemo(() => templateVariableFields(template), [template]);
  const eligibilityReason = !canSend ? 'Only a Super Admin or this Contact’s assigned Counsellor can send a template.'
    : preferences?.doNotContact ? 'This Contact is suppressed by the do-not-contact preference.'
      : preferences?.whatsappAllowed === false ? 'This Contact has not allowed WhatsApp communication.'
        : !contact?.isActive ? 'This Contact is inactive.'
          : !validWhatsAppPhone(contact?.normalizedPhone) ? 'This Contact does not have a valid WhatsApp phone number.'
            : template?.category === 'MARKETING' && preferences?.marketingAllowed === false ? 'This Contact has not allowed marketing communication.'
              : '';
  const eligible = !eligibilityReason;

  const loadTemplates = async () => {
    setLoadingTemplates(true); setCatalogueError('');
    try {
      const response = await listWhatsAppTemplates({ page: 1, pageSize: 100 });
      setTemplates(response.data.data || []);
    } catch (error) { setCatalogueError(apiMessage(error, 'Approved WhatsApp templates could not be loaded.')); }
    finally { setLoadingTemplates(false); }
  };
  useEffect(() => { loadTemplates(); }, []);

  const selectTemplate = async (templateId) => {
    setSelectedId(templateId); setTemplate(null); setValues({}); setFeedback(null); setAttempt(null);
    if (!templateId) return;
    setLoadingTemplate(true);
    try {
      const response = await getWhatsAppTemplate(templateId);
      setTemplate(response.data.data);
    } catch (error) { setFeedback({ color: 'danger', message: apiMessage(error, 'Template details could not be loaded.') }); }
    finally { setLoadingTemplate(false); }
  };

  const send = async (retry = false) => {
    const payload = retry ? attempt.payload : {
      contactId, templateId: template.id, variableValues: fields.map((field) => values[field.key] || ''),
    };
    const key = retry ? attempt.key : createIdempotencyKey();
    if (!retry) setAttempt({ key, payload });
    setSending(true); setFeedback(null);
    try {
      const response = await sendWhatsAppTemplate(payload, key);
      setFeedback({ color: 'success', message: response.data?.message || 'WhatsApp template accepted for sending.' });
      setAttempt(null);
      await onSent?.();
    } catch (error) {
      const uncertain = !error.response || error.response.status >= 500;
      setFeedback({ color: 'danger', uncertain, message: apiMessage(error, uncertain ? 'The send result is uncertain. Retry with the same idempotency key.' : 'The template could not be sent.') });
      if (!uncertain) setAttempt(null);
    } finally { setSending(false); }
  };

  if (!canSend) return null;
  return <CCard className="crm-section"><CCardHeader>Send WhatsApp Template</CCardHeader><CCardBody>
    {!eligible && <CAlert color="warning">{eligibilityReason}</CAlert>}
    {loadingTemplates && <LoadingState label="Loading approved templates…" />}
    {catalogueError && <ErrorState message={catalogueError} onRetry={loadTemplates} />}
    {!loadingTemplates && !catalogueError && <>
      {!templates.length ? <p className="text-muted">No approved active templates are available.</p> : <CRow className="g-3"><CCol md={8}><CFormLabel htmlFor="whatsapp-template">Approved template</CFormLabel><CFormSelect id="whatsapp-template" value={selectedId} disabled={sending || Boolean(attempt)} onChange={(event) => selectTemplate(event.target.value)}><option value="">Select a template</option>{templates.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.language} · {item.category}</option>)}</CFormSelect></CCol></CRow>}
      {loadingTemplate && <LoadingState label="Loading template preview…" />}
      {template && <div className="mt-4"><h3 className="h6">Template preview</h3><TemplatePreview template={template} />
        {fields.length > 0 && <><h3 className="h6 mt-4">Variable values</h3><CRow className="g-3">{fields.map((field) => <CCol md={6} key={field.key}><CFormLabel htmlFor={`variable-${field.key}`}>{field.label}</CFormLabel><CFormInput id={`variable-${field.key}`} required value={values[field.key] || ''} disabled={sending || Boolean(attempt)} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} /></CCol>)}</CRow></>}
        <h3 className="h6 mt-4">Final rendered preview</h3><TemplatePreview template={renderTemplateWithValues(template, fields, values)} />
        {feedback && <CAlert className="mt-3" color={feedback.color}>{feedback.message}</CAlert>}
        <div className="crm-form-actions"><CButton disabled={!eligible || sending || Boolean(attempt) || fields.some((field) => !values[field.key]?.trim())} onClick={() => send(false)}>{sending ? 'Sending…' : 'Send WhatsApp Template'}</CButton>{feedback?.uncertain && attempt && <><CButton variant="outline" disabled={sending} onClick={() => send(true)}>Retry with same key</CButton><CButton color="secondary" variant="outline" disabled={sending} onClick={() => { setAttempt(null); setFeedback(null); }}>Start a new send</CButton></>}</div>
      </div>}
    </>}
  </CCardBody></CCard>;
};

export default WhatsAppTemplateSendPanel;
