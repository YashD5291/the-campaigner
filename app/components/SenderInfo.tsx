import React from 'react';

interface SenderInfoProps {
  senderEmail: string;
  setSenderEmail: (email: string) => void;
  senderPassword: string;
  setSenderPassword: (password: string) => void;
  senderName: string;
  setSenderName: (name: string) => void;
}

const SenderInfo: React.FC<SenderInfoProps> = ({
  senderEmail,
  setSenderEmail,
  senderPassword,
  setSenderPassword,
  senderName,
  setSenderName
}) => {
  return (
    <fieldset className="sender-section">
      <legend>Campaign Sender Profile</legend>
      <div className="grid-container">
        <div className="form-group">
          <label htmlFor="senderEmail">Sender Email Address:</label>
          <input
            type="email"
            id="senderEmail"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            required
            disabled
          />
          <div className="info-text">
            Will be used as the "From" address for your campaign
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="senderPassword">Email App Password:</label>
          <input
            type="password"
            id="senderPassword"
            value={senderPassword}
            onChange={(e) => setSenderPassword(e.target.value)}
            required
            disabled
          />
          <div className="info-text">
            Used to authenticate with your email provider
          </div>
        </div>
        <div className="form-group full-width">
          <label htmlFor="senderName">Sender Name:</label>
          <input
            type="text"
            id="senderName"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
            disabled
          />
          <div className="info-text">
            Will appear as the sender name in recipients' inboxes
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default SenderInfo; 