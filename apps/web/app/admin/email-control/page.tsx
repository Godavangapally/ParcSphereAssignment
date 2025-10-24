"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
import { Play, Square, RefreshCw, Mail, Clock, CheckCircle, XCircle } from "lucide-react";

interface SchedulerStatus {
  isRunning: boolean;
  intervalMinutes?: number;
}

export default function EmailControlPage() {
  const [status, setStatus] = useState<SchedulerStatus>({ isRunning: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastCheck, setLastCheck] = useState<string>("");

  // Fetch current status
  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/email-scheduler");
      const data = await response.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
  };

  // Start scheduler
  const startScheduler = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/email-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", intervalMinutes: 60 }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      setMessage("Failed to start scheduler");
    } finally {
      setLoading(false);
    }
  };

  // Stop scheduler
  const stopScheduler = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/email-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      setMessage("Failed to stop scheduler");
    } finally {
      setLoading(false);
    }
  };

  // Force check
  const forceCheck = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/email-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const data = await response.json();
      setMessage(data.message);
      setLastCheck(new Date().toLocaleString());
    } catch (error) {
      setMessage("Failed to run manual check");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📧 Email Scheduler Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage automatic overdue task email notifications
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6 p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Current Status
            </h2>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            {status.isRunning ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Running
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  Stopped
                </span>
              </>
            )}
          </div>

          {status.isRunning && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Checking every 60 minutes</span>
            </div>
          )}
        </Card>

        {/* Control Buttons */}
        <Card className="mb-6 p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Scheduler Controls
          </h3>
          
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={startScheduler}
              disabled={loading || status.isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Scheduler
            </Button>

            <Button
              onClick={stopScheduler}
              disabled={loading || !status.isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Stop Scheduler
            </Button>

            <Button
              onClick={forceCheck}
              disabled={loading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Force Check Now
            </Button>
          </div>
        </Card>

        {/* Message Display */}
        {message && (
          <Card className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <p className="text-blue-800 dark:text-blue-200">{message}</p>
          </Card>
        )}

        {/* Last Check Info */}
        {lastCheck && (
          <Card className="p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Last manual check: {lastCheck}
            </p>
          </Card>
        )}

        {/* Information */}
        <Card className="mt-6 p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            How it works
          </h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              • <strong>Automatic Mode:</strong> When started, the scheduler checks for overdue tasks every 60 minutes
            </p>
            <p>
              • <strong>Smart Notifications:</strong> Users receive at most one notification per 24 hours to avoid spam
            </p>
            <p>
              • <strong>Manual Check:</strong> Use "Force Check Now" to immediately check and send notifications
            </p>
            <p>
              • <strong>Overdue Detection:</strong> Tasks with due dates in the past and status "pending" are considered overdue
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
