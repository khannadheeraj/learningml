import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CompletionForm from './CompletionForm';
import { getFollowUpCompletionRecommendation } from '../../services/Apis/crm';

jest.mock('../../services/Apis/crm', () => ({ getFollowUpCompletionRecommendation: jest.fn() }));
const task = { id: 'task-1', version: 3 };
const recommendation = (data = { currentLeadStatus: 'NEW', recommendedLeadStatus: 'INTERESTED', protectedCurrentStatus: false }) => getFollowUpCompletionRecommendation.mockResolvedValue({ data: { data } });
const chooseOutcome = async (outcome = 'CONNECTED_INTERESTED') => { fireEvent.change(screen.getByLabelText('Outcome'), { target: { value: outcome } }); await waitFor(() => expect(getFollowUpCompletionRecommendation).toHaveBeenCalledWith('task-1', outcome)); await screen.findByLabelText('Keep current status'); };
beforeEach(() => { jest.clearAllMocks(); recommendation(); });

test('loads the recommendation by selected outcome and requires a connected summary', async () => {
  render(<CompletionForm task={task} onSubmit={jest.fn()} saving={false} />); await chooseOutcome();
  expect(await screen.findByText(/Current status:/)).toHaveTextContent('NEW'); expect(screen.getByText(/Recommended status:/)).toHaveTextContent('INTERESTED'); expect(screen.getByText(/No Lead status changes/)).toBeInTheDocument();
});

test('accepting a recommendation sends an explicit decision without a manual status', async () => {
  const onSubmit = jest.fn(); render(<CompletionForm task={task} onSubmit={onSubmit} saving={false} />); await chooseOutcome();
  fireEvent.change(screen.getByLabelText('Discussion summary'), { target: { value: 'Interested in admission.' } }); fireEvent.submit(screen.getByRole('form'));
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ version: 3, outcome: 'CONNECTED_INTERESTED', leadStatusDecision: 'RECOMMENDATION_ACCEPTED' })); expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('leadStatus');
});

test('manual override requires a controlled Lead status and keeps current omits it', async () => {
  const onSubmit = jest.fn(); render(<CompletionForm task={task} onSubmit={onSubmit} saving={false} />); await chooseOutcome('NO_ANSWER');
  fireEvent.click(screen.getByLabelText('Choose another permitted status')); fireEvent.submit(screen.getByRole('form')); expect(screen.getByText(/Choose a permitted Lead status/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Lead status'), { target: { value: 'FOLLOW_UP_REQUIRED' } }); fireEvent.submit(screen.getByRole('form')); expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({ leadStatusDecision: 'MANUAL_OVERRIDE', leadStatus: 'FOLLOW_UP_REQUIRED' }));
  fireEvent.click(screen.getByLabelText('Keep current status')); fireEvent.submit(screen.getByRole('form')); expect(onSubmit.mock.calls[1][0]).toEqual(expect.objectContaining({ leadStatusDecision: 'KEPT_CURRENT' })); expect(onSubmit.mock.calls[1][0]).not.toHaveProperty('leadStatus');
});

test('no recommendation defaults to keep-current and protected state is clear', async () => {
  recommendation({ currentLeadStatus: 'ADMITTED', recommendedLeadStatus: null, protectedCurrentStatus: true }); render(<CompletionForm task={task} onSubmit={jest.fn()} saving={false} />); await chooseOutcome('GENERAL_COMPLETED');
  expect(await screen.findByText(/protected from recommendation-driven downgrade/)).toBeInTheDocument(); expect(screen.getByLabelText('Keep current status')).toBeChecked(); expect(screen.getByLabelText('Accept recommendation')).toBeDisabled();
});

test('shows recommendation and completion/version errors safely', async () => {
  getFollowUpCompletionRecommendation.mockRejectedValueOnce({ response: { data: { detail: 'Recommendation unavailable' } } }); const { rerender } = render(<CompletionForm task={task} onSubmit={jest.fn()} saving={false} />); await chooseOutcome('BUSY'); expect(await screen.findByText('Recommendation unavailable')).toBeInTheDocument();
  rerender(<CompletionForm task={task} onSubmit={jest.fn()} saving={true} error="The follow-up changed elsewhere. Refresh and try again." />); expect(screen.getByText(/changed elsewhere/)).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
});
