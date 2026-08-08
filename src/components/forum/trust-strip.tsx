import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { SyncStatusPill } from "@/components/forum/sync-provider";

/** Ana sayfa / üst: güven verici ama abartısız şerit */
export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-primary/15 bg-primary-soft/60 px-3 py-2 text-[11px] leading-snug text-fg sm:text-xs">
      <ShieldCheck className="size-4 shrink-0 text-primary" />
      <span className="font-medium text-primary">Üye koruması:</span>
      <span className="text-muted">
        Moderasyon · spam koruması · cihazlar arası senkron · KVKK
      </span>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <SyncStatusPill />
        <Link
          to="/guvenlik"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Güvenlik merkezi
        </Link>
      </div>
    </div>
  );
}
