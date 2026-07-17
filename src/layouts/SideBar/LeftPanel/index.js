import React from 'react';
import { FaAddressBook, FaExchangeAlt, FaFileImport, FaPlus, FaTachometerAlt, FaUserTie, FaUsers } from 'react-icons/fa';
import { CNavItem } from '@coreui/react';

const item = (name, to, Icon, roles = ['SUPER_ADMIN', 'COUNSELLOR']) => ({ component: CNavItem, name, to, icon: <Icon className="nav-icon" style={{ color: '#0c4b61' }}/>, roles });
const menuList = [
  item('Dashboard', '/dashboard', FaTachometerAlt),
  item('All Contacts', '/contacts', FaAddressBook, ['SUPER_ADMIN']),
  item('Add Contact', '/contacts/new', FaPlus),
  item('Import Contacts', '/contacts/import', FaFileImport, ['SUPER_ADMIN']),
  item('All Leads', '/leads', FaUsers, ['SUPER_ADMIN']),
  item('Unassigned Leads', '/leads/unassigned', FaUsers, ['SUPER_ADMIN']),
  item('Needs Contact', '/leads/needs-contact', FaUsers, ['SUPER_ADMIN']),
  item('Interested Leads', '/leads/interested', FaUsers, ['SUPER_ADMIN']),
  item('My Leads', '/my-leads', FaUserTie, ['COUNSELLOR']),
  item('Reassignment Requests', '/reassignment-requests', FaExchangeAlt),
  item('Staff Users', '/staff-users', FaUserTie, ['SUPER_ADMIN']),
];
export const navigationForRole = (role) => menuList.filter((entry) => !entry.roles || entry.roles.includes(role));
export default menuList;
