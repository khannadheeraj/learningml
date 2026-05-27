

import React from 'react'
import { CFooter } from '@coreui/react'

const Footer = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">
          &copy; 2026 -{' '}
          <span className="fw-semibold">
            WhatsApp Campaigns
          </span>
        </span>
      </div>

      <div className="ms-auto"></div>
    </CFooter>
  )
}

export default Footer
