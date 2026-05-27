import React from 'react'
import { CFooter } from '@coreui/react'

const Footer = () => {
  return (
    <CFooter>
      <div>        
        <span className="ms-1">&copy; 2026 - <a href="javascript:void(0)"  rel="noopener noreferrer"> WhatsApp Campaigns </a></span>
      </div>
      <div className="ms-auto">
        {/* <span className="me-1">Powered by</span>
        <a href="javascript:void(0)" rel="noopener noreferrer">Online Coaching &amp; Dashboard</a> */}
      </div>
    </CFooter>
  )
}

export default Footer;
