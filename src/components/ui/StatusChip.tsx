import React from "react";

interface StatusChipProps {
  status: string;
  className?: string;
}

export function StatusChip({ status, className = "" }: StatusChipProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-400";

  switch (normalized) {
    case "READY":
    case "VERIFIED":
    case "READY_TO_MOBILIZE":
    case "APPROVED":
    case "SATISFIED":
    case "ARRIVED":
    case "ON_SITE":
    case "CLEARED":
    case "ACTIVE":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;

    case "BLOCKED":
    case "REJECTED":
    case "BLACKLISTED":
      styles = "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      dotColor = "bg-rose-500";
      break;

    case "EXPIRING_SOON":
    case "WARNING":
    case "REVISION_REQUIRED":
    case "RETURNED":
      styles = "bg-amber-50 text-amber-700 border-amber-200";
      dotColor = "bg-amber-500";
      break;

    case "PENDING":
    case "PENDING_REVIEW":
    case "SUBMITTED":
    case "IN_REVIEW":
    case "PRE_MOBILIZATION":
    case "IN_CLEARANCE":
      styles = "bg-blue-50 text-blue-700 border-blue-200";
      dotColor = "bg-blue-500";
      break;

    case "EXPIRED":
      styles = "bg-red-50 text-red-700 border-red-200";
      dotColor = "bg-red-500";
      break;

    case "DEMOBILIZED":
    case "CLOSED":
    case "CANCELLED":
    case "INACTIVE":
      styles = "bg-gray-100 text-gray-600 border-gray-200";
      dotColor = "bg-gray-400";
      break;
  }

  // Format readable text
  const label = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
