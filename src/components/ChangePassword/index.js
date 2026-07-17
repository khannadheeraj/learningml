import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CContainer, CForm, CFormInput, CSpinner } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import apiClient, { getSafeApiMessage } from '../../services/Apis/client';


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { passwordChanged } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword });
      passwordChanged();
      navigate('/login', { replace: true, state: { passwordChanged: true } });
    } catch (requestError) {
      setError(getSafeApiMessage(requestError, 'The password could not be changed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer className="min-vh-100 d-flex align-items-center justify-content-center">
      <CCard className="shadow border-0" style={{ maxWidth: 520, width: '100%' }}>
        <CCardBody className="p-4 p-lg-5">
          <h2>Change temporary password</h2>
          <p className="text-secondary">Choose a strong password before continuing to the CRM.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <CForm onSubmit={submit}>
            <CFormInput className="mb-3" type="password" label="Current password" value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)} required autoComplete="current-password" />
            <CFormInput className="mb-3" type="password" label="New password" value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)} required autoComplete="new-password" />
            <CFormInput className="mb-4" type="password" label="Confirm new password" value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)} required autoComplete="new-password" />
            <CButton type="submit" color="primary" className="w-100" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Change password'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default ChangePassword;
