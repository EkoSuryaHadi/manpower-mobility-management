import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-slate-700">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={twMerge(
            clsx(
              "w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg transition",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700",
              error ? "border-rose-400" : "border-slate-200",
              className
            )
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-[11px] text-rose-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
