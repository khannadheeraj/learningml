import React from 'react';
import { FaTachometerAlt, FaUniversity, FaSignOutAlt, FaBook } from 'react-icons/fa';
import { CNavItem } from '@coreui/react';

const createNavItem = (name, to, IconComponent) => ({
  component: CNavItem,
  name,
  to,
  icon: <IconComponent className="nav-icon" style={{ color: '#0c4b61' }} />, 
});

const menuList = [
  createNavItem('Dashboard', '/dashboard', FaTachometerAlt),

  // createNavItem('Colleges', '/colleges', FaUniversity),
  // createNavItem('Course', '/course', FaBook),

  createNavItem('Logout', '/logout', FaSignOutAlt),
];

export default menuList;
