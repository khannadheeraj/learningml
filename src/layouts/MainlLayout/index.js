import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import "../../scss/main.min.css";
import routes from '../../routes';

const MainlLayout = () => {
  return (
    <CContainer lg className='mw-100'>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes && routes.map((route, idx) => {return (route.element && (<Route key={idx} {...route} /> ))})}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default MainlLayout;
