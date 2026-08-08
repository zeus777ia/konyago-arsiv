import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReportTarget = "thread" | "post" | "listing" | "job" | "member";

export type ContentReport = {
  id: string;
  targetType: ReportTarget;
  targetId: string;
  reason: string;
  detail: string;
  reporterName: string;
  createdAt: string;
  status: "open" | "reviewed";
};

type ReportsState = {
  reports: ContentReport[];
  addReport: (input: {
    targetType: ReportTarget;
    targetId: string;
    reason: string;
    detail: string;
    reporterName: string;
  }) => { ok: true } | { ok: false; error: string };
  markReviewed: (id: string) => void;
};

function id() {
  return `rep_${Math.random().toString(36).slice(2, 10)}`;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (input) => {
        if (!input.reason) {
          return { ok: false, error: "Lütfen bir gerekçe seçin" };
        }
        // Aynı hedefe 24s içinde mükerrer rapor
        const day = Date.now() - 24 * 60 * 60_000;
        const dup = get().reports.some(
          (r) =>
            r.targetType === input.targetType &&
            r.targetId === input.targetId &&
            r.reporterName === input.reporterName &&
            +new Date(r.createdAt) > day,
        );
        if (dup) {
          return {
            ok: false,
            error: "Bu içeriği son 24 saat içinde zaten bildirdiniz",
          };
        }
        const report: ContentReport = {
          id: id(),
          targetType: input.targetType,
          targetId: input.targetId,
          reason: input.reason,
          detail: input.detail.trim().slice(0, 500),
          reporterName: input.reporterName || "Misafir",
          createdAt: new Date().toISOString(),
          status: "open",
        };
        set({ reports: [report, ...get().reports].slice(0, 200) });
        return { ok: true };
      },
      markReviewed: (reportId) => {
        set({
          reports: get().reports.map((r) =>
            r.id === reportId ? { ...r, status: "reviewed" } : r,
          ),
        });
      },
    }),
    { name: "konyago-arsiv-reports-v1" },
  ),
);
