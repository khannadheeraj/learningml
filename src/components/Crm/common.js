import React from 'react';
import { CAlert, CBadge, CButton, CSpinner } from '@coreui/react';

export const LEAD_STATUSES = [
  'NEW', 'NEEDS_CONTACT', 'CONTACT_ATTEMPTED', 'CONNECTED', 'INTERESTED',
  'FOLLOW_UP_REQUIRED', 'DEMO_REGISTERED', 'DEMO_ATTENDED',
  'ADMISSION_IN_PROGRESS', 'NOT_INTERESTED', 'UNRESPONSIVE',
  'INVALID_CONTACT', 'DO_NOT_CONTACT', 'LOST',
];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
export const MODES = ['ONLINE', 'OFFLINE', 'HYBRID'];
export const SOURCES = [
  'MANUAL_ENTRY', 'COUNSELLOR_MANUAL_ENTRY', 'EXCEL_IMPORT', 'CSV_IMPORT',
  'WEBSITE', 'META_LEAD_FORM', 'DEMO_CLASS', 'SCHOLARSHIP_TEST', 'SEMINAR',
  'WALK_IN', 'REFERRAL', 'EXISTING_DATABASE', 'WHATSAPP_INBOUND', 'OTHER',
];

export const labelFor = (value) => value
  ? String(value).toLowerCase().split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  : '—';

export const parseApiDateTime = (value) => {
  if (!value || typeof value !== 'string') return value ? new Date(value) : null;
  const normalized = /^\d{4}-\d{2}-\d{2}T/.test(value) && !/(Z|[+-]\d{2}:?\d{2})$/i.test(value) ? `${value}Z` : value;
  return new Date(normalized);
};

export const formatDate = (value, withTime = false) => {
  if (!value) return '—';
  const parsed = parseApiDateTime(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' }).format(parsed);
};

export const toLocalDateTimeInput = (value) => {
  const date = parseApiDateTime(value);
  if (!date || Number.isNaN(date.getTime())) return '';
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const localDateTimeToUtcIso = (value) => {
  if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const badgeColor = (value) => ({
  URGENT: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'secondary',
  INTERESTED: 'success', ADMITTED: 'success', DO_NOT_CONTACT: 'dark',
  LOST: 'secondary', INVALID_CONTACT: 'danger', PENDING: 'warning',
  APPROVED: 'success', REJECTED: 'danger', CANCELLED: 'secondary',
  VALID: 'success', IMPORTED: 'success', UPDATED: 'info', REJECTED_ROW: 'danger',
}[value] || 'primary');

export const StatusBadge = ({ value }) => value
  ? <CBadge color={badgeColor(value)}>{labelFor(value)}</CBadge>
  : <span className="text-muted">—</span>;

export const LoadingState = ({ label = 'Loading…' }) => (
  <div className="crm-state" role="status"><CSpinner size="sm" /><span>{label}</span></div>
);

export const ErrorState = ({ message, onRetry }) => (
  <CAlert color="danger" className="d-flex justify-content-between align-items-center">
    <span>{message}</span>{onRetry && <CButton color="danger" variant="outline" size="sm" onClick={onRetry}>Retry</CButton>}
  </CAlert>
);

export const EmptyState = ({ title = 'No records found', detail = 'Try changing the filters or add a new record.' }) => (
  <div className="crm-empty"><h3>{title}</h3><p>{detail}</p></div>
);

export const PaginationControls = ({ pagination, onPage }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="crm-pagination" aria-label="Pagination">
      <CButton size="sm" variant="outline" disabled={!pagination.hasPrevious} onClick={() => onPage(pagination.page - 1)}>Previous</CButton>
      <span>Page {pagination.page} of {pagination.totalPages}</span>
      <CButton size="sm" variant="outline" disabled={!pagination.hasNext} onClick={() => onPage(pagination.page + 1)}>Next</CButton>
    </div>
  );
};

export const apiFieldErrors = (error) => error?.response?.data?.error?.fieldErrors || {};
export const apiMessage = (error, fallback = 'The request could not be completed.') => error?.response?.data?.error?.message || fallback;
