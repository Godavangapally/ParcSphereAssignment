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
      className={`bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-900 overflow-hidden ${className}`}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-900">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-900">
          {footer}
        </div>
      )}
    </div>
  );
}
