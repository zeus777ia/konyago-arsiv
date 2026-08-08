import { Bell } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useNotificationsStore } from "@/lib/notifications/store";
import { cn, formatRelative } from "@/lib/utils";

export function NotificationBell() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const [open, setOpen] = useState(false);

  const mine = useMemo(() => {
    if (!user?.displayName) return [];
    return items.filter((n) => n.forName === user.displayName).slice(0, 20);
  }, [items, user?.displayName]);

  const unread = mine.filter((n) => !n.read).length;

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex size-9 items-center justify-center rounded-md text-header-fg hover:bg-white/10"
        aria-label="Bildirimler"
        title="Bildirimler"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1 w-[min(100vw-1.5rem,22rem)] overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-xs font-semibold text-fg">Bildirimler</span>
              {unread > 0 && (
                <button
                  type="button"
                  className="text-[11px] text-primary hover:underline"
                  onClick={() => markAllRead(user.displayName!)}
                >
                  Tümünü okundu say
                </button>
              )}
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {mine.length === 0 ? (
                <li className="px-3 py-6 text-center text-xs text-muted">
                  Bildirim yok.
                </li>
              ) : (
                mine.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        markRead(n.id);
                        setOpen(false);
                        if (n.href?.startsWith("/konu/")) {
                          void navigate({
                            to: "/konu/$threadId",
                            params: {
                              threadId: n.href.replace("/konu/", ""),
                            },
                          });
                        } else if (n.href) {
                          window.location.href = n.href;
                        }
                      }}
                      className={cn(
                        "block w-full border-b border-border px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-surface-hover",
                        !n.read && "bg-primary-soft/40",
                      )}
                    >
                      <p className="text-xs font-semibold text-fg">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] text-subtle">
                        {formatRelative(n.createdAt)}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
