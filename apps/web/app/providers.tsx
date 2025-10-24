"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Auto-start email scheduler when app loads
    const startEmailScheduler = async () => {
      try {
        const response = await fetch("/api/email-scheduler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start", intervalMinutes: 60 }),
        });
        const data = await response.json();
        if (data.success) {
          console.log("📧 Email scheduler started automatically");
        }
      } catch (error) {
        console.log("📧 Email scheduler auto-start failed (this is normal in development)");
      }
    };

    startEmailScheduler();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
