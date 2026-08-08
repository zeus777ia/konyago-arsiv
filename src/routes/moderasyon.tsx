import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Check, Shield, X } from "lucide-react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { UserName } from "@/components/forum/user-name";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/lib/forum/data";
import { displayName } from "@/lib/forum/names";
import { useForumStore } from "@/lib/forum/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";
import { formatRelative } from "@/lib/utils";
import { useReportsStore } from "@/lib/reports/store";
import { SAFETY } from "@/lib/safety/content";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/moderasyon")({
  head: () =>
    seoHead({
      title: 'Moderasyon',
      description: 'Moderasyon paneli.',
      path: '/moderasyon', noIndex: true,
    }),
  component: ModerationPage,
});

function ModerationPage() {
  const user = useCurrentUser();
  const founder = isFounder(user);
  const threads = useForumStore((s) => s.threads);
  const names = useForumStore((s) => s.names);
  const posts = useForumStore((s) => s.posts);
  const approveThread = useForumStore((s) => s.approveThread);
  const rejectThread = useForumStore((s) => s.rejectThread);
  const deleteThread = useForumStore((s) => s.deleteThread);
  const reports = useReportsStore((s) => s.reports);
  const markReviewed = useReportsStore((s) => s.markReviewed);

  if (!founder) {
    return <Navigate to="/" />;
  }

  const pending = threads
    .filter((t) => t.status === "pending")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const openReports = reports.filter((r) => r.status === "open");
  const rejected = threads.filter((t) => t.status === "rejected").length;
  const approved = threads.filter(
    (t) => !t.status || t.status === "approved",
  ).length;

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Moderasyon merkezi
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            İnceleme kuyruğu, kullanıcı bildirimleri ve onay süreci.
          </p>
        </div>
        <div className="flex gap-2 text-center text-xs">
          <StatChip label="Bekleyen" value={pending.length} accent />
          <StatChip label="Bildirim" value={openReports.length} accent />
          <StatChip label="Yayında" value={approved} />
          <StatChip label="Red" value={rejected} />
        </div>
      </div>

      <section className="mb-6 rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
          <Shield className="size-4 text-primary" />
          Onay süreci (adım adım)
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "1",
              t: "Gönderim",
              d: "Üye giriş yapar; honeypot + form süresi kontrol edilir.",
            },
            {
              n: "2",
              t: "8 katman spam + içerik filtresi",
              d: "Risk skoru, kalıp, benzerlik, hız limitleri; +18/küfür/telif ayrı engellenir.",
            },
            {
              n: "3",
              t: "İncelemede",
              d: "Listelerde gizli; yazar ve kurucu görür. Cevap kapalı.",
            },
            {
              n: "4",
              t: "Karar",
              d: "Onayla → yayında. Reddet → kilit. Sil → kalıcı. Bildirimler ayrı incelenir.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-md border border-border bg-bg-elevated px-3 py-2.5"
            >
              <div className="text-[10px] font-bold tracking-wide text-primary uppercase">
                Adım {s.n}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-fg">{s.t}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <h2 className="mb-3 text-sm font-semibold text-fg">
        Bekleyen konular ({pending.length})
      </h2>

      {pending.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted shadow-card">
          İncelemede bekleyen konu yok.
        </div>
      ) : (
        <ul className="space-y-3">
          {pending.map((t) => {
            const cat = getCategory(t.categoryId);
            const first = posts.find((p) => p.threadId === t.id);
            return (
              <li
                key={t.id}
                className="rounded-lg border border-border bg-surface p-4 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/konu/$threadId"
                      params={{ threadId: t.id }}
                      className="text-sm font-semibold text-fg hover:text-primary"
                    >
                      {t.title}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-subtle">
                      <span>{cat?.name}</span>
                      <span>·</span>
                      <UserName
                        name={displayName(t.authorId, names)}
                        size="sm"
                      />
                      <span>· {formatRelative(t.createdAt)}</span>
                    </p>
                    {first && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                        {first.body}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        approveThread(t.id);
                        toast.success("Onaylandı — konu yayında");
                      }}
                    >
                      <Check className="size-3.5" />
                      Onayla
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-danger"
                      onClick={() => {
                        rejectThread(
                          t.id,
                          "Moderasyon: Kurallara uygun bulunmadı",
                        );
                        toast.message("Reddedildi ve kilitlendi");
                      }}
                    >
                      <X className="size-3.5" />
                      Reddet
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (!confirm("Kalıcı silinsin mi?")) return;
                        deleteThread(t.id);
                        toast.success("Silindi");
                      }}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-8 mb-3 text-sm font-semibold text-fg">
        Kullanıcı bildirimleri ({openReports.length} açık)
      </h2>
      {openReports.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted shadow-card">
          Açık bildirim yok.
        </div>
      ) : (
        <ul className="space-y-2">
          {openReports.map((r) => {
            const reasonLabel =
              SAFETY.reportReasons.find((x) => x.id === r.reason)?.label ??
              r.reason;
            return (
              <li
                key={r.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-surface p-3 shadow-card"
              >
                <div className="min-w-0 text-xs">
                  <p className="font-semibold text-fg">
                    {r.targetType} · {r.targetId}
                  </p>
                  <p className="mt-0.5 text-muted">
                    {reasonLabel} · {r.reporterName} ·{" "}
                    {formatRelative(r.createdAt)}
                  </p>
                  {r.detail && (
                    <p className="mt-1 text-subtle">{r.detail}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    markReviewed(r.id);
                    toast.message("Bildirim incelendi olarak işaretlendi");
                  }}
                >
                  İncelendi
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </ForumShell>
  );
}

function StatChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "min-w-[4.5rem] rounded-md bg-amber-100 px-2.5 py-1.5"
          : "min-w-[4.5rem] rounded-md bg-bg-elevated px-2.5 py-1.5"
      }
    >
      <div className="text-[10px] text-subtle uppercase">{label}</div>
      <div className="text-sm font-bold tabular-nums text-fg">{value}</div>
    </div>
  );
}
