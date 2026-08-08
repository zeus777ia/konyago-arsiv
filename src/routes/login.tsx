import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { SITE } from "@/lib/forum/data";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 pt-[var(--grok-banner-h,0px)]">
      <div className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {SITE.name}
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-fg">
            Giriş yap
          </h1>
          <p className="text-sm text-muted">
            Konu açmak ve cevap yazmak için hesabınıza giriş yapabilirsiniz.
          </p>
        </div>

        {authEnabled ? (
          <div className="space-y-2">
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
        ) : (
          <p className="text-sm text-muted">Giriş şu an kapalı.</p>
        )}

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-3.5" />
          Foruma dön
        </Link>
      </div>
    </main>
  );
}
