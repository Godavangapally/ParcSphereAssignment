
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-gray-900 dark:focus:ring-white",
    secondary: "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:ring-gray-900 dark:focus:ring-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    outline:
      "border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white text-gray-900 dark:text-white bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
