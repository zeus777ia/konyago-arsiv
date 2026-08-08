import { applySnapshot, collectLocalSnapshot } from "./collect";
import { emptySnapshot, mergeSnapshots } from "./merge";
import { getPreferredTransport, remotePull, remotePush } from "./remote";
import {
  SYNC_LOCAL_DIRTY_KEY,
  SYNC_LOCAL_REV_KEY,
  type CloudSnapshot,
} from "./types";
import { useForumStore } from "@/lib/forum/store";
import { useMembersStore } from "@/lib/members/store";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";
import { useReportsStore } from "@/lib/reports/store";
import { useNotificationsStore } from "@/lib/notifications/store";
import { useSiteMetaStore } from "@/lib/site/announcements";

export type SyncState = {
  status: "idle" | "syncing" | "ok" | "error" | "offline";
  transport: string;
  lastSyncedAt: string | null;
  lastError: string | null;
  rev: number;
};

type Listener = (s: SyncState) => void;

let state: SyncState = {
  status: "idle",
  transport: "none",
  lastSyncedAt: null,
  lastError: null,
  rev: 0,
};

const listeners = new Set<Listener>();
let timer: ReturnType<typeof setInterval> | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let busy = false;
let started = false;
let suppressDirtyUntil = 0;

function emit() {
  for (const l of listeners) l(state);
}

function setState(partial: Partial<SyncState>) {
  state = { ...state, ...partial };
  emit();
}

function readRev(): number {
  try {
    return Number(localStorage.getItem(SYNC_LOCAL_REV_KEY) || "0") || 0;
  } catch {
    return 0;
  }
}

function writeRev(rev: number) {
  try {
    localStorage.setItem(SYNC_LOCAL_REV_KEY, String(rev));
  } catch {
    /* */
  }
  setState({ rev });
}

function markDirty() {
  if (Date.now() < suppressDirtyUntil) return;
  try {
    localStorage.setItem(SYNC_LOCAL_DIRTY_KEY, "1");
  } catch {
    /* */
  }
  schedulePush();
}

function clearDirty() {
  try {
    localStorage.removeItem(SYNC_LOCAL_DIRTY_KEY);
  } catch {
    /* */
  }
}

function isDirty() {
  try {
    return localStorage.getItem(SYNC_LOCAL_DIRTY_KEY) === "1";
  } catch {
    return false;
  }
}

export function getSyncState() {
  return state;
}

export function subscribeSync(fn: Listener): () => void {
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
  };
}

export function schedulePush(delayMs = 1200) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    void runSync("push");
  }, delayMs);
}

export async function runSync(
  reason: "start" | "pull" | "push" | "interval" = "interval",
) {
  if (typeof window === "undefined") return;
  if (busy) return;
  busy = true;
  setState({ status: "syncing", lastError: null });

  try {
    const pulled = await remotePull();
    setState({ transport: pulled.transport });

    const local = collectLocalSnapshot();
    let rev = readRev();

    if (pulled.data) {
      const merged = mergeSnapshots(local, pulled.data);
      suppressDirtyUntil = Date.now() + 2500;
      applySnapshot(merged);
      rev = Math.max(rev, pulled.rev);
      writeRev(rev);
    }

    const shouldPush =
      reason === "push" ||
      reason === "start" ||
      isDirty() ||
      !pulled.data ||
      reason === "interval";

    if (shouldPush) {
      const toSend: CloudSnapshot = {
        ...collectLocalSnapshot(),
        updatedAt: new Date().toISOString(),
      };
      const pushed = await remotePush(toSend, rev);
      suppressDirtyUntil = Date.now() + 2500;
      applySnapshot(pushed.data);
      writeRev(pushed.rev);
      clearDirty();
      setState({
        status: "ok",
        transport: pushed.transport,
        lastSyncedAt: new Date().toISOString(),
        lastError: null,
        rev: pushed.rev,
      });
    } else {
      setState({
        status: "ok",
        transport: pulled.transport,
        lastSyncedAt: new Date().toISOString(),
        lastError: null,
      });
    }
  } catch (e) {
    setState({
      status: "error",
      lastError: e instanceof Error ? e.message : "Senkron hatası",
      transport: getPreferredTransport(),
    });
  } finally {
    busy = false;
  }
}

export function startSyncEngine() {
  if (typeof window === "undefined" || started) return;
  started = true;
  setState({ rev: readRev() });

  void runSync("start");

  timer = setInterval(() => {
    void runSync("interval");
  }, 12_000);

  window.addEventListener("storage", (ev) => {
    if (!ev.key) return;
    if (
      ev.key.startsWith("konyago-arsiv-") ||
      ev.key === SYNC_LOCAL_DIRTY_KEY
    ) {
      void runSync("pull");
    }
  });

  const dirty = () => markDirty();
  let forumSig = "";
  useForumStore.subscribe((s) => {
    const sig = `${s.threads.length}:${s.posts.length}:${s.threads.map((t) => t.id + t.lastPostAt + t.status).join(",")}`;
    if (sig !== forumSig) {
      forumSig = sig;
      dirty();
    }
  });
  let memN = -1;
  useMembersStore.subscribe((s) => {
    if (s.members.length !== memN) {
      memN = s.members.length;
      dirty();
    }
  });
  let mN = -1;
  useMarketplaceStore.subscribe((s) => {
    if (s.listings.length !== mN) {
      mN = s.listings.length;
      dirty();
    }
  });
  let jN = -1;
  useJobsStore.subscribe((s) => {
    if (s.jobs.length !== jN) {
      jN = s.jobs.length;
      dirty();
    }
  });
  let rN = -1;
  useReportsStore.subscribe((s) => {
    if (s.reports.length !== rN) {
      rN = s.reports.length;
      dirty();
    }
  });
  let nN = -1;
  useNotificationsStore.subscribe((s) => {
    if (s.items.length !== nN) {
      nN = s.items.length;
      dirty();
    }
  });
  let siteSig = "";
  useSiteMetaStore.subscribe((s) => {
    const sig = `${s.bannerText}|${s.featuredThreadId}|${s.bannerActive}`;
    if (sig !== siteSig) {
      siteSig = sig;
      dirty();
    }
  });

  window.addEventListener("online", () => void runSync("pull"));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void runSync("pull");
  });
}

export function stopSyncEngine() {
  if (timer) clearInterval(timer);
  timer = null;
  started = false;
}

void emptySnapshot;
