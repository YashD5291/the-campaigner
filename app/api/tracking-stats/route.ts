import { NextRequest, NextResponse } from "next/server";

// Import the tracking data from the pixel-tracking route
// In a real application, this would be stored in a database
import { trackingData } from "../pixel-tracking/route";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get('emailId');
    
    if (emailId) {
      // Return stats for a specific email
      return NextResponse.json({
        success: true,
        data: trackingData[emailId] || null,
      });
    }
    
    // Calculate aggregate stats
    const totalEmails = Object.keys(trackingData).length;
    const totalOpens = Object.values(trackingData).reduce((sum, record) => sum + record.openCount, 0);
    const uniqueOpens = Object.values(trackingData).filter(record => record.openCount > 0).length;
    
    return NextResponse.json({
      success: true,
      stats: {
        totalEmails,
        totalOpens,
        uniqueOpens,
        openRate: totalEmails > 0 ? (uniqueOpens / totalEmails) * 100 : 0,
      },
      data: trackingData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to get tracking statistics: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  }
} 