'use client';

import { useState } from 'react';
import SenderInfo from './components/SenderInfo';
import CsvUpload, { CsvRow } from './components/CsvUpload';
import ContactList from './components/ContactList';
import EmailComposer from './components/EmailComposer';
import StatusDisplay from './components/StatusDisplay';
import SentEmails, { SentEmail } from './components/SentEmails';
import { sendEmails } from './components/EmailSender';
import Toast from './components/Toast';

export default function Home() {
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Sender information
  const [senderEmail, setSenderEmail] = useState('juan.flores.engineer@gmail.com');
  const [senderPassword, setSenderPassword] = useState('flen fetj ofsf txph');
  const [senderName, setSenderName] = useState('Juan Flores');
  
  // Email content
  const [subject, setSubject] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [emailBody, setEmailBody] = useState(`Hello there, I'm Juan Flores, a results-driven Senior Full Stack Developer with over 8 years of experience building scalable solutions across insurance, e-commerce, and healthcare sectors.

<p>At Hub International, I led initiatives that optimized React-based platforms, enhanced broker dashboard performance by 35%, and automated content workflows saving over 15 hours weekly. My expertise in JavaScript, TypeScript, Node.js, and AWS has enabled me to drive impactful technological transformations.</p>

<p>Whether it's modernizing legacy systems, streamlining API integrations, or implementing CI/CD pipelines, I'm passionate about solving complex challenges. I believe my background would be a great fit for opportunities within your team.</p>

<p>I'd be thrilled to connect and explore how I can contribute to your organization's success. Feel free to reach out at your convenience.</p>

<p>Best regards,<br>
Juan Flores<br>
Senior Full Stack Developer<br>
Email: juan.flores.engineer@gmail.com<br>
GitHub: github.com/EASYMAK777<br>
Portfolio: <a href="https://jflores.vercel.app/">https://jflores.vercel.app/</a></p>`);
  
  // CSV data handling
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<CsvRow[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [showCsvSection, setShowCsvSection] = useState(false);
  const [filteredData, setFilteredData] = useState<CsvRow[]>([]);
  
  // Status and UI state
  const [status, setStatus] = useState<{message: string, success: boolean} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [showSentEmails, setShowSentEmails] = useState(false);
  
  // Toast management
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  };

  const hideToast = () => {
    setToastMessage(null);
  };
  
  // Show status message
  const showStatusMessage = (message: string, isError = false) => {
    setStatus({ message, success: !isError });
    
    // For critical errors, also show a toast
    if (isError) {
      showToast(message, 'error');
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setStatus(null);
    }, 5000);
  };
  
  // Handle form submission to send emails
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedContacts.length === 0) {
      showToast('Please select at least one recruiter contact first', 'error');
      showStatusMessage('Please select at least one recruiter contact first', true);
      return;
    }
    
    if (!subject || !resumeFile) {
      showToast('Please fill in all required fields', 'error');
      showStatusMessage('Please fill in all required fields', true);
      return;
    }
    
    // Show loading spinner
    setIsLoading(true);
    
    // Clear previous status and emails
    setStatus(null);
    setSentEmails([]);
    
    try {
      // Send emails using our utility
      const results = await sendEmails({
        senderEmail,
        senderPassword,
        senderName,
        subject,
        resumeFile,
        selectedContacts,
        emailBody
      });
      
      // Update UI with results
      setIsLoading(false);
      setShowSentEmails(true);
      
      // Process results
      const successResults = results.filter(r => r.success);
      const failureResults = results.filter(r => !r.success);
      
      // Update sent emails list
      setSentEmails(results);
      
      // Show summary status
      if (failureResults.length === 0) {
        const msg = `All ${successResults.length} emails sent successfully!`;
        showToast(msg, 'success');
        showStatusMessage(msg);
      } else {
        const msg = `${successResults.length} emails sent successfully, ${failureResults.length} failed. Check details below.`;
        showToast(msg, 'error');
        showStatusMessage(msg, true);
      }
    } catch (error) {
      const errorMsg = `Error sending emails: ${error instanceof Error ? error.message : 'Unknown error'}`;
      showToast(errorMsg, 'error');
      setIsLoading(false);
      showStatusMessage(errorMsg, true);
    }
  };
  
  return (
    <main className="campaigner">
      <h1>Email Campaigner</h1>
      <p className="tagline">Create and send personalized email campaigns to multiple recipients</p>
      
      <div className="dashboard-link">
        <a href="/tracking-dashboard">View Email Tracking Dashboard →</a>
      </div>
      
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={hideToast} 
        />
      )}
      
      <form id="emailForm" onSubmit={handleSubmit}>
        {/* Sender Information Section */}
        <SenderInfo 
          senderEmail={senderEmail}
          setSenderEmail={setSenderEmail}
          senderPassword={senderPassword}
          setSenderPassword={setSenderPassword}
          senderName={senderName}
          setSenderName={setSenderName}
        />
        
        {/* CSV Upload Section */}
        <fieldset className="app-section">
          <legend>Step 1: Import Your Campaign Contacts</legend>
          <CsvUpload 
            setCsvData={setCsvData}
            setFilteredData={setFilteredData}
            setCsvFileName={setCsvFileName}
            setShowCsvSection={setShowCsvSection}
            setIsLoading={setIsLoading}
            showStatusMessage={showStatusMessage}
          />
          
          {showCsvSection && (
            <ContactList 
              csvData={csvData}
              csvFileName={csvFileName}
              filteredData={filteredData}
              setFilteredData={setFilteredData}
              selectedContacts={selectedContacts}
              setSelectedContacts={setSelectedContacts}
            />
          )}
        </fieldset>

        {/* Email Content Section */}
        <fieldset className="app-section">
          <legend>Step 2: Design Your Campaign Message</legend>
          <EmailComposer 
            subject={subject}
            setSubject={setSubject}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            fileName={fileName}
            setFileName={setFileName}
            selectedContacts={selectedContacts}
            senderName={senderName}
            emailBody={emailBody}
            setEmailBody={setEmailBody}
          />
        </fieldset>

        <div className="form-footer">
          <button
            type="submit"
            className="btn"
            id="sendButton"
            disabled={isLoading}
          >
            Launch Campaign
          </button>
        </div>

        <StatusDisplay status={status} isLoading={isLoading} />
      </form>

      <SentEmails sentEmails={sentEmails} showSentEmails={showSentEmails} />
    </main>
  );
}
