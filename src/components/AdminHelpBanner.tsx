import React from 'react';

interface AdminHelpBannerProps {
  title: string;
  description: React.ReactNode;
}

export const AdminHelpBanner: React.FC<AdminHelpBannerProps> = ({ title, description }) => (
  <div style={{
    margin: '12px 16px 16px 16px',
    padding: '12px 16px',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: '10px',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  }}>
    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>💡</span>
    <div>
      <strong style={{ display: 'block', fontSize: '0.875rem', color: '#818cf8', marginBottom: '2px', fontWeight: 600 }}>
        {title}
      </strong>
      <div style={{ fontSize: '0.8125rem', lineHeight: 1.45, color: '#94a3b8' }}>
        {description}
      </div>
    </div>
  </div>
);

export const AdminHelpAside: React.FC<AdminHelpBannerProps> = ({ title, description }) => (
  <div style={{ width: 280, margin: '1em', padding: '1em', backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.25)' }}>
    <h4 style={{ margin: '0 0 0.5em 0', fontSize: '0.9rem', color: '#818cf8', fontWeight: 600 }}>
      💡 {title}
    </h4>
    <div style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.45, color: '#94a3b8' }}>
      {description}
    </div>
  </div>
);
