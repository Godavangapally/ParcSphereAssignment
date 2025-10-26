// FILE: packages/ui/src/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  User,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          flex flex-col bg-slate-800 border-r border-slate-700 transition-all duration-300 h-screen
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo Section with Toggle Button */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white whitespace-nowrap">
                PracSphere
              </span>
            )}
          </div>
          
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 border-t border-slate-700">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`
              flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all
              ${isCollapsed ? "justify-center" : "justify-start"}
            `}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}