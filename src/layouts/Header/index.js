import React from 'react';
import { CContainer, CHeader, CHeaderBrand, CHeaderToggler } from '@coreui/react';
import ProfileDropdown from '../../components/ProfileDropdown';

const Header = ({ sidebarShow, setSidebarShow }) => <CHeader position="sticky" className="app-header modern-header"><CContainer fluid className="header-wrapper">
  <div className="header-section header-left"><CHeaderToggler className={`sidebar-toggler modern-toggler ${sidebarShow ? 'open' : ''}`} onClick={() => setSidebarShow(!sidebarShow)} aria-label="Toggle navigation"><span className="toggler-line"/><span className="toggler-line"/><span className="toggler-line"/></CHeaderToggler><CHeaderBrand className="logo-text"><div className="brand-icon">GI</div><div className="brand-content"><div className="brand-title">GEO IAS Admission CRM</div><div className="brand-subtitle">Contact and Lead operations</div></div></CHeaderBrand></div>
  <div className="header-section header-right"><div className="header-action profile-section"><ProfileDropdown/></div></div>
</CContainer></CHeader>;
export default Header;
