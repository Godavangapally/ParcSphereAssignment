import { NextRequest, NextResponse } from "next/server";
import { emailScheduler } from "@/lib/email-scheduler";

export async function GET() {
  try {
    const status = emailScheduler.getStatus();
    return NextResponse.json({
      success: true,
      status,
      message: status.isRunning 
        ? "Email scheduler is running" 
        : "Email scheduler is stopped"
    });
  } catch (error) {
    console.error("Get scheduler status error:", error);
    return NextResponse.json(
      { error: "Failed to get scheduler status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, intervalMinutes = 60 } = body;

    switch (action) {
      case "start":
        emailScheduler.start(intervalMinutes);
        return NextResponse.json({
          success: true,
          message: `Email scheduler started - checking every ${intervalMinutes} minutes`,
          status: emailScheduler.getStatus()
        });

      case "stop":
        emailScheduler.stop();
        return NextResponse.json({
          success: true,
          message: "Email scheduler stopped",
          status: emailScheduler.getStatus()
        });

      case "check":
        const result = await emailScheduler.forceCheck();
        return NextResponse.json({
          success: result.success,
          message: result.message,
          notificationsSent: result.notificationsSent
        });

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'start', 'stop', or 'check'" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Scheduler control error:", error);
    return NextResponse.json(
      { error: "Failed to control scheduler" },
      { status: 500 }
    );
  }
}
