import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for tracking data
// In a production app, you'd use a database like MongoDB, PostgreSQL, etc.
export const trackingData: Record<string, {
  emailId: string;
  recipientEmail: string;
  openCount: number;
  firstOpenedAt: Date | null;
  lastOpenedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
}> = {};

export async function GET(request: NextRequest) {
  try {
    // Get tracking ID from URL params
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');
    
    if (!trackingId) {
      // Return a transparent 1x1 pixel but don't track
      return new NextResponse(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
    
    // Record the open event
    const now = new Date();
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip;
    const userAgent = request.headers.get('user-agent');
    
    if (trackingData[trackingId]) {
      // Update existing tracking record
      trackingData[trackingId].openCount += 1;
      trackingData[trackingId].lastOpenedAt = now;
      trackingData[trackingId].ipAddress = ipAddress;
      trackingData[trackingId].userAgent = userAgent;
    } else {
      // Create new tracking record
      // Note: In a real implementation, you'd validate the tracking ID
      // against your database of sent emails
      trackingData[trackingId] = {
        emailId: trackingId,
        recipientEmail: 'unknown', // In a real implementation, you'd look this up
        openCount: 1,
        firstOpenedAt: now,
        lastOpenedAt: now,
        ipAddress: ipAddress,
        userAgent: userAgent,
      };
    }
    
    console.log(`Email opened: ${trackingId} at ${now.toISOString()}`);
    
    // Return a transparent 1x1 pixel GIF
    return new NextResponse(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error tracking pixel:', error);
    
    // Return a transparent pixel even if there's an error
    return new NextResponse(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

// API endpoint to retrieve tracking data (protected in a real app)
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');
    
    if (trackingId) {
      // Return data for a specific tracking ID
      return NextResponse.json({
        success: true,
        data: trackingData[trackingId] || null,
      });
    } else {
      // Return all tracking data
      return NextResponse.json({
        success: true,
        data: trackingData,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to get tracking data: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  }
} 