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
  return <div><span>{auth.isBootstrapping ? 'loading' : auth.user?.email || 'anonymous'}</span><button onClick={auth.logout}>Logout probe</button></div>;
};

test('loads the current user after restoring a refresh session', async () => {
  refreshAccessToken.mockResolvedValue({ accessToken: 'access' });
  apiClient.get.mockResolvedValue({ data: { data: { user: { email: 'admin@example.com' } } } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('admin@example.com')).toBeInTheDocument());
  expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
});

test('failed initial refresh finishes anonymously', async () => {
  refreshAccessToken.mockRejectedValue(new Error('expired'));
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('anonymous')).toBeInTheDocument());
});

test('logout calls the backend and clears the current user', async () => {
  refreshAccessToken.mockResolvedValue({ accessToken: 'access' });
  apiClient.get.mockResolvedValue({ data: { data: { user: { email: 'admin@example.com' } } } });
  apiClient.post.mockResolvedValue({ data: { data: { loggedOut: true } } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('admin@example.com')).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Logout probe' }));
  await waitFor(() => expect(screen.getByText('anonymous')).toBeInTheDocument());
  expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
});
