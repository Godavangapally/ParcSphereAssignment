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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-black rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors shadow-sm border border-gray-200 dark:border-gray-900"
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-30 dark:bg-black dark:bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          flex flex-col bg-white dark:bg-black border-r border-gray-200 dark:border-gray-900 transition-all duration-300 h-screen
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo Section with Toggle Button */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex-shrink-0 w-9 h-9 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white dark:text-black" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                PracSphere
              </span>
            )}
          </div>
          
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-900">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`
              flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-all
              ${isCollapsed ? "justify-center" : "justify-start"}
            `}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}