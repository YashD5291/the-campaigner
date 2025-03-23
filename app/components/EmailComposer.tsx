import React, { useRef } from 'react';
import type { CsvRow } from './CsvUpload';

interface EmailComposerProps {
  subject: string;
  setSubject: (subject: string) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  selectedContacts: CsvRow[];
  senderName: string;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  subject,
  setSubject,
  resumeFile,
  setResumeFile,
  fileName,
  setFileName,
  selectedContacts,
  senderName
}) => {
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

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
    
    // Default email body template
    const emailBody = `Hello there, I'm Juan Flores, a results-driven Senior Full Stack Developer with over 8 years of experience building scalable solutions across insurance, e-commerce, and healthcare sectors.

At Hub International, I led initiatives that optimized React-based platforms, enhanced broker dashboard performance by 35%, and automated content workflows saving over 15 hours weekly. My expertise in JavaScript, TypeScript, Node.js, and AWS has enabled me to drive impactful technological transformations.

Whether it's modernizing legacy systems, streamlining API integrations, or implementing CI/CD pipelines, I'm passionate about solving complex challenges. I believe my background would be a great fit for opportunities within your team.

I'd be thrilled to connect and explore how I can contribute to your organization's success. Feel free to reach out at your convenience.

Best regards,
Juan Flores
Senior Full Stack Developer
Email: juan.flores.engineer@gmail.com
GitHub: github.com/EASYMAK777
Portfolio: https://jflores.vercel.app/`;
    
    return `From: ${senderName}\nSubject: ${subject || '[Subject]'}\n\n${emailsText}${emailBody}`;
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
      
      <div className="email-preview">
        <h3>Campaign Preview</h3>
        <div
          id="preview"
          className="preview-content"
        >
          {createEmailPreview()}
        </div>
      </div>
    </>
  );
};

export default EmailComposer; 