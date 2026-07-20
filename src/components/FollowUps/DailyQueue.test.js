import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DailyQueue from './DailyQueue';
import { getFollowUpWorkQueue, getFollowUpWorkQueueSummary } from '../../services/Apis/crm';

jest.mock('../../services/Apis/crm', () => ({ getFollowUpWorkQueue: jest.fn(), getFollowUpWorkQueueSummary: jest.fn() }));

const item = (group = 'OVERDUE') => ({ queueGroup: group, contact: { id: 'contact-1', displayName: 'Asha', normalizedPhone: '919876543210' }, lead: { id: 'lead-1', status: 'INTERESTED', lastActivityAt: '2026-07-19T08:00:00Z' }, task: { id: 'task-1', version: 1, type: 'CALL', priority: 'HIGH', dueAt: '2026-07-18T08:00:00Z', status: 'PENDING', purpose: 'Call back' } });
const response = (data = [item()]) => ({ data: { data, pagination: { page: 1, pageSize: 25, totalRecords: data.length, totalPages: 1, hasNext: false, hasPrevious: false } } });

beforeEach(() => { jest.clearAllMocks(); getFollowUpWorkQueue.mockResolvedValue(response()); getFollowUpWorkQueueSummary.mockResolvedValue({ data: { data: { OVERDUE: 1, DUE_TODAY: 2, UPCOMING: 3, COMPLETED_TODAY: 4, LEADS_WITHOUT_PENDING_FOLLOW_UP: 5 } } }); });
const renderQueue = (props = {}) => render(<MemoryRouter><DailyQueue admin counsellors={[{ id: 'owner-1', displayName: 'Counsellor One' }]} onEdit={jest.fn()} onComplete={jest.fn()} onCancel={jest.fn()} {...props} /></MemoryRouter>);

test('renders summary cards, overdue/high priority indicators and Contact action', async () => {
  renderQueue(); await screen.findByText('Asha');
  expect(screen.getByText('OVERDUE')).toBeInTheDocument(); expect(screen.getByText('3')).toBeInTheDocument(); expect(screen.getByRole('row', { name: /Asha/ })).toHaveClass('table-warning');
  expect(screen.getByText('HIGH')).toHaveClass('text-danger'); expect(screen.getByRole('link', { name: 'Asha' })).toHaveAttribute('href', '/contacts/contact-1');
});

test('switches groups, filters counsellor and reloads pagination', async () => {
  renderQueue(); await screen.findByText('Asha'); fireEvent.click(screen.getByText('DUE TODAY')); expect(getFollowUpWorkQueue).toHaveBeenLastCalledWith(expect.objectContaining({ group: 'DUE_TODAY' }));
  fireEvent.change(screen.getByLabelText('Queue counsellor'), { target: { value: 'owner-1' } }); await waitFor(() => expect(getFollowUpWorkQueue).toHaveBeenLastCalledWith(expect.objectContaining({ assignedCounsellorId: 'owner-1' })));
  expect(screen.getByText('All counsellors')).toBeInTheDocument();
});

test('counsellor mode hides global filter and supports no-follow-up redirect', async () => {
  getFollowUpWorkQueue.mockResolvedValue(response([{ ...item('LEADS_WITHOUT_PENDING_FOLLOW_UP'), task: null }])); renderQueue({ admin: false }); await screen.findByText('Create follow-up'); expect(screen.queryByLabelText('Queue counsellor')).not.toBeInTheDocument(); expect(screen.getByRole('link', { name: 'Create follow-up' })).toHaveAttribute('href', '/contacts/contact-1');
});

test('quick actions invoke edit, Phase 3C completion, and cancel callbacks', async () => {
  const onEdit = jest.fn(); const onComplete = jest.fn(); const onCancel = jest.fn(); renderQueue({ onEdit, onComplete, onCancel }); await screen.findByText('Asha'); fireEvent.click(screen.getByRole('button', { name: 'Edit' })); fireEvent.click(screen.getByRole('button', { name: 'Complete' })); fireEvent.click(screen.getByRole('button', { name: 'Cancel' })); expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 'task-1' })); expect(onComplete).toHaveBeenCalled(); expect(onCancel).toHaveBeenCalled();
});

test('shows loading, empty and controlled API error states', async () => {
  let resolve; getFollowUpWorkQueue.mockReturnValue(new Promise((r) => { resolve = r; })); const view = renderQueue(); expect(screen.getAllByRole('status').length).toBeGreaterThan(0); resolve(response([])); await screen.findByText('No records found'); view.unmount();
  getFollowUpWorkQueue.mockRejectedValueOnce({ response: { data: { error: { message: 'Queue unavailable' } } } }); renderQueue(); expect(await screen.findByText('Queue unavailable')).toBeInTheDocument();
});
