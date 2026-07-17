import React from 'react';
import { FaTachometerAlt, FaAddressBook } from 'react-icons/fa';
import { CNavItem } from '@coreui/react';

import { FaPaperPlane, FaUsers} from 'react-icons/fa';

const createNavItem = (name, to, IconComponent, roles = ['SUPER_ADMIN', 'COUNSELLOR']) => ({
  component: CNavItem,
  name,
  to,
  icon: <IconComponent className="nav-icon" style={{ color: '#0c4b61' }} />, 
  roles,
});

const menuList = [
  createNavItem('Dashboard', '/dashboard', FaTachometerAlt),

  createNavItem('Upload Contacts', '/upload-contacts', FaUsers, ['SUPER_ADMIN']),

  createNavItem( 'Invitation', '/send-invitation', FaPaperPlane, ['SUPER_ADMIN']),

  createNavItem('Manage Contacts', '/manage-contacts', FaAddressBook, ['SUPER_ADMIN']),

  // createNavItem('Test Invitations', '/test-send-invitation', FaPaperPlane)


  // createNavItem('Logout', '/logout', FaSignOutAlt),
];

export default menuList;
