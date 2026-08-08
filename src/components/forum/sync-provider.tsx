import { useEffect, useState } from "react";
import {
  getSyncState,
  runSync,
  startSyncEngine,
  subscribeSync,
  type SyncState,
} from "@/lib/sync/engine";
import { Cloud, CloudOff, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncProvider() {
  useEffect(() => {
    startSyncEngine();
  }, []);
  return null;
}

export function SyncStatusPill({ className }: { className?: string }) {
  const [s, setS] = useState<SyncState>(() => getSyncState());
  useEffect(() => {
    return subscribeSync(setS);
  }, []);

  const label =
    s.status === "syncing"
      ? "Senkronize ediliyor…"
      : s.status === "ok"
        ? s.transport === "api"
          ? "Bulut senkron: açık"
          : s.transport === "jsonblob"
            ? "Cihazlar arası senkron: açık"
            : "Senkron hazır"
        : s.status === "error"
          ? "Senkron hatası"
          : "Senkron";

  const Icon =
    s.status === "syncing"
      ? Loader2
      : s.status === "error" || s.status === "offline"
        ? CloudOff
        : Cloud;

  return (
    <button
      type="button"
      title={
        s.lastError
          ? s.lastError
          : s.lastSyncedAt
            ? `Son senkron: ${new Date(s.lastSyncedAt).toLocaleString("tr-TR")}`
            : "Cihazlar arası senkron"
      }
      onClick={() => void runSync("pull")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted shadow-sm hover:bg-surface-hover hover:text-fg",
        s.status === "ok" && "border-emerald-200 text-emerald-800",
        s.status === "error" && "border-danger/30 text-danger",
        className,
      )}
    >
      <Icon
        className={cn("size-3.5", s.status === "syncing" && "animate-spin")}
      />
      <span className="max-w-[11rem] truncate">{label}</span>
      <RefreshCw className="size-3 opacity-60" />
    </button>
  );
}
