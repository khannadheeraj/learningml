import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import WhatsAppTemplateSendPanel, { renderTemplateWithValues, templateVariableFields } from './WhatsAppTemplateSendPanel';
import * as crm from '../../services/Apis/crm';

jest.mock('../../services/Apis/crm', () => ({
  getWhatsAppTemplate: jest.fn(), listWhatsAppTemplates: jest.fn(), sendWhatsAppTemplate: jest.fn(),
}));

const template = {
  id: 'template-id', name: 'admission_update', language: 'en_US', category: 'UTILITY', status: 'APPROVED',
  headers: [{ type: 'HEADER', format: 'TEXT', text: 'Hello {{1}}' }], body: { type: 'BODY', text: 'Your batch is {{1}}.' }, footer: { type: 'FOOTER', text: 'GEO IAS' },
  buttons: [{ type: 'URL', text: 'Open', url: 'https://example.test/{{1}}' }],
};
const contact = { normalizedPhone: '919876543210', isActive: true };
const preferences = { whatsappAllowed: true, marketingAllowed: true, doNotContact: false };
const admin = { id: 'admin-id', role: 'SUPER_ADMIN' };

beforeEach(() => {
  jest.clearAllMocks();
  crm.listWhatsAppTemplates.mockResolvedValue({ data: { data: [template] } });
  crm.getWhatsAppTemplate.mockResolvedValue({ data: { data: template } });
});

test('orders header, body, and dynamic URL button variables and renders them safely', () => {
  const fields = templateVariableFields(template);
  expect(fields.map((field) => field.label)).toEqual(['Header variable {{1}}', 'Body variable {{1}}', 'Dynamic URL button variable {{1}}']);
  const rendered = renderTemplateWithValues(template, fields, { [fields[0].key]: 'Asha', [fields[1].key]: 'July', [fields[2].key]: 'token' });
  expect(rendered.headers[0].text).toBe('Hello Asha');
  expect(rendered.body.text).toBe('Your batch is July.');
  expect(rendered.buttons[0].url).toBe('https://example.test/token');
});

test('sends once with ordered values and preserves its key for an uncertain retry', async () => {
  const onSent = jest.fn();
  crm.sendWhatsAppTemplate.mockRejectedValueOnce({ request: {} }).mockResolvedValueOnce({ data: { message: 'Accepted' } });
  render(<WhatsAppTemplateSendPanel contactId="contact-id" contact={contact} preferences={preferences} activeLead={null} user={admin} onSent={onSent} />);
  await screen.findByLabelText('Approved template');
  fireEvent.change(screen.getByLabelText('Approved template'), { target: { value: 'template-id' } });
  await screen.findByLabelText('Header variable {{1}}');
  fireEvent.change(screen.getByLabelText('Header variable {{1}}'), { target: { value: 'Asha' } });
  fireEvent.change(screen.getByLabelText('Body variable {{1}}'), { target: { value: 'July' } });
  fireEvent.change(screen.getByLabelText('Dynamic URL button variable {{1}}'), { target: { value: 'token' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send WhatsApp Template' }));
  await screen.findByText(/send result is uncertain/i);
  const [firstPayload, firstKey] = crm.sendWhatsAppTemplate.mock.calls[0];
  expect(firstPayload).toEqual({ contactId: 'contact-id', templateId: 'template-id', variableValues: ['Asha', 'July', 'token'] });
  fireEvent.click(screen.getByRole('button', { name: 'Retry with same key' }));
  await waitFor(() => expect(crm.sendWhatsAppTemplate).toHaveBeenCalledTimes(2));
  expect(crm.sendWhatsAppTemplate.mock.calls[1][1]).toBe(firstKey);
  await waitFor(() => expect(onSent).toHaveBeenCalledTimes(1));
});

test('does not render the action for an unassigned Counsellor and blocks suppressed contacts', async () => {
  const { rerender } = render(<WhatsAppTemplateSendPanel contactId="contact-id" contact={contact} preferences={preferences} activeLead={{ assignedCounsellorId: 'another-user' }} user={{ id: 'counsellor-id', role: 'COUNSELLOR' }} />);
  expect(screen.queryByText('Send WhatsApp Template')).not.toBeInTheDocument();
  rerender(<WhatsAppTemplateSendPanel contactId="contact-id" contact={contact} preferences={{ ...preferences, doNotContact: true }} activeLead={null} user={admin} />);
  expect(await screen.findByText(/suppressed/i)).toBeInTheDocument();
});

test('shows the panel to a Super Admin and applies marketing consent only after a marketing template is selected', async () => {
  const marketingTemplate = { ...template, id: 'marketing-id', category: 'MARKETING' };
  crm.listWhatsAppTemplates.mockResolvedValue({ data: { data: [template, marketingTemplate] } });
  crm.getWhatsAppTemplate.mockImplementation((id) => Promise.resolve({ data: { data: id === 'marketing-id' ? marketingTemplate : template } }));
  render(<WhatsAppTemplateSendPanel contactId="contact-id" contact={contact} preferences={{ ...preferences, marketingAllowed: false }} activeLead={{ assignedCounsellorId: 'other-id' }} user={admin} />);
  expect(await screen.findByText('Send WhatsApp Template')).toBeInTheDocument();
  expect(screen.queryByText(/marketing communication/i)).not.toBeInTheDocument();
  fireEvent.change(await screen.findByLabelText('Approved template'), { target: { value: 'template-id' } });
  await screen.findByLabelText('Header variable {{1}}');
  fireEvent.change(screen.getByLabelText('Header variable {{1}}'), { target: { value: 'Asha' } });
  fireEvent.change(screen.getByLabelText('Body variable {{1}}'), { target: { value: 'July' } });
  fireEvent.change(screen.getByLabelText('Dynamic URL button variable {{1}}'), { target: { value: 'token' } });
  expect(screen.getByRole('button', { name: 'Send WhatsApp Template' })).toBeEnabled();
  fireEvent.change(screen.getByLabelText('Approved template'), { target: { value: 'marketing-id' } });
  expect(await screen.findByText(/has not allowed marketing communication/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Send WhatsApp Template' })).toBeDisabled();
});
