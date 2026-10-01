import React from "react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkerTableRow } from "./WorkerTableRow";
import { Users } from "lucide-react";
import type { WorkerListItem } from "@/types";

interface WorkerTableProps {
  workers: WorkerListItem[];
}

export function WorkerTable({ workers }: WorkerTableProps) {
  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Worker Info</th>
              <th className="py-3.5 px-4">NIK / Identitas</th>
              <th className="py-3.5 px-4">Perusahaan / Subcon</th>
              <th className="py-3.5 px-4">Active Assignment</th>
              <th className="py-3.5 px-4 text-center">Readiness</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {workers.length > 0 ? (
              workers.map((w) => <WorkerTableRow key={w.id} worker={w} />)
            ) : (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={<Users className="w-8 h-8" />}
                    title="Tidak ada pekerja yang ditemukan"
                    description="Coba ubah kata kunci pencarian atau daftarkan pekerja baru."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
