// FILE: packages/ui/src/Topbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface TopbarProps {
  user: {
    name: string;
    email: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="sticky top-0 z-30 bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            PracSphere Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Manage your tasks and productivity
          </p>
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{initials}</span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-700 rounded-lg shadow-xl border border-slate-600 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-600">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}