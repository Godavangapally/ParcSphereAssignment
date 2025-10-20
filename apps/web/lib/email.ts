import nodemailer from "nodemailer";

// Create transporter with better configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add additional options for better reliability
  pool: true,
  maxConnections: 1,
  rateDelta: 20000,
  rateLimit: 5,
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error);
  } else {
    console.log("✅ Email transporter is ready to send messages");
  }
});

interface OverdueTask {
  title: string;
  description: string;
  dueDate: string;
}

// Test email function to verify configuration
export async function sendTestEmail(toEmail: string) {
  const mailOptions = {
    from: `"PracSphere" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🧪 PracSphere Email Test",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 Email Test Successful!</h1>
            </div>
            <div class="content">
              <p>Hello!</p>
              <p>This is a test email from PracSphere to verify that email notifications are working correctly.</p>
              <p><strong>✅ Email system is functioning properly!</strong></p>
              <p>You will now receive notifications for overdue tasks.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent successfully to ${toEmail}`);
    return { success: true, message: "Test email sent successfully" };
  } catch (error) {
    console.error("❌ Test email failed:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function sendOverdueTaskEmail(
  userEmail: string,
  userName: string,
  overdueTasks: OverdueTask[]
) {
  // Validate inputs
  if (!userEmail || !userName || !overdueTasks || overdueTasks.length === 0) {
    console.error("❌ Invalid parameters for sendOverdueTaskEmail");
    return { success: false, error: "Invalid parameters" };
  }

  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email configuration missing");
    return { success: false, error: "Email configuration missing" };
  }

  const tasksList = overdueTasks
    .map(
      (task) => `
      <div style="background: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
        <h3 style="margin: 0 0 5px 0; color: #1f2937;">${task.title}</h3>
        <p style="margin: 5px 0; color: #6b7280;">${task.description}</p>
        <p style="margin: 5px 0; color: #dc2626; font-weight: bold;">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
    `
    )
    .join("");

  const mailOptions = {
    from: `"PracSphere" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `⚠️ You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Overdue Task Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>You have <strong>${overdueTasks.length}</strong> overdue task${overdueTasks.length > 1 ? "s" : ""} that need your attention:</p>
              
              ${tasksList}
              
              <p>Don't let these tasks slip through the cracks! Log in to PracSphere to update their status.</p>
              
              <a href="${process.env.NEXTAUTH_URL}/tasks" class="button">View My Tasks</a>
              
              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Tip: Mark tasks as completed or update their due dates to stay organized.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated reminder from PracSphere</p>
              <p>© ${new Date().getFullYear()} PracSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Overdue notification sent to ${userEmail}`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}