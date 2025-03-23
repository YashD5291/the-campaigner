import { NextRequest, NextResponse } from "next/server";
import { trackingStore } from "@/app/lib/tracking-store";

// Simple in-memory storage for tracking data
// In a production app, you'd use a database like MongoDB, PostgreSQL, etc.

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
    const ipAddress = request.headers.get('x-forwarded-for') || null;
    const userAgent = request.headers.get('user-agent');
    
    trackingStore.recordOpen(trackingId, 'unknown', ipAddress, userAgent);
    
    console.log(`Email opened: ${trackingId} at ${new Date().toISOString()}`);
    
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
        data: trackingStore.getRecord(trackingId),
      });
    } else {
      // Return all tracking data
      return NextResponse.json({
        success: true,
        data: trackingStore.getAllRecords(),
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