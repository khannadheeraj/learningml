import React from 'react';
import { CSidebar, CSidebarNav } from '@coreui/react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { SideBarNav } from './SideBarNav';
import { navigationForRole } from '../SideBar/LeftPanel/index';
import { useAuth } from '../../auth/AuthProvider';
import { getFollowUpReminderSummary } from '../../services/Apis/crm';
import { useEffect, useState } from 'react';

const SideBar = ({ sidebarShow, setSidebarShow }) => {
  const { user } = useAuth();
  const [reminderCount, setReminderCount] = useState(0);
  useEffect(() => {
    let active = true;
    if (!user?.role) return undefined;
    getFollowUpReminderSummary().then((response) => {
      if (active) {
        const counts = response?.data?.data || response?.data || {};
        setReminderCount(Object.values(counts).reduce((total, value) => total + (Number(value) || 0), 0));
      }
    }).catch(() => { if (active) setReminderCount(0); });
    return () => { active = false; };
  }, [user?.role]);
  const allowedNavigation = navigationForRole(user?.role).map((entry) => (
    entry.to === '/follow-up-reminders' && reminderCount > 0
      ? { ...entry, badge: { color: 'danger', text: String(reminderCount) } }
      : entry
  ));
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
