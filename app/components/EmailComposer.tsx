import React, { useRef, useState, useEffect } from 'react';
import type { CsvRow } from './CsvUpload';
import dynamic from 'next/dynamic';

// Dynamic import for Tiptap editor to ensure client-side only rendering
const TiptapEditor = dynamic(
  () => import('./TiptapEditor'),
  { ssr: false }
);

interface EmailComposerProps {
  subject: string;
  setSubject: (subject: string) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  selectedContacts: CsvRow[];
  senderName: string;
  emailBody: string;
  setEmailBody: (body: string) => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  subject,
  setSubject,
  resumeFile,
  setResumeFile,
  fileName,
  setFileName,
  selectedContacts,
  senderName,
  emailBody,
  setEmailBody
}) => {
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const [editorMounted, setEditorMounted] = useState(false);

  // Set editor as mounted after component mounts
  useEffect(() => {
    setEditorMounted(true);
    return () => setEditorMounted(false);
  }, []);

  // Handle resume file selection
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  // Create email preview
  const createEmailPreview = () => {
    const recruiterName = selectedContacts.length > 0
      ? (selectedContacts[0].firstName || (selectedContacts[0].fullName ? selectedContacts[0].fullName.split(' ')[0] : 'Recruiter'))
      : '[Recruiter Name]';

    // List email recipients
    let emailsText = '';
    if (selectedContacts.length > 0) {
      if (selectedContacts.length <= 3) {
        emailsText = 'Recipients: ' + selectedContacts.map(contact => contact.email).join(', ') + '\n\n';
      } else {
        emailsText = `Recipients: ${selectedContacts[0].email}, ${selectedContacts[1].email}, ${selectedContacts[2].email}, and ${selectedContacts.length - 3} more...\n\n`;
      }
    } else {
      emailsText = 'No recipients selected\n\n';
    }

    return `From: ${senderName}\nSubject: ${subject || '[Subject]'}\n\n${emailsText}`;
  };

  return (
    <>
      {selectedContacts.length > 0 && (
        <div id="selectedContactsSummary" className="summary-box">
          <h3>Campaign Recipients <span id="contactCount" className="badge">{selectedContacts.length}</span></h3>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="subject">Campaign Subject Line:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder="Enter a compelling subject line for your campaign"
        />
      </div>

      <div className="form-group">
        <label htmlFor="resume">Attachment (PDF only):</label>
        <div className="resume-container">
          <input
            type="file"
            id="resume"
            ref={resumeFileInputRef}
            accept=".pdf"
            onChange={handleResumeFileChange}
            required
          />
          {fileName && <span id="resumeFileName">Selected: {fileName}</span>}
        </div>
        <div className="info-text">Attach your resume or portfolio to be included in every campaign email</div>
      </div>

      <div className="form-group">
        <label htmlFor="emailBody">Email Body:</label>
        <div className="editor-container">
          <TiptapEditor
            value={emailBody}
            onChange={setEmailBody}
          />
        </div>
      </div>
    </>
  );
};

export default EmailComposer; 