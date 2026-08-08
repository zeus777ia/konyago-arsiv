import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/forum/data";
import {
  loginMember,
  registerMember,
} from "@/lib/members/store";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({ component: Login });

type Tab = "giris" | "kayit";

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("giris");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await loginMember({ email, password });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Hoş geldin!");
      void navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await registerMember({ email, password, displayName });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Hesap oluşturuldu");
      void navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <Toaster theme="light" position="top-center" />
      <div className="w-full max-w-md space-y-5 rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="space-y-1 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-fg">
              KA
            </span>
            <span className="text-base font-semibold text-fg">{SITE.name}</span>
          </Link>
          <p className="text-sm text-muted">Üye ol veya giriş yap</p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-lg bg-bg-elevated p-1">
          <button
            type="button"
            onClick={() => setTab("giris")}
            className={cn(
              "h-9 rounded-md text-sm font-medium transition-colors",
              tab === "giris"
                ? "bg-surface text-fg shadow-sm"
                : "text-muted hover:text-fg",
            )}
          >
            Giriş
          </button>
          <button
            type="button"
            onClick={() => setTab("kayit")}
            className={cn(
              "h-9 rounded-md text-sm font-medium transition-colors",
              tab === "kayit"
                ? "bg-surface text-fg shadow-sm"
                : "text-muted hover:text-fg",
            )}
          >
            Kayıt ol
          </button>
        </div>

        {tab === "giris" ? (
          <form onSubmit={onLogin} className="space-y-3">
            <Field label="E-posta">
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="ornek@mail.com"
              />
            </Field>
            <Field label="Şifre">
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
              />
            </Field>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Giriş yap
            </Button>
          </form>
        ) : (
          <form onSubmit={onRegister} className="space-y-3">
            <Field label="Görünen ad">
              <input
                type="text"
                autoComplete="nickname"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputCls}
                placeholder="Forumda görünecek ad"
              />
            </Field>
            <Field label="E-posta">
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="ornek@mail.com"
              />
            </Field>
            <Field label="Şifre">
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="En az 6 karakter"
              />
            </Field>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Kayıt ol
            </Button>
          </form>
        )}

        {authEnabled && GROK_PROVIDERS.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-center text-[11px] text-subtle">veya</p>
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-md border border-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-hover"
              >
                {p.label} ile devam et
              </button>
            ))}
          </div>
        )}

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-3.5" />
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
