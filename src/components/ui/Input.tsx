import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-700">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              "w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg transition",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
              "text-slate-800 placeholder:text-slate-400",
              error ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200",
              className
            )
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-600">{error}</p>}
        {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
