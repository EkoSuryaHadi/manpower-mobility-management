"use client";
import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message,
  confirmLabel = "Confirm", loading, variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === "danger" ? "bg-rose-100 text-rose-600" : "bg-brand-100 text-brand-600"}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-600">{message}</p>
        <div className="flex gap-2 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={variant === "danger" ? "danger" : "primary"} className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
