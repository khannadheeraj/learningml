import React from 'react';
import { CSidebar, CSidebarNav } from '@coreui/react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { SideBarNav } from './SideBarNav';
import navigation from '../SideBar/LeftPanel/index';
import { useAuth } from '../../auth/AuthProvider';

const SideBar = ({ sidebarShow, setSidebarShow }) => {
  const { user } = useAuth();
  const allowedNavigation = navigation.filter((item) => !item.roles || item.roles.includes(user?.role));
  return (
    <CSidebar
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => setSidebarShow(visible)}
      className="custom-sidebar"
    >
      <div className="sidebar-brand">
        <div className="brand-avatar">LM</div>
        <div className="brand-content">
          <div className="brand-name">LearningML</div>
          <div className="brand-subtitle">Modern analytics dashboard</div>
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
