import { Link } from "@tanstack/react-router";
import { Megaphone, Scale, Sparkles } from "lucide-react";
import { HOME_OFFICIAL_HIGHLIGHTS, RULES_UPDATED } from "@/lib/forum/rules-content";

/**
 * Ana sayfa: Resmi bölümün yerine dikkat çekici duyuru + kurallar paneli
 */
export function OfficialSpotlight() {
  return (
    <section
      className="official-spotlight relative overflow-hidden rounded-xl border border-primary/30 shadow-card"
      aria-label="Duyurular ve Kurallar"
    >
      <div className="official-spotlight-glow pointer-events-none absolute inset-0" />

      <header className="relative flex flex-wrap items-center gap-2 border-b border-white/10 bg-header px-3 py-2.5 sm:px-4">
        <span className="official-pulse-dot size-2.5 rounded-full bg-emerald-300/90" />
        <Megaphone className="size-4 text-emerald-200/90" />
        <h2 className="official-blink-title font-display text-sm font-semibold tracking-wide text-header-fg sm:text-base">
          Duyurular & Kurallar
        </h2>
        <span className="official-badge-blink ml-auto rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-header">
          RESMÎ
        </span>
      </header>

      <div className="relative grid gap-0 md:grid-cols-2">
        <Link
          to="/konu/$threadId"
          params={{ threadId: "official_announcement" }}
          className="group border-b border-border/80 bg-surface/90 p-4 transition-colors hover:bg-primary-soft/50 md:border-r md:border-b-0"
        >
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="size-4 text-accent official-icon-pulse" />
            <span className="text-xs font-bold tracking-wide text-accent uppercase">
              Duyuru
            </span>
          </div>
          <h3 className="text-sm font-semibold text-fg group-hover:text-primary">
            Site açılışı ve işleyiş
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Moderasyon onayı, spam koruması ve yasak içerikler hakkında kısa
            bilgilendirme. Tıklayarak tam metni okuyun.
          </p>
          <span className="official-blink-link mt-3 inline-block text-xs font-semibold text-primary">
            Duyuruyu oku →
          </span>
        </Link>

        <Link
          to="/konu/$threadId"
          params={{ threadId: "official_rules" }}
          className="group bg-surface/90 p-4 transition-colors hover:bg-primary-soft/50"
        >
          <div className="mb-2 flex items-center gap-2">
            <Scale className="size-4 text-primary official-icon-pulse" />
            <span className="text-xs font-bold tracking-wide text-primary uppercase">
              Kurallar
            </span>
          </div>
          <h3 className="text-sm font-semibold text-fg group-hover:text-primary">
            Platform Kullanım Kuralları
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Üyelik, yasak içerik, spam koruması, moderasyon süreci ve yaptırımlar.
            Yürürlük: {RULES_UPDATED}.
          </p>
          <span className="official-blink-link mt-3 inline-block text-xs font-semibold text-primary">
            Kuralları oku →
          </span>
        </Link>
      </div>

      <ul className="relative space-y-1.5 border-t border-border bg-bg-elevated/90 px-3 py-3 sm:px-4">
        {HOME_OFFICIAL_HIGHLIGHTS.map((line) => (
          <li
            key={line}
            className="flex gap-2 text-[11px] leading-snug text-fg sm:text-xs"
          >
            <span className="official-pulse-dot mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface/80 px-3 py-2.5 sm:px-4">
        <p className="text-[11px] text-muted">
          Bu bölümde yalnızca resmî duyuru ve kurallar yer alır; üye konusu
          açılamaz.
        </p>
        <Link
          to="/kurallar"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg shadow-sm transition-colors hover:bg-primary-hover"
        >
          Tüm kurallar
        </Link>
      </div>
    </section>
  );
}
