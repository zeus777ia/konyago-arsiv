import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
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

export const Route = createFileRoute("/moderasyon")({
  component: ModerationPage,
});

function ModerationPage() {
  const user = useCurrentUser();
  const founder = isFounder(user);
  const threads = useForumStore((s) => s.threads);
  const names = useForumStore((s) => s.names);
  const approveThread = useForumStore((s) => s.approveThread);
  const rejectThread = useForumStore((s) => s.rejectThread);
  const deleteThread = useForumStore((s) => s.deleteThread);

  if (!founder) {
    return <Navigate to="/" />;
  }

  const pending = threads
    .filter((t) => t.status === "pending")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <h1 className="mb-1 text-xl font-semibold tracking-tight">
        Moderasyon kuyruğu
      </h1>
      <p className="mb-5 text-sm text-muted">
        İncelemedeki konuları onaylayın veya reddedin. Kurallara aykırı içerik
        zaten otomatik engellenir.
      </p>

      {pending.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-4 py-10 text-center text-sm text-muted shadow-card">
          İncelemede bekleyen konu yok.
        </div>
      ) : (
        <ul className="space-y-3">
          {pending.map((t) => {
            const cat = getCategory(t.categoryId);
            return (
              <li
                key={t.id}
                className="rounded-lg border border-border bg-surface p-4 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
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
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        approveThread(t.id);
                        toast.success("Konu onaylandı");
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
                        rejectThread(t.id, "Kurallara aykırı / uygun değil");
                        toast.message("Konu reddedildi");
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
    </ForumShell>
  );
}
