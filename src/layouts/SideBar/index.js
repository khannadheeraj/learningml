import React from 'react';
import { CSidebar, CSidebarNav } from '@coreui/react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { SideBarNav } from './SideBarNav';
import { navigationForRole } from '../SideBar/LeftPanel/index';
import { useAuth } from '../../auth/AuthProvider';

const SideBar = ({ sidebarShow, setSidebarShow }) => {
  const { user } = useAuth();
  const allowedNavigation = navigationForRole(user?.role);
  return (
    <CSidebar
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => setSidebarShow(visible)}
      className="custom-sidebar"
    >
      <div className="sidebar-brand">
        <div className="brand-avatar">GI</div>
        <div className="brand-content">
          <div className="brand-name">GEO IAS</div>
          <div className="brand-subtitle">Admission CRM</div>
        </div>
      </div>
      <CSidebarNav>
        <SimpleBar>
          <SideBarNav items={allowedNavigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default SideBar;
