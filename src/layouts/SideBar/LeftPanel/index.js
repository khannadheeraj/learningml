import React from 'react';
import { FaAddressBook, FaCalendarCheck, FaExchangeAlt, FaFileImport, FaPlus, FaTachometerAlt, FaUserTie, FaUsers, FaWhatsapp } from 'react-icons/fa';
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
  item('Follow-ups', '/follow-ups', FaCalendarCheck),
  item('Follow-up Reminders', '/follow-up-reminders', FaCalendarCheck),
  item('Counselling Reports', '/counselling-reports', FaCalendarCheck),
  item('WhatsApp Templates', '/whatsapp-templates', FaWhatsapp),
  item('WhatsApp Inbox', '/whatsapp-inbox', FaWhatsapp),
  item('WhatsApp Broadcasts', '/whatsapp-broadcasts', FaWhatsapp, ['SUPER_ADMIN']),
  item('Staff Users', '/staff-users', FaUserTie, ['SUPER_ADMIN']),
];
export const navigationForRole = (role) => menuList.filter((entry) => !entry.roles || entry.roles.includes(role));
export default menuList;
