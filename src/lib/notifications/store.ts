import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationKind =
  | "moderation_approved"
  | "moderation_rejected"
  | "reply"
  | "report_ack"
  | "system"
  | "featured";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  /** Hedef üye görünen adı; boşsa herkese */
  forName: string;
  createdAt: string;
  read: boolean;
};

type NotifState = {
  items: AppNotification[];
  push: (input: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: (forName: string) => void;
  clearRead: (forName: string) => void;
};

function nid() {
  return `n_${Math.random().toString(36).slice(2, 10)}`;
}

export const useNotificationsStore = create<NotifState>()(
  persist(
    (set, get) => ({
      items: [],
      push: (input) => {
        const item: AppNotification = {
          ...input,
          id: nid(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        set({ items: [item, ...get().items].slice(0, 120) });
      },
      markRead: (id) => {
        set({
          items: get().items.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        });
      },
      markAllRead: (forName) => {
        set({
          items: get().items.map((n) =>
            n.forName === forName ? { ...n, read: true } : n,
          ),
        });
      },
      clearRead: (forName) => {
        set({
          items: get().items.filter(
            (n) => !(n.forName === forName && n.read),
          ),
        });
      },
    }),
    { name: "konyago-arsiv-notif-v1" },
  ),
);

export function notifyUser(
  forName: string,
  input: Omit<AppNotification, "id" | "createdAt" | "read" | "forName">,
) {
  if (!forName.trim()) return;
  useNotificationsStore.getState().push({ ...input, forName });
}
