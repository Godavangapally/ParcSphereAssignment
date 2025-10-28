// FILE: packages/ui/src/Topbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Sun, Moon } from "lucide-react";
import { signOut } from "next-auth/react";

interface TopbarProps {
  user: {
    name: string;
    email: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize theme from localStorage or default to light
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    
    if (shouldUseDark && !document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (!shouldUseDark && document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

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

  const toggleTheme = () => {
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains('dark');
    
    if (isCurrentlyDark) {
      html.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            PracSphere Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
            Manage your tasks and productivity
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-gray-700 dark:text-gray-300"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
            <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white dark:text-black">{initials}</span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-gray-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-900">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
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
    </div>
  );
}