"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Clock,
  AlertTriangle,
  GitPullRequestDraft,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "EXPIRY_CRITICAL" | "EXPIRY_WARNING" | "APPROVAL_PENDING" | "MOBILIZATION_READY";
  title: string;
  description: string;
  timeAgo: string;
  linkUrl: string;
  isRead: boolean;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "EXPIRY_CRITICAL",
    title: "MCU Oil & Gas Expired",
    description: "Berkas MCU untuk Budi Santoso (PT Subcon Mandiri Sejahtera) telah kedaluwarsa.",
    timeAgo: "10 menit lalu",
    linkUrl: "/documents/expiry",
    isRead: false,
  },
  {
    id: "notif-2",
    type: "EXPIRY_WARNING",
    title: "Sertifikat K3 Mendekati Expired",
    description: "Sertifikat Basic K3 Ahmad Hidayat tersisa 18 hari lagi sebelum kedaluwarsa.",
    timeAgo: "1 jam lalu",
    linkUrl: "/documents/expiry",
    isRead: false,
  },
  {
    id: "notif-3",
    type: "APPROVAL_PENDING",
    title: "3 Pengajuan Pre-Mobilization Menunggu Review",
    description: "Pengajuan batch Rig Alpha memerlukan verifikasi Contractor HR & HSE.",
    timeAgo: "3 jam lalu",
    linkUrl: "/approvals",
    isRead: false,
  },
  {
    id: "notif-4",
    type: "MOBILIZATION_READY",
    title: "Pekerja Siap Berangkat (100% Ready)",
    description: "Rahmat Kurniawan telah memenuhi seluruh persyaratan K3 site offshore.",
    timeAgo: "1 hari lalu",
    linkUrl: "/mobilization",
    isRead: true,
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemClick = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "EXPIRY_CRITICAL":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "EXPIRY_WARNING":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "APPROVAL_PENDING":
        return <GitPullRequestDraft className="w-4 h-4 text-indigo-600" />;
      case "MOBILIZATION_READY":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
        title="Pusat Notifikasi & Alert Due Date"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-88 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 w-[340px]">
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Notifikasi & Alert Kepatuhan</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {unreadCount} Baru
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 transition"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.linkUrl}
                  onClick={() => handleItemClick(n.id)}
                  className={`p-3 block transition hover:bg-slate-50 ${
                    !n.isRead ? "bg-brand-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                Tidak ada notifikasi saat ini.
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href="/documents/expiry"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1"
            >
              Buka Semua Watchlist Due Date
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
