import { getSql } from "@/lib/db";
import {
  CLOUD_DOC_KEY,
  type CloudSnapshot,
  type SyncPullResponse,
  type SyncPushResponse,
} from "./types";
import { emptySnapshot, mergeSnapshots } from "./merge";

const globalRef = globalThis as typeof globalThis & {
  __cloudSchemaPromise__?: Promise<void>;
};

async function ensureSchema() {
  globalRef.__cloudSchemaPromise__ ??= (async () => {
    const sql = await getSql();
    await sql.query(`
      CREATE TABLE IF NOT EXISTS cloud_docs (
        doc_key TEXT PRIMARY KEY,
        payload JSONB NOT NULL DEFAULT '{}'::jsonb,
        rev BIGINT NOT NULL DEFAULT 1,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
  })().catch((err) => {
    globalRef.__cloudSchemaPromise__ = undefined;
    throw err;
  });
  return globalRef.__cloudSchemaPromise__;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function parsePayload(raw: unknown): CloudSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as CloudSnapshot;
  if (o.v !== 1) return null;
  return o;
}

export async function handleSync(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return json({ ok: true });
  }

  try {
    await ensureSchema();
    const sql = await getSql();

    if (request.method === "GET") {
      const rows = await sql.query<{
        payload: unknown;
        rev: number;
        updated_at: string;
      }>(
        `SELECT payload, rev, updated_at FROM cloud_docs WHERE doc_key = $1`,
        [CLOUD_DOC_KEY],
      );
      const row = rows[0];
      const body: SyncPullResponse = {
        ok: true,
        rev: row ? Number(row.rev) : 0,
        updatedAt: row?.updated_at ?? new Date(0).toISOString(),
        data: row ? parsePayload(row.payload) : null,
      };
      return json(body);
    }

    if (request.method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "Geçersiz JSON" } satisfies SyncPushResponse, 400);
      }
      const client = body as {
        data?: CloudSnapshot;
        baseRev?: number;
        deviceId?: string;
      };
      if (!client.data || client.data.v !== 1) {
        return json(
          { ok: false, error: "Geçersiz senkron verisi" } satisfies SyncPushResponse,
          400,
        );
      }

      const rows = await sql.query<{
        payload: unknown;
        rev: number;
        updated_at: string;
      }>(
        `SELECT payload, rev, updated_at FROM cloud_docs WHERE doc_key = $1`,
        [CLOUD_DOC_KEY],
      );
      const existing = rows[0];
      const remote = existing
        ? parsePayload(existing.payload) ?? emptySnapshot()
        : emptySnapshot();
      const merged = mergeSnapshots(client.data, remote);
      merged.updatedAt = new Date().toISOString();
      const nextRev = existing ? Number(existing.rev) + 1 : 1;

      await sql.query(
        `INSERT INTO cloud_docs (doc_key, payload, rev, updated_at)
         VALUES ($1, $2::jsonb, $3, now())
         ON CONFLICT (doc_key) DO UPDATE SET
           payload = EXCLUDED.payload,
           rev = EXCLUDED.rev,
           updated_at = now()`,
        [CLOUD_DOC_KEY, JSON.stringify(merged), nextRev],
      );

      const res: SyncPushResponse = {
        ok: true,
        rev: nextRev,
        updatedAt: merged.updatedAt,
        data: merged,
      };
      return json(res);
    }

    return json({ ok: false, error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("[sync]", err);
    return json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Senkron hatası",
      } satisfies SyncPushResponse,
      500,
    );
  }
}
