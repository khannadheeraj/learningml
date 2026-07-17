

import React from 'react'
import { CFooter } from '@coreui/react'

const Footer = () => {
  return (
    <CFooter className="app-footer">
      <div>
        <span className="ms-1">
          &copy; 2026 -{' '}
          <span className="fw-semibold">
            GEO IAS Admission CRM
          </span>
        </span>
      </div>

      <div className="ms-auto"></div>
    </CFooter>
  )
}

export default Footer
