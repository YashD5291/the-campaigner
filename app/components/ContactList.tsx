import React, { useState, useEffect } from 'react';
import type { CsvRow } from './CsvUpload';

interface ContactListProps {
  csvData: CsvRow[];
  csvFileName: string;
  filteredData: CsvRow[];
  setFilteredData: (data: CsvRow[]) => void;
  selectedContacts: CsvRow[];
  setSelectedContacts: (contacts: CsvRow[]) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  csvData,
  csvFileName,
  filteredData,
  setFilteredData,
  selectedContacts,
  setSelectedContacts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterField, setFilterField] = useState('all');

  // Filter contacts based on search query and field
  const filterContacts = () => {
    if (!searchQuery) {
      setFilteredData(csvData);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = csvData.filter(row => {
      if (filterField === 'all') {
        // Search across all fields
        return Object.values(row).some(value => 
          value && String(value).toLowerCase().includes(query)
        );
      } else {
        // Search in specific field
        return row[filterField] && 
              String(row[filterField]).toLowerCase().includes(query);
      }
    });
    
    setFilteredData(filtered);
  };
  
  // Apply the filter when search changes
  useEffect(() => {
    filterContacts();
  }, [searchQuery, filterField]);

  // Toggle select all checkboxes
  const toggleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedContacts(filteredData);
    } else {
      setSelectedContacts([]);
    }
  };
  
  // Toggle individual contact selection
  const toggleContactSelection = (contact: CsvRow, isChecked: boolean) => {
    if (isChecked) {
      setSelectedContacts(prev => [...prev, contact]);
    } else {
      setSelectedContacts(prev => prev.filter(c => c.email !== contact.email));
    }
  };
  
  // Check if a contact is selected
  const isContactSelected = (contact: CsvRow) => {
    return selectedContacts.some(c => c.email === contact.email);
  };

  return (
    <div id="csvDataSection">
      <div className="csv-stats" id="csvStats">
        <strong>Contacts File Loaded:</strong> {csvFileName} | 
        <strong>Total Contacts:</strong> {csvData.length} | 
        <strong>Available Fields:</strong> {Object.keys(csvData[0] || {}).length}
      </div>
      
      <div className="csv-controls">
        <div>
          <div className="select-all-container">
            <input 
              type="checkbox" 
              id="selectAll" 
              checked={selectedContacts.length === filteredData.length && filteredData.length > 0}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <label htmlFor="selectAll" style={{ display: 'inline' }}>Select All Contacts</label>
          </div>
        </div>
        <div>
          <input 
            type="text" 
            id="searchFilter" 
            className="search-filter" 
            placeholder="Search recipients by name, company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            id="filterField"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="all">All Fields</option>
            <option value="fullName">Name</option>
            <option value="email">Email</option>
            <option value="companyName">Company</option>
            <option value="jobTitle">Position</option>
          </select>
        </div>
      </div>
      
      <div className="csv-table-container">
        <table className="csv-table" id="csvDataTable">
          <thead>
            <tr>
              <th><input type="checkbox" id="headerCheckbox" checked={selectedContacts.length === filteredData.length && filteredData.length > 0} onChange={(e) => toggleSelectAll(e.target.checked)} /></th>
              <th>Recipient Name</th>
              <th>Email Address</th>
              <th>Company</th>
              <th>Position</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody id="csvDataBody">
            {filteredData.map((row, index) => {
              // Skip rows without email
              if (!row.email) return null;
              
              // Get full name from available fields
              let fullName = row.fullName;
              if (!fullName && row.firstName && row.lastName) {
                fullName = row.firstName + ' ' + row.lastName;
              } else if (!fullName && row.firstName) {
                fullName = row.firstName;
              } else if (!fullName && row.lastName) {
                fullName = row.lastName;
              } else if (!fullName) {
                fullName = 'Unnamed Contact';
              }
              
              return (
                <tr key={index}>
                  <td>
                    <input 
                      type="checkbox" 
                      className="contact-checkbox" 
                      checked={isContactSelected(row)}
                      onChange={(e) => toggleContactSelection(row, e.target.checked)}
                    />
                  </td>
                  <td>{fullName}</td>
                  <td>{row.email || ''}</td>
                  <td>{row.companyName || ''}</td>
                  <td>{row.jobTitle || ''}</td>
                  <td>{row.location || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList; 