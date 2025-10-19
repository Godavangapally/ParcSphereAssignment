import React from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}
export declare function Input({ label, icon, error, className, ...props }: InputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map