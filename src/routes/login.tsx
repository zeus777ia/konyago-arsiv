import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/forum/data";
import {
  loginMember,
  registerMember,
  requestPasswordReset,
  resetPasswordWithCode,
} from "@/lib/members/store";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({ component: Login });

type Tab = "giris" | "kayit" | "sifre";

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("giris");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStep, setResetStep] = useState<"email" | "code">("email");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
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
    if (!acceptedLegal) {
      toast.error("KVKK ve gizlilik metinlerini onaylayın");
      return;
    }
    setBusy(true);
    try {
      const res = await registerMember({ email, password, displayName });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Hesap oluşturuldu — hoş geldin e-postası gönderildi");
      void navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  };

  const onRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await requestPasswordReset(email);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.message);
      setResetStep("code");
    } finally {
      setBusy(false);
    }
  };

  const onConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await resetPasswordWithCode({
        email,
        code,
        newPassword,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Şifren güncellendi — giriş yapabilirsin");
      setPassword("");
      setCode("");
      setNewPassword("");
      setResetStep("email");
      setTab("giris");
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

        <div className="grid grid-cols-3 gap-1 rounded-lg bg-bg-elevated p-1">
          {(
            [
              ["giris", "Giriş"],
              ["kayit", "Kayıt"],
              ["sifre", "Şifre"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                if (id === "sifre") setResetStep("email");
              }}
              className={cn(
                "h-9 rounded-md text-xs font-medium transition-colors sm:text-sm",
                tab === id
                  ? "bg-surface text-fg shadow-sm"
                  : "text-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "giris" && (
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
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={() => {
                setTab("sifre");
                setResetStep("email");
              }}
            >
              Şifremi unuttum
            </button>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Giriş yap
            </Button>
          </form>
        )}

        {tab === "kayit" && (
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
            <label className="flex items-start gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={acceptedLegal}
                onChange={(e) => setAcceptedLegal(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <Link to="/kvkk" className="text-primary hover:underline">
                  KVKK
                </Link>
                ,{" "}
                <Link to="/gizlilik" className="text-primary hover:underline">
                  Gizlilik
                </Link>{" "}
                ve{" "}
                <Link
                  to="/yasal-uyari"
                  className="text-primary hover:underline"
                >
                  Yasal uyarı
                </Link>{" "}
                metinlerini okudum; bu sitenin resmî bir kurum sitesi olmadığını
                kabul ediyorum. Hoş geldin e-postasının{" "}
                <strong className="text-fg">info@konyago.com.tr</strong>{" "}
                üzerinden gönderilmesini onaylıyorum.
              </span>
            </label>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Kayıt ol
            </Button>
          </form>
        )}

        {tab === "sifre" && resetStep === "email" && (
          <form onSubmit={onRequestReset} className="space-y-3">
            <p className="text-xs leading-relaxed text-muted">
              Kayıtlı e-posta adresine 6 haneli sıfırlama kodu gönderilir
              (gönderen / yanıt: info@konyago.com.tr). Spam klasörünü de
              kontrol et.
            </p>
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
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Sıfırlama kodu gönder
            </Button>
          </form>
        )}

        {tab === "sifre" && resetStep === "code" && (
          <form onSubmit={onConfirmReset} className="space-y-3">
            <p className="text-xs leading-relaxed text-muted">
              E-postandaki 6 haneli kodu ve yeni şifreni gir. Kod 30 dakika
              geçerlidir.
            </p>
            <Field label="E-posta">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Doğrulama kodu">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={inputCls}
                placeholder="6 haneli kod"
              />
            </Field>
            <Field label="Yeni şifre">
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputCls}
                placeholder="En az 6 karakter"
              />
            </Field>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Şifreyi güncelle
            </Button>
            <button
              type="button"
              className="w-full text-xs text-muted hover:text-fg"
              onClick={() => setResetStep("email")}
            >
              Kodu tekrar gönder
            </button>
          </form>
        )}

        {authEnabled && GROK_PROVIDERS.length > 0 && tab === "giris" && (
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

        <div className="space-y-2 border-t border-border pt-4 text-center text-[11px] text-subtle">
          <p>
            Resmî kurum sitesi değildir.{" "}
            <Link to="/yasal-uyari" className="text-primary hover:underline">
              Yasal uyarı
            </Link>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/kvkk" className="hover:text-primary hover:underline">
              KVKK
            </Link>
            <span>·</span>
            <Link to="/gizlilik" className="hover:text-primary hover:underline">
              Gizlilik
            </Link>
          </div>
        </div>

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
