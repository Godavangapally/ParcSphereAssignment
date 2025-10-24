import { getDatabase } from "./mongodb";
import { sendOverdueTaskEmail } from "./email";

interface OverdueTask {
  title: string;
  description: string;
  dueDate: string | Date;
}

export class EmailScheduler {
  private static instance: EmailScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  private constructor() {}

  static getInstance(): EmailScheduler {
    if (!EmailScheduler.instance) {
      EmailScheduler.instance = new EmailScheduler();
    }
    return EmailScheduler.instance;
  }

  // Start the automatic email checking
  start(intervalMinutes: number = 60): void {
    if (this.isRunning) {
      console.log("📧 Email scheduler is already running");
      return;
    }

    console.log(`📧 Starting email scheduler - checking every ${intervalMinutes} minutes`);
    
    // Run immediately on start
    this.checkOverdueTasks();
    
    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.checkOverdueTasks();
    }, intervalMinutes * 60 * 1000);

    this.isRunning = true;
  }

  // Stop the automatic email checking
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("📧 Email scheduler stopped");
  }

  // Check for overdue tasks and send emails
  private async checkOverdueTasks(): Promise<void> {
    try {
      console.log("📧 Checking for overdue tasks...");
      
      const db = await getDatabase();
      const now = new Date();
      const users = await db.collection("users").find({}).toArray();

      let notificationsSent = 0;
      let totalOverdueTasks = 0;

      for (const user of users) {
        try {
          // Get all pending tasks for this user
          const candidateTasks = await db
            .collection("tasks")
            .find({
              userId: user._id,
              status: "pending",
            })
            .toArray();

          // Filter for overdue tasks
          const overdueTasks = candidateTasks.filter((task: any) => {
            const due = new Date(task.dueDate);
            return !Number.isNaN(due.getTime()) && due < now;
          });

          totalOverdueTasks += overdueTasks.length;

          if (overdueTasks.length > 0) {
            console.log(`📧 Found ${overdueTasks.length} overdue tasks for ${user.email}`);

            // Check if we should send notification (avoid spam)
            const lastNotification = user.lastOverdueNotification;
            const shouldSend = !lastNotification || 
              (new Date().getTime() - new Date(lastNotification).getTime()) > 24 * 60 * 60 * 1000; // 24 hours

            if (shouldSend) {
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
                console.log(`✅ Overdue notification sent to ${user.email}`);

                // Update last notification time
                await db.collection("users").updateOne(
                  { _id: user._id },
                  { $set: { lastOverdueNotification: new Date() } }
                );
              } else {
                console.error(`❌ Failed to send email to ${user.email}:`, result.error);
              }
            } else {
              console.log(`⏰ Skipping notification for ${user.email} (sent recently)`);
            }
          }
        } catch (userError) {
          console.error(`❌ Error processing user ${user.email}:`, userError);
        }
      }

      console.log(`📧 Email check complete: ${notificationsSent} notifications sent, ${totalOverdueTasks} total overdue tasks found`);
    } catch (error) {
      console.error("❌ Error in automatic email checking:", error);
    }
  }

  // Get scheduler status
  getStatus(): { isRunning: boolean; intervalMinutes?: number } {
    return {
      isRunning: this.isRunning,
    };
  }

  // Force check overdue tasks (manual trigger)
  async forceCheck(): Promise<{ success: boolean; notificationsSent: number; message: string }> {
    console.log("📧 Manual overdue task check triggered");
    
    try {
      const db = await getDatabase();
      const now = new Date();
      const users = await db.collection("users").find({}).toArray();

      let notificationsSent = 0;

      for (const user of users) {
        const candidateTasks = await db
          .collection("tasks")
          .find({
            userId: user._id,
            status: "pending",
          })
          .toArray();

        const overdueTasks = candidateTasks.filter((task: any) => {
          const due = new Date(task.dueDate);
          return !Number.isNaN(due.getTime()) && due < now;
        });

        if (overdueTasks.length > 0) {
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
          }
        }
      }

      return {
        success: true,
        notificationsSent,
        message: `Manual check complete: ${notificationsSent} notifications sent`,
      };
    } catch (error) {
      console.error("❌ Manual check error:", error);
      return {
        success: false,
        notificationsSent: 0,
        message: `Manual check failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

// Export singleton instance
export const emailScheduler = EmailScheduler.getInstance();
