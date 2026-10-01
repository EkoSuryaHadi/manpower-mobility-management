import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

const sizeClasses = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizeClasses[size]} border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin`} />
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  );
}
