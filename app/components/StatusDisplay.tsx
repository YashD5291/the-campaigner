import React, { useEffect, useRef } from 'react';

interface StatusDisplayProps {
  status: { message: string; success: boolean } | null;
  isLoading: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, isLoading }) => {
  const statusRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the status message when it appears
  useEffect(() => {
    if (status && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  return (
    <div className="status-container">
      {isLoading && (
        <div
          id="loading"
          className="loading"
          style={{ display: 'block' }}
        >
          <div className="loading-spinner"></div>
          <p>Launching your campaign...</p>
        </div>
      )}

      {status && (
        <div
          id="status"
          ref={statusRef}
          className={status.success ? 'status-success' : 'status-error'}
          style={{ 
            display: 'block',
            position: 'sticky',
            bottom: '20px',
            zIndex: 100,
            marginTop: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          {status.success ? '✓ ' : '✗ '}{status.message}
        </div>
      )}
    </div>
  );
};

export default StatusDisplay; 