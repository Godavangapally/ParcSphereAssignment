import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ children, className = "", header, footer }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden ${className}`}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
          {footer}
        </div>
      )}
    </div>
  );
}
