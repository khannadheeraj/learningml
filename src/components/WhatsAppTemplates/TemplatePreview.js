import React from 'react';


const variablePattern = /({{\s*\d+\s*}})/g;
const isVariable = /^{{\s*\d+\s*}}$/;

export const TemplateText = ({ value }) => {
  if (!value) return <span className="text-muted">Not provided</span>;
  return String(value).split(variablePattern).map((part, index) => (
    isVariable.test(part)
      ? <mark className="template-variable" key={`${part}-${index}`}>{part}</mark>
      : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  ));
};

const Header = ({ headers }) => {
  if (!headers?.length) return null;
  return headers.map((header, index) => (
    <section className="template-preview-section" key={`${header.format || 'header'}-${index}`}>
      <span className="template-preview-label">Header{header.format ? ` · ${header.format}` : ''}</span>
      {header.text ? <TemplateText value={header.text} /> : <span className="text-muted">{header.format || 'Header'} preview</span>}
    </section>
  ));
};

const TemplatePreview = ({ template }) => (
  <div className="template-preview" aria-label="Template preview">
    <Header headers={template.headers} />
    <section className="template-preview-section template-preview-body">
      <span className="template-preview-label">Body</span>
      <TemplateText value={template.body?.text} />
    </section>
    {template.footer?.text && <section className="template-preview-section">
      <span className="template-preview-label">Footer</span>
      <TemplateText value={template.footer.text} />
    </section>}
    {!!template.buttons?.length && <section className="template-preview-section">
      <span className="template-preview-label">Buttons</span>
      <div className="template-buttons">
        {template.buttons.map((button, index) => <span className="template-button" key={`${button.type || 'button'}-${index}`}>
          <TemplateText value={button.text || button.url || button.type} />
        </span>)}
      </div>
    </section>}
  </div>
);

export default TemplatePreview;
