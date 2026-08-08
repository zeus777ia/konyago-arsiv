import { useEffect } from "react";
import { useMembersStore, tickMemberActivity } from "@/lib/members/store";

/**
 * Oturum açıkken her 60 sn (ve sekme görünürken) 1 dk aktiflik ekler.
 */
export function ActivityTracker() {
  const memberId = useMembersStore((s) => s.session?.memberId ?? null);

  useEffect(() => {
    if (!memberId) return;

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      tickMemberActivity(1);
    };

    // İlk 5 sn sonra küçük bir tick — hemen “aktif” hissettir
    const boot = window.setTimeout(tick, 5_000);
    const id = window.setInterval(tick, 60_000);

    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.clearTimeout(boot);
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [memberId]);

  return null;
}
