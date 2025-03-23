import { CsvRow } from './CsvUpload';

export interface SendEmailParams {
  senderEmail: string;
  senderPassword: string;
  senderName: string;
  subject: string;
  resumeFile: File;
  selectedContacts: CsvRow[];
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
  selectedContacts
}: SendEmailParams): Promise<SendEmailResult[]> => {
  // Create template email body
  const templateBody = `Hello there, I'm Juan Flores, a results-driven Senior Full Stack Developer with over 8 years of experience building scalable solutions across insurance, e-commerce, and healthcare sectors.

At Hub International, I led initiatives that optimized React-based platforms, enhanced broker dashboard performance by 35%, and automated content workflows saving over 15 hours weekly. My expertise in JavaScript, TypeScript, Node.js, and AWS has enabled me to drive impactful technological transformations.

Whether it's modernizing legacy systems, streamlining API integrations, or implementing CI/CD pipelines, I'm passionate about solving complex challenges. I believe my background would be a great fit for opportunities within your team.

I'd be thrilled to connect and explore how I can contribute to your organization's success. Feel free to reach out at your convenience.

Best regards,
Juan Flores
Senior Full Stack Developer
Email: juan.flores.engineer@gmail.com
GitHub: github.com/EASYMAK777
Portfolio: https://jflores.vercel.app/`;
  
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
        formData.append('body', templateBody);
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