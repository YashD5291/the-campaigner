// Simple in-memory storage for tracking data
// In a production app, you'd use a database like MongoDB, PostgreSQL, etc.
interface TrackingRecord {
  emailId: string;
  recipientEmail: string;
  openCount: number;
  firstOpenedAt: Date | null;
  lastOpenedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
}

class TrackingStore {
  private store: Record<string, TrackingRecord> = {};

  public recordOpen(trackingId: string, recipientEmail: string = 'unknown', ipAddress: string | null = null, userAgent: string | null = null): void {
    const now = new Date();
    
    if (this.store[trackingId]) {
      // Update existing tracking record
      this.store[trackingId].openCount += 1;
      this.store[trackingId].lastOpenedAt = now;
      this.store[trackingId].ipAddress = ipAddress;
      this.store[trackingId].userAgent = userAgent;
    } else {
      // Create new tracking record
      this.store[trackingId] = {
        emailId: trackingId,
        recipientEmail,
        openCount: 1,
        firstOpenedAt: now,
        lastOpenedAt: now,
        ipAddress,
        userAgent,
      };
    }
  }

  public getRecord(trackingId: string): TrackingRecord | null {
    return this.store[trackingId] || null;
  }

  public getAllRecords(): Record<string, TrackingRecord> {
    return { ...this.store };
  }

  public getStats() {
    const totalEmails = Object.keys(this.store).length;
    const totalOpens = Object.values(this.store).reduce((sum, record) => sum + record.openCount, 0);
    const uniqueOpens = Object.values(this.store).filter(record => record.openCount > 0).length;
    
    return {
      totalEmails,
      totalOpens,
      uniqueOpens,
      openRate: totalEmails > 0 ? (uniqueOpens / totalEmails) * 100 : 0,
    };
  }
}

// Export a singleton instance
export const trackingStore = new TrackingStore(); 