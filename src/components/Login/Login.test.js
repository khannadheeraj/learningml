import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import Login from './index';

jest.mock('../../auth/AuthProvider', () => ({ useAuth: jest.fn() }));

const renderLogin = () => render(
  <MemoryRouter initialEntries={['/login']}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<div>Dashboard reached</div>} />
      <Route path="/change-password" element={<div>Password change reached</div>} />
    </Routes>
  </MemoryRouter>,
);

const completeForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Enter your email address'), { target: { value: 'admin@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Temporary!Pass4827' } });
  fireEvent.click(screen.getByRole('button', { name: 'Login to Dashboard' }));
};

test('successful login navigates to dashboard', async () => {
  const login = jest.fn().mockResolvedValue({ role: 'SUPER_ADMIN', mustChangePassword: false });
  useAuth.mockReturnValue({ login, sessionExpired: false });
  renderLogin();
  completeForm();
  await waitFor(() => expect(screen.getByText('Dashboard reached')).toBeInTheDocument());
  expect(login).toHaveBeenCalledWith('admin@example.com', 'Temporary!Pass4827');
});

test('forced password change login navigates to change screen', async () => {
  useAuth.mockReturnValue({ login: jest.fn().mockResolvedValue({ mustChangePassword: true }), sessionExpired: false });
  renderLogin();
  completeForm();
  await waitFor(() => expect(screen.getByText('Password change reached')).toBeInTheDocument());
});

test('invalid login displays the safe server error', async () => {
  const error = { response: { data: { error: { message: 'Invalid email or password.' } } } };
  useAuth.mockReturnValue({ login: jest.fn().mockRejectedValue(error), sessionExpired: false });
  renderLogin();
  completeForm();
  await waitFor(() => expect(screen.getByText('Invalid email or password.')).toBeInTheDocument());
});
