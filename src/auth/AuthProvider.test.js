import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import apiClient, { refreshAccessToken } from '../services/Apis/client';
import { AuthProvider, useAuth } from './AuthProvider';

jest.mock('../services/Apis/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
  clearAccessToken: jest.fn(),
  refreshAccessToken: jest.fn(),
  setAccessToken: jest.fn(),
  setSessionExpiredHandler: jest.fn(),
}));

const Probe = () => {
  const auth = useAuth();
  return <div><span>{auth.isBootstrapping ? 'loading' : auth.user ? `${auth.user.id}|${auth.user.email}|${auth.user.role}|${String(Boolean(auth.user.user))}` : 'anonymous'}</span><button onClick={auth.logout}>Logout probe</button></div>;
};

test('normalizes GET /auth/me to the direct authenticated user shape', async () => {
  refreshAccessToken.mockResolvedValue({ accessToken: 'access' });
  apiClient.get.mockResolvedValue({ data: { data: { user: { id: 'admin-id', displayName: 'Admin', email: 'admin@example.com', role: 'SUPER_ADMIN' } } } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('admin-id|admin@example.com|SUPER_ADMIN|false')).toBeInTheDocument());
  expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
});

test('failed initial refresh finishes anonymously', async () => {
  refreshAccessToken.mockRejectedValue(new Error('expired'));
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('anonymous')).toBeInTheDocument());
});

test('logout calls the backend and clears the current user', async () => {
  refreshAccessToken.mockResolvedValue({ accessToken: 'access' });
  apiClient.get.mockResolvedValue({ data: { data: { user: { id: 'admin-id', email: 'admin@example.com', role: 'SUPER_ADMIN' } } } });
  apiClient.post.mockResolvedValue({ data: { data: { loggedOut: true } } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('admin-id|admin@example.com|SUPER_ADMIN|false')).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Logout probe' }));
  await waitFor(() => expect(screen.getByText('anonymous')).toBeInTheDocument());
  expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
});
