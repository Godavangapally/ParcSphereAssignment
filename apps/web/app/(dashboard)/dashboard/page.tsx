import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card } from "@repo/ui";
import { CheckCircle, Clock, AlertCircle, ListTodo } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTaskStats(userId: string) {
  const { getDatabase } = await import("@/lib/mongodb");
  const { ObjectId } = await import("mongodb");
  
  const db = await getDatabase();
  const tasks = await db
    .collection("tasks")
    .find({ userId: new ObjectId(userId) })
    .toArray();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  
  const now = new Date();
  const overdue = tasks.filter(
    (t) => t.status === "pending" && new Date(t.dueDate) < now
  ).length;

  return { total, completed, pending, overdue };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getTaskStats(session!.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome back, {session!.user.name}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Here&apos;s an overview of your tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<ListTodo className="w-8 h-8 text-gray-900 dark:text-white" />}
          color=""
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="w-8 h-8 text-gray-900 dark:text-white" />}
          color=""
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="w-8 h-8 text-gray-900 dark:text-white" />}
          color=""
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={<AlertCircle className="w-8 h-8 text-gray-900 dark:text-white" />}
          color=""
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/tasks?create=true"
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg font-medium transition-all"
            >
              + Create New Task
            </Link>
            <Link
              href="/tasks"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium transition-all"
            >
              View All Tasks
            </Link>
            <Link
              href="/tasks?filter=pending"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium transition-all"
            >
              Pending Tasks
            </Link>
            <Link
              href="/profile"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium transition-all"
            >
              My Profile
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${color} p-3 rounded-lg bg-gray-100 dark:bg-gray-900`}>{icon}</div>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </Card>
  );
}