import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FollowUpReminders from './index';
import { useAuth } from '../../auth/AuthProvider';
import { dismissFollowUpReminder, getFollowUpReminderSummary, listCounsellorOptions, listFollowUpReminders, snoozeFollowUpReminder } from '../../services/Apis/crm';

jest.mock('../../auth/AuthProvider', () => ({ useAuth: jest.fn() }));
jest.mock('../../services/Apis/crm', () => ({ listFollowUpReminders: jest.fn(), getFollowUpReminderSummary: jest.fn(), listCounsellorOptions: jest.fn(), snoozeFollowUpReminder: jest.fn(), dismissFollowUpReminder: jest.fn() }));
jest.mock('../Crm/common', () => ({ formatDate: () => '19 Jul 2026, 2:13 PM', localDateTimeToUtcIso: (v) => new Date(v).toISOString(), LoadingState: () => <div>Loading…</div>, ErrorState: ({ message, onRetry }) => <div>{message}<button onClick={onRetry}>Retry</button></div> }));

const item = { followUpId: 'f1', category: 'OVERDUE', taskType: 'CALL', priority: 'HIGH', dueAt: '2026-07-19T08:43:00Z', purpose: 'Discuss admission', contact: { id: 'c1', displayName: 'Asha', normalizedPhone: '+919999999999' }, lead: { status: 'INTERESTED' }, assignedCounsellorId: 'u2' };
const list = (rows = [item], pages = 1) => ({ data: { data: { data: rows, pagination: { page: 1, totalPages: pages } } } });
const renderPage = () => render(<MemoryRouter><FollowUpReminders /></MemoryRouter>);
beforeEach(() => { jest.clearAllMocks(); useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' } }); listFollowUpReminders.mockResolvedValue(list()); getFollowUpReminderSummary.mockResolvedValue({ data: { data: { OVERDUE: 1, DUE_NOW: 0, DUE_SOON: 0 } } }); listCounsellorOptions.mockResolvedValue({ data: { data: [{ id: 'u2', displayName: 'Counsellor' }] } }); dismissFollowUpReminder.mockResolvedValue({}); snoozeFollowUpReminder.mockResolvedValue({}); });

test('shows reminder summary, overdue/high priority and admin filter', async () => { renderPage(); expect(await screen.findByText('Asha')).toBeInTheDocument(); expect(screen.getByText(/HIGH/)).toHaveClass('fw-bold'); expect(screen.getByLabelText('Filter by counsellor')).toBeInTheDocument(); expect(screen.getByRole('button', { name: /OVERDUE/ })).toBeInTheDocument(); });
test('category and pagination filters are sent', async () => { listFollowUpReminders.mockResolvedValueOnce(list([item], 2)).mockResolvedValue(list()); renderPage(); await screen.findByText('Asha'); fireEvent.click(screen.getByRole('button', { name: /DUE NOW/ })); await waitFor(() => expect(listFollowUpReminders).toHaveBeenLastCalledWith(expect.objectContaining({ category: 'DUE_NOW', page: 1 }))); });
test('counsellor does not see admin filter', async () => { useAuth.mockReturnValue({ user: { role: 'COUNSELLOR' } }); renderPage(); await screen.findByText('Asha'); expect(screen.queryByLabelText('Filter by counsellor')).not.toBeInTheDocument(); });
test('supports snooze and dismiss actions', async () => { jest.spyOn(window, 'confirm').mockReturnValue(true); renderPage(); await screen.findByText('Asha'); expect(screen.getByRole('button', { name: /^Snooze$/ })).toBeInTheDocument(); fireEvent.click(screen.getByText('Dismiss')); await waitFor(() => expect(dismissFollowUpReminder).toHaveBeenCalledWith('f1')); window.confirm.mockRestore(); });
test('shows loading and controlled errors', async () => { listFollowUpReminders.mockRejectedValueOnce({ response: { data: { detail: 'No access' } } }); renderPage(); expect(await screen.findByText('No access')).toBeInTheDocument(); });
