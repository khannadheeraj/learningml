import React from 'react';
import { CSidebar, CSidebarNav } from '@coreui/react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { SideBarNav } from './SideBarNav';
import navigation from '../SideBar/LeftPanel/index';

const SideBar = ({ sidebarShow, setSidebarShow }) => {
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
          <SideBarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default SideBar;
