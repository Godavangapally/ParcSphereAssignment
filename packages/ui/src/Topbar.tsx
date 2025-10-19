"use client";

import React, { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserData {
  name: string;
  email: string;
}

interface TopbarProps {
  user: UserData;
}

export function Topbar({ user }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // User initials
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-900 px-6 animate-slideDown">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          PracSphere Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Manage your tasks and productivity
        </p>
      </div>

      {/* User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold shadow-lg animate-pulse-slow">
            {initials}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
              showDropdown ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl z-50 animate-fadeIn">
            <div className="px-4 py-3 border-b border-slate-700">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
              >
                <LogOut className="mr-3 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}