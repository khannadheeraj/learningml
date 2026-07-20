import React, { useEffect, useState } from 'react';
import { CButton, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormTextarea } from '@coreui/react';
import { LEAD_STATUSES, localDateTimeToUtcIso } from '../Crm/common';
import { getFollowUpCompletionRecommendation } from '../../services/Apis/crm';

export const COMPLETION_OUTCOMES = ['CONNECTED_INTERESTED', 'CONNECTED_NOT_INTERESTED', 'CALLBACK_REQUESTED', 'NO_ANSWER', 'BUSY', 'WRONG_NUMBER', 'GENERAL_COMPLETED'];
const decisions = ['RECOMMENDATION_ACCEPTED', 'MANUAL_OVERRIDE', 'KEPT_CURRENT'];
const labels = { RECOMMENDATION_ACCEPTED: 'Accept recommendation', MANUAL_OVERRIDE: 'Choose another permitted status', KEPT_CURRENT: 'Keep current status' };
const errorText = (error) => error?.response?.data?.error?.message || error?.response?.data?.detail || 'The Lead-status recommendation could not be loaded.';

const CompletionForm = ({ task, saving, error, onSubmit }) => {
  const [form, setForm] = useState({ outcome: '', discussionSummary: '', studentQuestionsOrObjections: '', nextAction: '', nextFollowUpAt: '', leadStatus: '', leadStatusDecision: 'KEPT_CURRENT' });
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState('');
  const [validationError, setValidationError] = useState('');
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const connected = ['CONNECTED_INTERESTED', 'CONNECTED_NOT_INTERESTED'].includes(form.outcome);

  useEffect(() => {
    let active = true;
    if (!form.outcome) { setRecommendation(null); setRecommendationError(''); return undefined; }
    setRecommendationLoading(true); setRecommendationError('');
    getFollowUpCompletionRecommendation(task.id, form.outcome).then((response) => {
      if (!active) return;
      const data = response?.data?.data || response?.data;
      setRecommendation(data);
      setForm((current) => ({ ...current, leadStatusDecision: data?.recommendedLeadStatus ? 'RECOMMENDATION_ACCEPTED' : 'KEPT_CURRENT', leadStatus: '' }));
    }).catch((requestError) => { if (active) { setRecommendation(null); setRecommendationError(errorText(requestError)); setForm((current) => ({ ...current, leadStatusDecision: 'KEPT_CURRENT', leadStatus: '' })); } }).finally(() => { if (active) setRecommendationLoading(false); });
    return () => { active = false; };
  }, [form.outcome, task.id]);

  const submit = (event) => {
    event.preventDefault(); setValidationError('');
    if (connected && !form.discussionSummary.trim()) { setValidationError('A discussion summary is required for connected outcomes.'); return; }
    if (form.leadStatusDecision === 'MANUAL_OVERRIDE' && !form.leadStatus) { setValidationError('Choose a permitted Lead status for the manual override.'); return; }
    if (form.leadStatusDecision === 'RECOMMENDATION_ACCEPTED' && !recommendation?.recommendedLeadStatus) { setValidationError('No recommendation is available. Keep the current status or choose a permitted manual override.'); return; }
    onSubmit({ version: task.version, outcome: form.outcome, discussionSummary: form.discussionSummary.trim() || undefined, studentQuestionsOrObjections: form.studentQuestionsOrObjections.trim() || undefined, nextAction: form.nextAction.trim() || undefined, nextFollowUpAt: form.nextFollowUpAt ? localDateTimeToUtcIso(form.nextFollowUpAt) : undefined, leadStatusDecision: form.leadStatusDecision, ...(form.leadStatusDecision === 'MANUAL_OVERRIDE' ? { leadStatus: form.leadStatus } : {}) });
  };
  return <form aria-label="Complete follow-up form" onSubmit={submit}>
    <CFormLabel htmlFor="completion-outcome">Outcome</CFormLabel><CFormSelect id="completion-outcome" required value={form.outcome} onChange={(event) => change('outcome', event.target.value)}><option value="">Select outcome</option>{COMPLETION_OUTCOMES.map((value) => <option key={value}>{value}</option>)}</CFormSelect>
    {form.outcome && <section className="border rounded p-2 mt-3" aria-label="Lead status decision"><strong>Lead status recommendation</strong>{recommendationLoading ? <p className="mb-0">Loading recommendation…</p> : <>{recommendationError && <div className="crm-field-error mt-1">{recommendationError}</div>}<p className="mb-1">Current status: <strong>{recommendation?.currentLeadStatus || task.leadStatus || 'Unavailable'}</strong></p><p className="mb-1">Recommended status: <strong>{recommendation?.recommendedLeadStatus || 'No recommendation'}</strong></p><p className="small text-muted mb-2">No Lead status changes without your confirmation.</p>{recommendation?.protectedCurrentStatus && <p className="small text-warning">This advanced or terminal Lead status is protected from recommendation-driven downgrade.</p>}{decisions.map((value) => <CFormCheck key={value} type="radio" name="lead-status-decision" id={`decision-${value}`} label={labels[value]} value={value} disabled={value === 'RECOMMENDATION_ACCEPTED' && !recommendation?.recommendedLeadStatus} checked={form.leadStatusDecision === value} onChange={(event) => change('leadStatusDecision', event.target.value)} />)}{form.leadStatusDecision === 'MANUAL_OVERRIDE' && <><CFormLabel className="mt-2" htmlFor="lead-status">Lead status</CFormLabel><CFormSelect id="lead-status" required value={form.leadStatus} onChange={(event) => change('leadStatus', event.target.value)}><option value="">Select permitted Lead status</option>{LEAD_STATUSES.map((value) => <option key={value}>{value}</option>)}</CFormSelect></>}</>}</section>}
    {connected && <><CFormLabel className="mt-2" htmlFor="discussion-summary">Discussion summary</CFormLabel><CFormTextarea id="discussion-summary" required value={form.discussionSummary} onChange={(event) => change('discussionSummary', event.target.value)} /></>}
    <CFormLabel className="mt-2" htmlFor="student-objections">Student questions or objections</CFormLabel><CFormTextarea id="student-objections" value={form.studentQuestionsOrObjections} onChange={(event) => change('studentQuestionsOrObjections', event.target.value)} />
    <CFormLabel className="mt-2" htmlFor="next-action">Next action</CFormLabel><CFormInput id="next-action" value={form.nextAction} onChange={(event) => change('nextAction', event.target.value)} />
    <CFormLabel className="mt-2" htmlFor="next-follow-up">Next follow-up (optional)</CFormLabel><CFormInput id="next-follow-up" type="datetime-local" value={form.nextFollowUpAt} onChange={(event) => change('nextFollowUpAt', event.target.value)} />
    {(validationError || error) && <div className="crm-field-error mt-2">{validationError || error}</div>}<div className="crm-form-actions"><CButton type="submit" disabled={saving || recommendationLoading}>{saving ? 'Saving…' : 'Complete follow-up'}</CButton></div>
  </form>;
};
export default CompletionForm;
