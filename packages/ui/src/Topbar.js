"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
export function Topbar({ user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    return (_jsxs("div", { className: "flex h-16 items-center justify-between border-b border-slate-700 bg-slate-900 px-6 animate-slideDown", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent", children: "PracSphere Dashboard" }), _jsx("p", { className: "text-sm text-gray-400", children: "Manage your tasks and productivity" })] }), _jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setShowDropdown((prev) => !prev), className: "flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold shadow-lg animate-pulse-slow", children: initials }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm font-medium text-white", children: user.name }), _jsx("p", { className: "text-xs text-gray-400", children: user.email })] }), _jsx("svg", { className: `h-4 w-4 text-gray-400 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), showDropdown && (_jsxs("div", { className: "absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl z-50 animate-fadeIn", children: [_jsxs("div", { className: "px-4 py-3 border-b border-slate-700", children: [_jsx("p", { className: "text-sm font-medium text-white", children: user.name }), _jsx("p", { className: "text-xs text-gray-400 truncate", children: user.email })] }), _jsx("div", { className: "py-1", children: _jsxs("button", { onClick: () => signOut({ callbackUrl: "/" }), className: "flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group", children: [_jsx(LogOut, { className: "mr-3 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" }), "Sign out"] }) })] }))] }), _jsx("style", { jsx: true, global: true, children: `
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
      ` })] }));
}
