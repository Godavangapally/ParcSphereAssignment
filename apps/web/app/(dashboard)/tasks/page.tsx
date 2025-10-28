"use client";

import { useState, useEffect } from "react";
import { Button, Card, Input } from "@repo/ui";
import { Plus, Filter, CheckCircle, Clock, Trash2, Calendar, Edit2, X } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, status: "pending" }),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([createdTask, ...tasks]);
        setNewTask({ title: "", description: "", dueDate: "" });
        setShowNewTaskForm(false);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: editingTask._id,
          title: editingTask.title,
          description: editingTask.description,
          dueDate: editingTask.dueDate,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((t) => t._id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  const canEdit = (dueDate: string) => {
    // Can edit if due date hasn't passed
    return new Date(dueDate) >= new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-900 dark:text-white text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Task Manager</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and organize your tasks efficiently</p>
        </div>
        <Button
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Button>
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
        <Card>
          <form onSubmit={handleCreateTask} className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Task</h3>
            
            <Input
              label="Task Title"
              type="text"
              placeholder="e.g., File GSTR-3B"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="e.g., Client X monthly return"
                rows={3}
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Due Date"
              type="date"
              icon={<Calendar className="w-5 h-5" />}
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              required
            />

            <div className="flex space-x-3">
              <Button type="submit">
                Create Task
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowNewTaskForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Edit Task Form */}
      {editingTask && (
        <Card>
          <form onSubmit={handleEditTask} className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Task</h3>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <Input
              label="Task Title"
              type="text"
              placeholder="e.g., File GSTR-3B"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="e.g., Client X monthly return"
                rows={3}
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, description: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Due Date"
              type="date"
              icon={<Calendar className="w-5 h-5" />}
              value={editingTask.dueDate.split('T')[0]}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
              required
            />

            <div className="flex space-x-3">
              <Button type="submit">
                Update Task
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter Buttons */}
      <div className="flex items-center space-x-3">
        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <Button
          variant={filter === "all" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Tasks ({tasks.length})
        </Button>
        <Button
          variant={filter === "pending" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending ({tasks.filter((t) => t.status === "pending").length})
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed ({tasks.filter((t) => t.status === "completed").length})
        </Button>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {filter === "all"
                ? "Create your first task to get started"
                : `No ${filter} tasks at the moment`}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card
              key={task._id}
              className={`transition-all ${
                isOverdue(task.dueDate, task.status)
                  ? "border-red-500 border-2"
                  : "border-gray-200 dark:border-gray-900"
              }`}
            >
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                        : isOverdue(task.dueDate, task.status)
                        ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {task.status === "completed"
                      ? "Completed"
                      : isOverdue(task.dueDate, task.status)
                      ? "Overdue"
                      : "Pending"}
                  </span>
                </div>

                {/* Task Title */}
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    task.status === "completed"
                      ? "text-gray-400 dark:text-gray-500 line-through"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {task.title}
                </h3>

                {/* Task Description */}
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                {/* Due Date */}
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={task.status === "completed" ? "secondary" : "primary"}
                    onClick={() => handleToggleStatus(task._id, task.status)}
                    className="flex-1"
                  >
                    {task.status === "completed" ? (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        Mark Pending
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </>
                    )}
                  </Button>
                  
                  {canEdit(task.dueDate) && task.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTask(task)}
                      title="Edit task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}