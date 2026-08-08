import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { UserName } from "@/components/forum/user-name";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useMembersStore } from "@/lib/members/store";
import { isFounder } from "@/lib/staff/founder";
import { useForumStore } from "@/lib/forum/store";

export const Route = createFileRoute("/hesabim")({
  component: AccountPage,
});

function AccountPage() {
  const user = useCurrentUser();
  const updateProfile = useMembersStore((s) => s.updateProfile);
  const [name, setName] = useState(user?.displayName ?? "");
  const names = useForumStore((s) => s.names);
  const threads = useForumStore((s) => s.threads);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const founder = isFounder(user);
  const myThreads = threads.filter(
    (t) => names[t.authorId] === user.displayName,
  );

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <div className="mx-auto max-w-lg space-y-5">
        <h1 className="text-xl font-semibold tracking-tight">Hesabım</h1>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-xs text-subtle">Görünen ad</p>
          <div className="mt-1">
            <UserName name={user.displayName ?? "Üye"} size="lg" />
          </div>
          <p className="mt-2 text-sm text-muted">{user.primaryEmail}</p>
          {founder && (
            <p className="mt-2 text-xs font-medium text-primary">
              Kurucu yetkileri aktif.
            </p>
          )}
        </section>

        {user.isLocalMember && (
          <form
            className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-card"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim().length < 2) {
                toast.error("Ad en az 2 karakter");
                return;
              }
              updateProfile(name);
              toast.success("Profil güncellendi");
            }}
          >
            <label className="block text-xs font-medium text-muted">
              Görünen adı düzenle
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm"
              />
            </label>
            <p className="text-[11px] text-subtle">
              Kurucu rozeti ve yetkiler görünen ada bağlıdır (
              <strong>KonyaGoArşiv</strong>).
            </p>
            <Button type="submit" size="sm">
              Kaydet
            </Button>
          </form>
        )}

        <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <h2 className="text-sm font-semibold">Konularım ({myThreads.length})</h2>
          {myThreads.length === 0 ? (
            <p className="mt-2 text-xs text-muted">Henüz konu açmadınız.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {myThreads.slice(0, 8).map((t) => (
                <li key={t.id}>
                  <Link
                    to="/konu/$threadId"
                    params={{ threadId: t.id }}
                    className="text-sm text-primary hover:underline"
                  >
                    {t.title}
                    {t.status === "pending" ? " (incelemede)" : ""}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="text-center text-xs text-subtle">
          <Link to="/guvenlik" className="text-primary hover:underline">
            Güvenlik merkezi
          </Link>
          {" · "}
          <Link to="/sss" className="text-primary hover:underline">
            SSS
          </Link>
        </p>
      </div>
    </ForumShell>
  );
}
