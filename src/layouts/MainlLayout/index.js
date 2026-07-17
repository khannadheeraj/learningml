import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import "../../scss/main.min.css";
import { routesForRole } from '../../routes';
import { useAuth } from '../../auth/AuthProvider';

const MainlLayout = () => {
  const { user } = useAuth();
  const allowedRoutes = routesForRole(user?.role);
  return (
    <CContainer lg className='mw-100'>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {allowedRoutes.map(({ roles, ...route }, idx) => route.element && <Route key={idx} {...route} />)}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default MainlLayout;
