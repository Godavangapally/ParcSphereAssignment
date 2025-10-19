import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface OverdueTask {
  title: string;
  description: string;
  dueDate: string;
}

export async function sendOverdueTaskEmail(
  userEmail: string,
  userName: string,
  overdueTasks: OverdueTask[]
) {
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
    await transporter.sendMail(mailOptions);
    console.log(`Overdue notification sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}