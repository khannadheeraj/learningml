import React, { useCallback, useEffect, useState } from 'react';
import { CButton, CCard, CCardBody } from '@coreui/react';
import { Link, useParams } from 'react-router-dom';

import { getWhatsAppTemplate } from '../../services/Apis/crm';
import { apiMessage, ErrorState, formatDate, labelFor, LoadingState, StatusBadge } from '../Crm/common';
import '../Crm/crm.css';
import TemplatePreview from './TemplatePreview';


const WhatsAppTemplateDetail = () => {
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      const response = await getWhatsAppTemplate(templateId);
      setTemplate(response.data.data);
    } catch (requestError) {
      setError(apiMessage(requestError, 'The WhatsApp template preview could not be loaded.'));
    }
  }, [templateId]);
  useEffect(() => { load(); }, [load]);

  return <main className="crm-page">
    <div className="crm-page-header"><div><h1>{template?.name || 'WhatsApp Template Preview'}</h1><p>Preview only. Variables are shown exactly as configured and are not replaced.</p></div><CButton component={Link} to="/whatsapp-templates" variant="outline">Back to templates</CButton></div>
    {error && <ErrorState message={error} onRetry={load} />}
    {!template && !error ? <LoadingState label="Loading template preview…" /> : template && <CCard className="crm-section"><CCardBody>
      <dl className="crm-definition-grid">
        <div><dt>Status</dt><dd><StatusBadge value={template.status} /></dd></div>
        <div><dt>Category</dt><dd>{labelFor(template.category)}</dd></div>
        <div><dt>Language</dt><dd>{template.language}</dd></div>
        <div><dt>Last synchronized</dt><dd>{formatDate(template.lastSyncedAt, true)}</dd></div>
      </dl>
      <TemplatePreview template={template} />
    </CCardBody></CCard>}
  </main>;
};

export default WhatsAppTemplateDetail;
