import { NextRequest, NextResponse } from "next/server";
import { trackingStore } from "@/app/lib/tracking-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get('emailId');
    
    if (emailId) {
      // Return stats for a specific email
      return NextResponse.json({
        success: true,
        data: trackingStore.getRecord(emailId),
      });
    }
    
    // Return aggregate stats and all tracking data
    return NextResponse.json({
      success: true,
      stats: trackingStore.getStats(),
      data: trackingStore.getAllRecords(),
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