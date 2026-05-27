


import React from 'react';
import { CHeader, CContainer, CHeaderBrand, CHeaderToggler } from '@coreui/react';
import { cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import SearchBar from '../../components/SearchBar';
import Notification from '../../components/Notification';
import ProfileDropdown from '../../components/ProfileDropdown';

const Header = ({ sidebarShow, setSidebarShow }) => {


  return (
    <CHeader position="sticky" className="app-header shadow-sm px-3">
      <CContainer fluid className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <CHeaderToggler style={{ color: "white" }} className="sidebar-toggler" onClick={() => setSidebarShow(!sidebarShow)} >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="logo-text">
            <h5 className="mb-0" style={{ color: "white" }}>WhatsApp Campaign</h5>
          </CHeaderBrand>
        </div>
        <SearchBar />
        <div className="d-flex align-items-center gap-4">
          <Notification />
          <ProfileDropdown />
        </div>
      </CContainer>
    </CHeader>
  );
};

export default Header;
