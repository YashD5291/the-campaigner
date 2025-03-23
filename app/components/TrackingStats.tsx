import React, { useEffect, useState } from 'react';
import './TrackingStats.css';

interface TrackingData {
  emailId: string;
  recipientEmail: string;
  openCount: number;
  firstOpenedAt: Date | null;
  lastOpenedAt: Date | null;
}

interface TrackingStats {
  totalEmails: number;
  totalOpens: number;
  uniqueOpens: number;
  openRate: number;
}

const TrackingStats: React.FC = () => {
  const [stats, setStats] = useState<TrackingStats | null>(null);
  const [emailData, setEmailData] = useState<Record<string, TrackingData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tracking-stats');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tracking stats: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setStats(data.stats);
          setEmailData(data.data || {});
        } else {
          throw new Error(data.message || 'Failed to fetch tracking stats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching tracking stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingStats();
    
    // Refresh stats every 30 seconds
    const intervalId = setInterval(fetchTrackingStats, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="stats-container loading">Loading tracking statistics...</div>;
  }

  if (error) {
    return <div className="stats-container error">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="stats-container empty">No tracking data available yet</div>;
  }

  return (
    <div className="stats-container">
      <h2>Email Campaign Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Total Emails</h3>
          <p className="stat-value">{stats.totalEmails}</p>
        </div>
        
        <div className="stat-box">
          <h3>Total Opens</h3>
          <p className="stat-value">{stats.totalOpens}</p>
        </div>
        
        <div className="stat-box">
          <h3>Unique Opens</h3>
          <p className="stat-value">{stats.uniqueOpens}</p>
        </div>
        
        <div className="stat-box">
          <h3>Open Rate</h3>
          <p className="stat-value">{stats.openRate.toFixed(1)}%</p>
        </div>
      </div>
      
      {Object.keys(emailData).length > 0 && (
        <div className="tracking-details">
          <h3>Email Open Details</h3>
          <table className="tracking-table">
            <thead>
              <tr>
                <th>Email ID</th>
                <th>Recipient</th>
                <th>Open Count</th>
                <th>First Opened</th>
                <th>Last Opened</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(emailData).map(([id, data]) => (
                <tr key={id}>
                  <td>{id.slice(0, 8)}...</td>
                  <td>{data.recipientEmail}</td>
                  <td>{data.openCount}</td>
                  <td>{data.firstOpenedAt ? new Date(data.firstOpenedAt).toLocaleString() : 'Not opened'}</td>
                  <td>{data.lastOpenedAt ? new Date(data.lastOpenedAt).toLocaleString() : 'Not opened'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackingStats; 