import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ForumShell } from "@/components/forum/layout";
import { SPAM_PUBLIC_EXPLAIN } from "@/lib/forum/spam";
import { SAFETY } from "@/lib/safety/content";

export const Route = createFileRoute("/guvenlik")({
  component: SafetyPage,
});

function SafetyPage() {
  return (
    <ForumShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Güvenlik merkezi
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            {SAFETY.title}
          </h1>
          <p className="mt-1 text-sm text-muted">{SAFETY.tagline}</p>
        </header>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5">
          <h2 className="mb-3 text-sm font-semibold text-fg">İlkeler</h2>
          <ul className="space-y-3">
            {SAFETY.principles.map((p) => (
              <li key={p.title}>
                <h3 className="text-sm font-medium text-fg">{p.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted sm:text-sm">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5">
          <h2 className="mb-1 text-sm font-semibold text-fg">
            {SPAM_PUBLIC_EXPLAIN.title}
          </h2>
          <p className="mb-4 text-xs text-muted">{SPAM_PUBLIC_EXPLAIN.honesty}</p>
          <ol className="space-y-3">
            {SPAM_PUBLIC_EXPLAIN.layers.map((l) => (
              <li
                key={l.id}
                className="rounded-md border border-border bg-bg-elevated px-3 py-2.5"
              >
                <div className="text-[10px] font-bold tracking-wide text-primary uppercase">
                  {l.id} · {l.name}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {l.detail}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5">
          <h2 className="mb-3 text-sm font-semibold text-fg">
            Üyelere pratik öneriler
          </h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">
            {SAFETY.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-primary/20 bg-primary-soft/50 p-4 text-sm">
          <p className="text-fg">
            İçerik bildirmek için konu veya ilan sayfasındaki{" "}
            <strong>Bildir</strong> düğmesini kullanın. Kurallar:{" "}
            <Link to="/kurallar" className="font-medium text-primary hover:underline">
              Platform Kullanım Kuralları
            </Link>
            . İletişim:{" "}
            <a
              href="mailto:info@konyago.com.tr"
              className="font-medium text-primary hover:underline"
            >
              info@konyago.com.tr
            </a>
          </p>
        </section>
      </div>
    </ForumShell>
  );
}
