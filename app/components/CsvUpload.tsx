import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import Toast from './Toast';

interface CsvRow {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
  jobTitle?: string;
  location?: string;
  [key: string]: any;
}

interface CsvUploadProps {
  setCsvData: (data: CsvRow[]) => void;
  setFilteredData: (data: CsvRow[]) => void;
  setCsvFileName: (name: string) => void;
  setShowCsvSection: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  showStatusMessage: (message: string, isError?: boolean) => void;
}

const CsvUpload: React.FC<CsvUploadProps> = ({
  setCsvData,
  setFilteredData,
  setCsvFileName,
  setShowCsvSection,
  setIsLoading,
  showStatusMessage
}) => {
  const csvFileInputRef = useRef<HTMLInputElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  const loadCsvFile = () => {
    if (!csvFileInputRef.current?.files?.[0]) {
      showToast('Please select a CSV file first', 'error');
      return;
    }
    
    const file = csvFileInputRef.current.files[0];
    setCsvFileName(file.name);
    setIsLoading(true);
    
    Papa.parse<CsvRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<CsvRow>) => {
        setIsLoading(false);
        
        if (results.errors.length > 0) {
          const errorMsg = 'Error parsing CSV file: ' + results.errors[0].message;
          showToast(errorMsg, 'error');
          showStatusMessage(errorMsg, true);
          return;
        }

        // Check for required columns
        const requiredColumns = ['email'];
        const missingColumns = requiredColumns.filter(
          col => !results.meta.fields?.includes(col)
        );

        if (missingColumns.length > 0) {
          const errorMsg = `Missing required columns: ${missingColumns.join(', ')}`;
          showToast(errorMsg, 'error');
          showStatusMessage(errorMsg, true);
          return;
        }
        
        // Check for empty data
        if (results.data.length === 0) {
          const errorMsg = 'CSV file contains no data';
          showToast(errorMsg, 'error');
          showStatusMessage(errorMsg, true);
          return;
        }

        // Check for email addresses
        const validEmails = results.data.filter(row => row.email && row.email.includes('@'));
        if (validEmails.length === 0) {
          const errorMsg = 'No valid email addresses found in CSV file';
          showToast(errorMsg, 'error');
          showStatusMessage(errorMsg, true);
          return;
        }
        
        // Store the data
        setCsvData(results.data);
        setFilteredData(results.data);
        setShowCsvSection(true);
        
        const successMsg = `Successfully loaded ${results.data.length} contacts from CSV file.`;
        showToast(successMsg, 'success');
        showStatusMessage(successMsg);
      },
      error: (error: Error) => {
        setIsLoading(false);
        const errorMsg = 'Error loading CSV file: ' + error.message;
        showToast(errorMsg, 'error');
        showStatusMessage(errorMsg, true);
      }
    });
  };

  return (
    <div className="form-group">
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={hideToast} 
        />
      )}
      
      <label htmlFor="csvFile">Upload Your Contacts List:</label>
      <input 
        type="file" 
        id="csvFile" 
        ref={csvFileInputRef}
        accept=".csv" 
      />
      <div className="info-text">Upload a CSV file containing your campaign contacts. Must include email addresses.</div>
      
      <div className="form-footer">
        <button type="button" className="btn" onClick={loadCsvFile}>Import Contacts</button>
      </div>
    </div>
  );
};

export default CsvUpload;
export type { CsvRow }; 