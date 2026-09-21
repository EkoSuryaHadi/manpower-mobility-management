"use client";

import React, { useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobilizationActionClientProps {
  mobilizationId: string;
  status: string;
  workerName: string;
}

export function MobilizationActionClient({
  mobilizationId,
  status,
  workerName,
}: MobilizationActionClientProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmArrival = async () => {
    setIsConfirming(true);
    try {
      const res = await fetch(`/api/v1/mobilizations/${mobilizationId}/arrive`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal konfirmasi kedatangan");

      alert(`Kedatangan ${workerName} di site berhasil dikonfirmasi. Status pekerja kini ON SITE!`);
      router.refresh();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsConfirming(false);
    }
  };

  if (status === "ARRIVED") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Verified on Site
      </span>
    );
  }

  return (
    <button
      onClick={handleConfirmArrival}
      disabled={isConfirming}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
    >
      {isConfirming ? (
        <RefreshCw className="w-3 h-3 animate-spin" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5" />
      )}
      Confirm Arrival
    </button>
  );
}
