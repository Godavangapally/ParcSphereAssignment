import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { sendOverdueTaskEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedKey =
      process.env.CRON_SECRET ||
      "NFVtpA5vGTynetw1Wnf8mIDxHV3TBwltJRZ8aqxeJoI";

    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const now = new Date();
    const users = await db.collection("users").find({}).toArray();

    let notificationsSent = 0;

    for (const user of users) {
      const overdueTasks = await db
        .collection("tasks")
        .find({
          userId: user._id,
          status: "pending",
          dueDate: { $lt: now }, 
        })
        .toArray();

      console.log("Checking overdue tasks for:", user.email);
      console.log("Found overdue tasks:", overdueTasks.length);

      if (overdueTasks.length > 0) {
        console.log(
          "Overdue task titles:",
          overdueTasks.map((t) => t.title)
        );

        const result = await sendOverdueTaskEmail(
          user.email,
          user.name,
          overdueTasks.map((task) => ({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
          }))
        );

        if (result.success) {
          notificationsSent++;

          await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { lastOverdueNotification: new Date() } }
          );
        } else {
          console.error(
            `❌ Failed to send email to ${user.email}`,
            result.error
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      message: `Sent ${notificationsSent} overdue task notification(s)`,
    });
  } catch (error) {
    console.error("Check overdue error:", error);
    return NextResponse.json(
      { error: "Failed to check overdue tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const user = await db.collection("users").findOne({ email: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const overdueTasks = await db
      .collection("tasks")
      .find({
        userId: user._id,
        status: "pending",
        dueDate: { $lt: now }, // ✅ FIXED HERE TOO
      })
      .toArray();

    console.log("Manual overdue check for:", user.email);
    console.log("Found overdue tasks:", overdueTasks.length);

    if (overdueTasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No overdue tasks found",
      });
    }

    const result = await sendOverdueTaskEmail(
      user.email,
      user.name,
      overdueTasks.map((task) => ({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      }))
    );

    return NextResponse.json({
      success: result.success,
      overdueCount: overdueTasks.length,
      message: result.success
        ? "Notification sent successfully"
        : "Failed to send notification",
    });
  } catch (error) {
    console.error("Manual notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
