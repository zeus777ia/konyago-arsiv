import { Flag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SAFETY } from "@/lib/safety/content";
import { useReportsStore, type ReportTarget } from "@/lib/reports/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export function ReportButton({
  targetType,
  targetId,
  compact,
}: {
  targetType: ReportTarget;
  targetId: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const addReport = useReportsStore((s) => s.addReport);
  const user = useCurrentUser();

  const submit = () => {
    const res = addReport({
      targetType,
      targetId,
      reason,
      detail,
      reporterName: user?.displayName ?? "Misafir",
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Bildiriminiz kaydedildi. Teşekkürler.");
    setOpen(false);
    setReason("");
    setDetail("");
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          compact
            ? "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-subtle hover:bg-surface-hover hover:text-fg"
            : "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted hover:bg-surface-hover hover:text-fg"
        }
      >
        <Flag className="size-3" />
        Bildir
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-72 rounded-lg border border-border bg-surface p-3 shadow-lg">
          <p className="mb-2 text-xs font-semibold text-fg">İçerik bildir</p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mb-2 h-9 w-full rounded-md border border-border bg-bg-elevated px-2 text-xs"
          >
            <option value="">Gerekçe seçin…</option>
            {SAFETY.reportReasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={3}
            placeholder="Kısa açıklama (isteğe bağlı)"
            className="mb-2 w-full resize-y rounded-md border border-border bg-bg-elevated px-2 py-1.5 text-xs"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Vazgeç
            </Button>
            <Button type="button" size="sm" onClick={submit}>
              Gönder
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
