import React from 'react';

interface SentEmail {
  email: string;
  success: boolean;
  message: string;
}

interface SentEmailsProps {
  sentEmails: SentEmail[];
  showSentEmails: boolean;
}

const SentEmails: React.FC<SentEmailsProps> = ({ sentEmails, showSentEmails }) => {
  if (!showSentEmails || sentEmails.length === 0) return null;

  return (
    <div id="sentEmails" style={{ display: 'block' }}>
      <h3>Campaign Results</h3>
      <div id="sentEmailsList">
        {sentEmails.map((result, index) => (
          <div 
            key={index} 
            className="sent-email" 
            style={!result.success ? { borderLeftColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
          >
            <strong>{result.success ? '✓' : '✗'} {result.email}</strong>: {result.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentEmails;
export type { SentEmail }; 