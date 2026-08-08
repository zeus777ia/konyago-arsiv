import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SITE } from "@/lib/forum/data";
import { DISCLAIMER_SHORT, LEGAL } from "@/lib/legal/content";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border bg-header text-header-fg">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-header-muted hover:text-header-fg"
          >
            <ArrowLeft className="size-4" />
            Ana sayfa
          </Link>
          <span className="ml-auto text-sm font-semibold">{SITE.name}</span>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm leading-relaxed text-fg">
          <strong className="font-semibold">Önemli uyarı: </strong>
          {DISCLAIMER_SHORT}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-xs text-subtle">
          Son güncelleme: {LEGAL.updatedAt} · İletişim:{" "}
          <a
            href={`mailto:${LEGAL.controller.email}`}
            className="text-primary hover:underline"
          >
            {LEGAL.controller.email}
          </a>
        </p>

        <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-fg">
          {children}
        </div>

        <nav className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6 text-xs">
          <Link to="/yasal-uyari" className="text-primary hover:underline">
            Yasal uyarı
          </Link>
          <Link to="/gizlilik" className="text-primary hover:underline">
            Gizlilik politikası
          </Link>
          <Link to="/kvkk" className="text-primary hover:underline">
            KVKK aydınlatma
          </Link>
          <Link to="/login" className="text-muted hover:underline">
            Giriş
          </Link>
        </nav>
      </article>
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-fg">{title}</h2>
      <div className="space-y-2 text-muted">{children}</div>
    </section>
  );
}
