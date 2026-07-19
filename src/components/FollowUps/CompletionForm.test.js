import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CompletionForm from './CompletionForm';

const task = { id: 'task-1', version: 3 };

test('completion form opens with outcome and controlled Lead status options', () => {
  render(<CompletionForm task={task} onSubmit={jest.fn()} saving={false} />);
  expect(screen.getByLabelText('Outcome')).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Do not change Lead status' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'INTERESTED' })).toBeInTheDocument();
});

test('connected outcome requires discussion summary while non-connected outcome does not', () => {
  const onSubmit = jest.fn(); render(<CompletionForm task={task} onSubmit={onSubmit} saving={false} />);
  fireEvent.change(screen.getByLabelText('Outcome'), { target: { value: 'CONNECTED_INTERESTED' } });
  fireEvent.submit(screen.getByRole('form')); expect(onSubmit).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('Discussion summary'), { target: { value: 'Discussed course.' } });
  fireEvent.submit(screen.getByRole('form')); expect(onSubmit).toHaveBeenCalled();
  onSubmit.mockClear(); fireEvent.change(screen.getByLabelText('Outcome'), { target: { value: 'NO_ANSWER' } }); fireEvent.submit(screen.getByRole('form')); expect(onSubmit).toHaveBeenCalled();
});

test('selected status, next follow-up and optional fields are submitted safely', () => {
  const onSubmit = jest.fn(); render(<CompletionForm task={task} onSubmit={onSubmit} saving={false} />);
  fireEvent.change(screen.getByLabelText('Outcome'), { target: { value: 'CALLBACK_REQUESTED' } }); fireEvent.change(screen.getByLabelText('Lead status update (optional)'), { target: { value: 'FOLLOW_UP_REQUIRED' } }); fireEvent.change(screen.getByLabelText('Next follow-up (optional)'), { target: { value: '2030-01-01T12:30' } }); fireEvent.change(screen.getByLabelText('Next action'), { target: { value: 'Call again' } }); fireEvent.submit(screen.getByRole('form'));
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ version: 3, leadStatus: 'FOLLOW_UP_REQUIRED', nextAction: 'Call again', nextFollowUpAt: expect.stringMatching(/Z$/) }));
});

test('no status change omits leadStatus and API/version errors are shown', () => {
  const onSubmit = jest.fn(); const { rerender } = render(<CompletionForm task={task} onSubmit={onSubmit} saving={false} error="The follow-up changed elsewhere. Refresh and try again." />);
  fireEvent.change(screen.getByLabelText('Outcome'), { target: { value: 'GENERAL_COMPLETED' } }); fireEvent.submit(screen.getByRole('form'));
  expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('leadStatus'); expect(screen.getByText(/changed elsewhere/)).toBeInTheDocument();
  rerender(<CompletionForm task={task} onSubmit={onSubmit} saving={true} />); expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
});
