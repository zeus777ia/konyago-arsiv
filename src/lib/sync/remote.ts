/**
 * Remote transports for cloud sync.
 *
 * 1) Same-origin `/api/sync` (Postgres — Neon or PGLite) — preferred when API exists
 * 2) Optional absolute `VITE_SYNC_API_URL`
 * 3) JSONBlob public store (works on pure static GitHub Pages; CORS open)
 *
 * JSONBlob bins expire ~24h on free tier — we auto-recreate and persist the
 * pointer in localStorage + optional public/sync-config.json.
 */

import type { CloudSnapshot, SyncPullResponse, SyncPushResponse } from "./types";

const JSONBLOB_BASE = "https://jsonblob.com/api/jsonBlob";
const POINTER_LS_KEY = "konyago-arsiv-jsonblob-id";

export type SyncTransport = "api" | "jsonblob" | "none";

export type RemoteStatus = {
  transport: SyncTransport;
  online: boolean;
  lastError?: string;
  blobId?: string;
};

function envSyncBase(): string | undefined {
  try {
    const v = (import.meta as ImportMeta & { env?: Record<string, string> }).env
      ?.VITE_SYNC_API_URL;
    return v && v.length > 0 ? v.replace(/\/$/, "") : undefined;
  } catch {
    return undefined;
  }
}

function apiCandidates(): string[] {
  const out: string[] = [];
  const env = envSyncBase();
  if (env) out.push(`${env}/api/sync`);
  if (typeof window !== "undefined") {
    out.push(`${window.location.origin}/api/sync`);
  }
  return out;
}

async function tryApiPull(): Promise<{
  ok: true;
  rev: number;
  data: CloudSnapshot | null;
  url: string;
} | null> {
  for (const url of apiCandidates()) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const body = (await res.json()) as SyncPullResponse;
      if (!body?.ok) continue;
      return { ok: true, rev: body.rev, data: body.data, url };
    } catch {
      /* try next */
    }
  }
  return null;
}

async function tryApiPush(
  data: CloudSnapshot,
  baseRev: number,
): Promise<{ ok: true; rev: number; data: CloudSnapshot; url: string } | null> {
  for (const url of apiCandidates()) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ data, baseRev }),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as SyncPushResponse;
      if (!body.ok || !body.data) continue;
      return { ok: true, rev: body.rev, data: body.data, url };
    } catch {
      /* try next */
    }
  }
  return null;
}

function readBlobId(): string | null {
  try {
    return localStorage.getItem(POINTER_LS_KEY);
  } catch {
    return null;
  }
}

function writeBlobId(id: string) {
  try {
    localStorage.setItem(POINTER_LS_KEY, id);
  } catch {
    /* ignore */
  }
}

async function loadPointerFromSite(): Promise<string | null> {
  try {
    const res = await fetch("/sync-config.json", { cache: "no-store" });
    if (!res.ok) return null;
    const j = (await res.json()) as { jsonblobId?: string };
    return j.jsonblobId || null;
  } catch {
    return null;
  }
}

async function createBlob(data: CloudSnapshot): Promise<string> {
  const res = await fetch(JSONBLOB_BASE, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("JSONBlob oluşturulamadı");
  const loc =
    res.headers.get("location") ||
    res.headers.get("Location") ||
    res.headers.get("x-jsonblob-id");
  if (!loc) throw new Error("JSONBlob id alınamadı");
  const id = loc.includes("/")
    ? loc.split("/").filter(Boolean).pop()!
    : loc;
  writeBlobId(id);
  return id;
}

async function getBlob(id: string): Promise<CloudSnapshot | null> {
  const res = await fetch(`${JSONBLOB_BASE}/${id}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`JSONBlob okunamadı (${res.status})`);
  const data = (await res.json()) as CloudSnapshot;
  return data?.v === 1 ? data : null;
}

async function putBlob(id: string, data: CloudSnapshot): Promise<boolean> {
  const res = await fetch(`${JSONBLOB_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.ok;
}

let preferred: SyncTransport = "none";
let lastApiUrl: string | null = null;

export function getPreferredTransport(): SyncTransport {
  return preferred;
}

export async function remotePull(): Promise<{
  transport: SyncTransport;
  rev: number;
  data: CloudSnapshot | null;
}> {
  const api = await tryApiPull();
  if (api) {
    preferred = "api";
    lastApiUrl = api.url;
    return { transport: "api", rev: api.rev, data: api.data };
  }

  // JSONBlob path
  preferred = "jsonblob";
  let id = readBlobId() || (await loadPointerFromSite());
  if (!id) {
    return { transport: "jsonblob", rev: 0, data: null };
  }
  writeBlobId(id);
  try {
    const data = await getBlob(id);
    if (!data) {
      // expired
      try {
        localStorage.removeItem(POINTER_LS_KEY);
      } catch {
        /* */
      }
      return { transport: "jsonblob", rev: 0, data: null };
    }
    const rev = +new Date(data.updatedAt || 0);
    return { transport: "jsonblob", rev, data };
  } catch (e) {
    throw e;
  }
}

export async function remotePush(
  data: CloudSnapshot,
  baseRev: number,
): Promise<{ transport: SyncTransport; rev: number; data: CloudSnapshot }> {
  const api = await tryApiPush(data, baseRev);
  if (api) {
    preferred = "api";
    lastApiUrl = api.url;
    return { transport: "api", rev: api.rev, data: api.data };
  }

  preferred = "jsonblob";
  let id = readBlobId() || (await loadPointerFromSite());
  if (!id) {
    id = await createBlob(data);
    return { transport: "jsonblob", rev: +new Date(data.updatedAt), data };
  }
  const ok = await putBlob(id, data);
  if (!ok) {
    // recreate
    id = await createBlob(data);
  }
  return {
    transport: "jsonblob",
    rev: +new Date(data.updatedAt),
    data,
  };
}

export function getLastApiUrl() {
  return lastApiUrl;
}
