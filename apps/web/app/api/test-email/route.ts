import { NextRequest, NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing email to: ${email}`);

    const result = await sendTestEmail(email);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully!",
        details: result.message,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send test email",
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test email API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email test endpoint - use POST with email in body",
    example: {
      method: "POST",
      body: {
        email: "your-email@example.com",
      },
    },
  });
}
