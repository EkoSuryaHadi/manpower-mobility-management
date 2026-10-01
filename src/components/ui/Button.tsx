import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const variants = {
  primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-sm",
  secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm",
  danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-sm",
  ghost: "hover:bg-slate-100 text-slate-600",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-xs",
  lg: "px-5 py-2.5 text-sm",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingDots /> : icon}
      {children}
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
    </span>
  );
}
