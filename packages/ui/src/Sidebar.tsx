"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col bg-slate-900 text-white border-r border-slate-700 h-screen">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-slate-700">
          <div className="flex items-center space-x-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PracSphere
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl
                  transition-all duration-300 transform hover:scale-105
                  animate-fadeInLeft
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <IconComponent className={`mr-3 h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-slate-700 p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 transform hover:scale-105 group"
          >
            <LogOut className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Logout
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}