'use client';

import React from 'react';
import TrackingStats from '../components/TrackingStats';

const TrackingDashboard: React.FC = () => {
  return (
    <div className="tracking-dashboard">
      <h1>Email Campaign Tracking Dashboard</h1>
      <p>Monitor the performance of your email campaigns with real-time open tracking.</p>
      
      <TrackingStats />
      
      <div className="dashboard-info">
        <h2>About Email Tracking</h2>
        <p>
          This dashboard shows you when recipients open your emails. Each email sent through 
          this system contains a tiny invisible tracking pixel that reports back when the 
          email is opened.
        </p>
        <p>
          <strong>Note:</strong> Email tracking only works when:
        </p>
        <ul>
          <li>The recipient's email client loads images</li>
          <li>The recipient is connected to the internet when opening the email</li>
          <li>The email is viewed in HTML format (not plain text)</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackingDashboard; 