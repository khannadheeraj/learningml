import React from 'react';
import { FaTachometerAlt } from 'react-icons/fa';
import { CNavItem } from '@coreui/react';

import { FaPaperPlane} from 'react-icons/fa';

const createNavItem = (name, to, IconComponent) => ({
  component: CNavItem,
  name,
  to,
  icon: <IconComponent className="nav-icon" style={{ color: '#0c4b61' }} />, 
});

const menuList = [
  createNavItem('Dashboard', '/dashboard', FaTachometerAlt),

  createNavItem( 'Invitation', '/send-invitation', FaPaperPlane),

  // createNavItem('Logout', '/logout', FaSignOutAlt),
];

export default menuList;
