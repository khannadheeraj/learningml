import React, { useState } from 'react';
import { CButton, CFormInput, CFormLabel, CFormSelect, CFormTextarea } from '@coreui/react';
import { LEAD_STATUSES, localDateTimeToUtcIso } from '../Crm/common';

export const COMPLETION_OUTCOMES = ['CONNECTED_INTERESTED', 'CONNECTED_NOT_INTERESTED', 'CALLBACK_REQUESTED', 'NO_ANSWER', 'BUSY', 'WRONG_NUMBER', 'GENERAL_COMPLETED'];

const CompletionForm = ({ task, saving, error, onSubmit }) => {
  const [form, setForm] = useState({ outcome: '', discussionSummary: '', studentQuestionsOrObjections: '', nextAction: '', nextFollowUpAt: '', leadStatus: '' });
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (['CONNECTED_INTERESTED', 'CONNECTED_NOT_INTERESTED'].includes(form.outcome) && !form.discussionSummary.trim()) return;
    onSubmit({ version: task.version, outcome: form.outcome, discussionSummary: form.discussionSummary.trim() || undefined, studentQuestionsOrObjections: form.studentQuestionsOrObjections.trim() || undefined, nextAction: form.nextAction.trim() || undefined, nextFollowUpAt: form.nextFollowUpAt ? localDateTimeToUtcIso(form.nextFollowUpAt) : undefined, ...(form.leadStatus ? { leadStatus: form.leadStatus } : {}) });
  };
  const connected = ['CONNECTED_INTERESTED', 'CONNECTED_NOT_INTERESTED'].includes(form.outcome);
  return <form aria-label="Complete follow-up form" onSubmit={submit}><CFormLabel htmlFor="completion-outcome">Outcome</CFormLabel><CFormSelect id="completion-outcome" required value={form.outcome} onChange={(event) => change('outcome', event.target.value)}><option value="">Select outcome</option>{COMPLETION_OUTCOMES.map((value) => <option key={value}>{value}</option>)}</CFormSelect>{connected && <><CFormLabel className="mt-2" htmlFor="discussion-summary">Discussion summary</CFormLabel><CFormTextarea id="discussion-summary" required value={form.discussionSummary} onChange={(event) => change('discussionSummary', event.target.value)} /></>}<CFormLabel className="mt-2" htmlFor="student-objections">Student questions or objections</CFormLabel><CFormTextarea id="student-objections" value={form.studentQuestionsOrObjections} onChange={(event) => change('studentQuestionsOrObjections', event.target.value)} /><CFormLabel className="mt-2" htmlFor="next-action">Next action</CFormLabel><CFormInput id="next-action" value={form.nextAction} onChange={(event) => change('nextAction', event.target.value)} /><CFormLabel className="mt-2" htmlFor="next-follow-up">Next follow-up (optional)</CFormLabel><CFormInput id="next-follow-up" type="datetime-local" value={form.nextFollowUpAt} onChange={(event) => change('nextFollowUpAt', event.target.value)} /><CFormLabel className="mt-2" htmlFor="lead-status">Lead status update (optional)</CFormLabel><CFormSelect id="lead-status" value={form.leadStatus} onChange={(event) => change('leadStatus', event.target.value)}><option value="">Do not change Lead status</option>{LEAD_STATUSES.map((value) => <option key={value}>{value}</option>)}</CFormSelect>{error && <div className="crm-field-error mt-2">{error}</div>}<div className="crm-form-actions"><CButton type="submit" disabled={saving}>{saving ? 'Saving…' : 'Complete follow-up'}</CButton></div></form>;
};
export default CompletionForm;
