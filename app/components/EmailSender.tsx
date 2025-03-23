import { CsvRow } from './CsvUpload';

export interface SendEmailParams {
  senderEmail: string;
  senderPassword: string;
  senderName: string;
  subject: string;
  resumeFile: File;
  selectedContacts: CsvRow[];
  emailBody: string;
}

export interface SendEmailResult {
  email: string;
  name: string;
  success: boolean;
  message: string;
}

export const sendEmails = async ({
  senderEmail,
  senderPassword,
  senderName,
  subject,
  resumeFile,
  selectedContacts,
  emailBody
}: SendEmailParams): Promise<SendEmailResult[]> => {
  // Send emails to all selected contacts
  const results = await Promise.all(
    selectedContacts.map(async (contact) => {
      try {
        // Create personalized message for each contact
        let recruiterName = '';
        
        // Try to get recruiter's first name from available fields
        if (contact.firstName) {
          recruiterName = contact.firstName;
        } else if (contact.fullName) {
          recruiterName = contact.fullName.split(' ')[0];
        } else {
          recruiterName = 'Recruiter';
        }
        
        const formData = new FormData();
        formData.append('fromEmail', senderEmail);
        formData.append('fromPassword', senderPassword);
        formData.append('fromName', senderName);
        formData.append('toEmail', contact.email || '');
        formData.append('toName', recruiterName);
        formData.append('subject', subject);
        formData.append('body', emailBody);
        formData.append('resumeFile', resumeFile);
        
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        return {
          email: contact.email || '',
          name: contact.fullName || recruiterName,
          success: result.success,
          message: result.message
        };
      } catch (error) {
        return {
          email: contact.email || '',
          name: contact.fullName || 'Contact',
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );
  
  return results;
}; 