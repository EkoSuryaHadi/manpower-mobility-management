import React from "react";
import { twMerge } from "tailwind-merge";

const colorMap: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-rose-100 text-rose-800",
  yellow: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  gray: "bg-slate-100 text-slate-700",
  orange: "bg-orange-100 text-orange-800",
};

interface BadgeProps {
  children: React.ReactNode;
  color?: keyof typeof colorMap;
  className?: string;
}

export function Badge({ children, color = "gray", className }: BadgeProps) {
  return (
    <span className={twMerge("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold", colorMap[color], className)}>
      {children}
    </span>
  );
}
