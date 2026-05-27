
import { Navigate } from 'react-router-dom';
import { auth_service } from '../auth/auth';

export const PrivateRoute = ({ element }) => {
    if (!auth_service.isAuthenticated()) {
        return <Navigate to="/login" />
    }
    return element;
};

export const PublicRoute = ({ element }) => {
    return element;
};

export const ProtectedRoute = ({ element }) => {
    return element;
};

