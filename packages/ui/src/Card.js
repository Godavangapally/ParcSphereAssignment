import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ children, className = "", header, footer }) {
    return (_jsxs("div", { className: `bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden ${className}`, children: [header && (_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-slate-700", children: header })), _jsx("div", { children: children }), footer && (_jsx("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-slate-700", children: footer }))] }));
}
