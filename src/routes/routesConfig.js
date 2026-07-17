import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CSpinner } from '@coreui/react';

import { useAuth } from '../auth/AuthProvider';


const Loading = () => <div className="text-center p-5"><CSpinner /></div>;

export const PrivateRoute = ({ element }) => {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();
  if (isBootstrapping) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.mustChangePassword) return <Navigate to="/change-password" replace />;
  return element;
};

export const PublicRoute = ({ element }) => {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  if (isBootstrapping) return <Loading />;
  if (isAuthenticated) return <Navigate to={user?.mustChangePassword ? '/change-password' : '/dashboard'} replace />;
  return element;
};

export const PasswordChangeRoute = ({ element }) => {
  const { isAuthenticated, isBootstrapping } = useAuth();
  if (isBootstrapping) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return element;
};
