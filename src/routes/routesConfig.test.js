import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { useAuth } from '../auth/AuthProvider';
import { PasswordChangeRoute, PrivateRoute, PublicRoute } from './routesConfig';

jest.mock('../auth/AuthProvider', () => ({ useAuth: jest.fn() }));

const renderRoute = (element, path = '/private') => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/private" element={element} />
      <Route path="/login" element={<div>Login destination</div>} />
      <Route path="/dashboard" element={<div>Dashboard destination</div>} />
      <Route path="/change-password" element={<div>Password destination</div>} />
    </Routes>
  </MemoryRouter>,
);

test('protected routes reject anonymous users', () => {
  useAuth.mockReturnValue({ isAuthenticated: false, isBootstrapping: false, user: null });
  renderRoute(<PrivateRoute element={<div>Private content</div>} />);
  expect(screen.getByText('Login destination')).toBeInTheDocument();
});

test('protected routes send temporary-password users to password change', () => {
  useAuth.mockReturnValue({ isAuthenticated: true, isBootstrapping: false, user: { mustChangePassword: true } });
  renderRoute(<PrivateRoute element={<div>Private content</div>} />);
  expect(screen.getByText('Password destination')).toBeInTheDocument();
});

test('public login redirects an authenticated user', () => {
  useAuth.mockReturnValue({ isAuthenticated: true, isBootstrapping: false, user: { mustChangePassword: false } });
  renderRoute(<PublicRoute element={<div>Login form</div>} />);
  expect(screen.getByText('Dashboard destination')).toBeInTheDocument();
});

test('password change route requires authentication', () => {
  useAuth.mockReturnValue({ isAuthenticated: false, isBootstrapping: false, user: null });
  renderRoute(<PasswordChangeRoute element={<div>Change form</div>} />);
  expect(screen.getByText('Login destination')).toBeInTheDocument();
});
