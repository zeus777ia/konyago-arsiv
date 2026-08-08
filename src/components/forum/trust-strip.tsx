import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

/** Ana sayfa / üst: güven verici ama abartısız şerit */
export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-primary/15 bg-primary-soft/60 px-3 py-2 text-[11px] leading-snug text-fg sm:text-xs">
      <ShieldCheck className="size-4 shrink-0 text-primary" />
      <span className="font-medium text-primary">Üye koruması:</span>
      <span className="text-muted">
        Moderasyon onayı · spam motoru (8 katman) · içerik bildirimi · KVKK
      </span>
      <Link
        to="/guvenlik"
        className="ml-auto font-semibold text-primary underline-offset-2 hover:underline"
      >
        Güvenlik merkezi
      </Link>
    </div>
  );
}
