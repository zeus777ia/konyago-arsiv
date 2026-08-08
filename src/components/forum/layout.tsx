import { Link, useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Home,
  Menu,
  PenSquare,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/forum/data";
import { DISCLAIMER_SHORT } from "@/lib/legal/content";
import { cn } from "@/lib/utils";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { SeedOfficialForum } from "@/components/forum/seed-official";
import { isFounder } from "@/lib/staff/founder";
import { useForumStore } from "@/lib/forum/store";
import { useReportsStore } from "@/lib/reports/store";
import { NotificationBell } from "@/components/forum/notification-bell";
import { FounderBanner } from "@/components/forum/founder-banner";

export function ForumShell({
  children,
  search,
  onSearch,
}: {
  children: React.ReactNode;
  search?: string;
  onSearch?: (q: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localQ, setLocalQ] = useState(search ?? "");
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const founder = isFounder(user);
  const pendingN = useForumStore(
    (s) => s.threads.filter((t) => t.status === "pending").length,
  );
  const openReports = useReportsStore(
    (s) => s.reports.filter((r) => r.status === "open").length,
  );

  const qValue = onSearch ? (search ?? "") : localQ;
  const setQ = (v: string) => {
    if (onSearch) onSearch(v);
    else setLocalQ(v);
  };

  const goSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = qValue.trim();
    if (q.length < 2) return;
    void navigate({ to: "/ara", search: { q } });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SeedOfficialForum />
      <div className="bg-header text-header-fg shadow-header">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 sm:px-4">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-header-fg hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-fg">
              KA
            </span>
            <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
              {SITE.name}
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Link to="/yeni-konu" className="hidden sm:inline-flex">
              <Button size="sm" className="gap-1.5">
                <PenSquare className="size-3.5" />
                Yeni konu
              </Button>
            </Link>
            <NotificationBell />
            {isPending ? (
              <div className="size-8 animate-pulse rounded-full bg-white/10" />
            ) : user ? (
              <UserButton />
            ) : (
              <Button variant="header" size="sm" asChild>
                <Link to="/login">Giriş / Kayıt</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-2 py-1.5 sm:px-4">
            <NavLink to="/" icon={<Home className="size-3.5" />}>
              Ana sayfa
            </NavLink>
            <NavLink to="/ikinci-el" icon={<ShoppingBag className="size-3.5" />}>
              İkinci el
            </NavLink>
            <NavLink to="/is-ilani" icon={<Briefcase className="size-3.5" />}>
              İş panosu
            </NavLink>
            <NavLink to="/kurallar" icon={<Scale className="size-3.5" />}>
              Kurallar
            </NavLink>
            <NavLink
              to="/guvenlik"
              icon={<ShieldCheck className="size-3.5" />}
              className="hidden sm:inline-flex"
            >
              Güvenlik
            </NavLink>
            {founder && (
              <NavLink to="/moderasyon" icon={<Shield className="size-3.5" />}>
                Moderasyon
                {pendingN + openReports > 0
                  ? ` (${pendingN + openReports})`
                  : ""}
              </NavLink>
            )}
            <NavLink
              to="/yeni-konu"
              icon={<PenSquare className="size-3.5" />}
              className="sm:hidden"
            >
              Yeni konu
            </NavLink>
            <form
              onSubmit={goSearch}
              className="ml-auto hidden w-full max-w-xs md:block md:w-auto md:flex-1 md:max-w-sm"
            >
              <label className="relative block">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-header-muted" />
                <input
                  type="search"
                  value={qValue}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Forum, ilan, iş ara…"
                  className="h-8 w-full rounded-md border border-white/10 bg-white/10 py-1 pr-3 pl-8 text-xs text-header-fg placeholder:text-header-muted outline-none focus:border-white/25 focus:bg-white/15"
                />
              </label>
            </form>
          </div>
        </div>
      </div>

      <FounderBanner />

      {mobileOpen && (
        <div className="border-b border-border bg-surface px-3 py-3 lg:hidden">
          <form onSubmit={goSearch}>
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={qValue}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Forum, ilan, iş ara…"
                className="h-10 w-full rounded-md border border-border bg-bg-elevated py-2 pr-3 pl-9 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </label>
          </form>
        </div>
      )}

      <div className="border-b border-accent/20 bg-accent-soft">
        <p className="mx-auto max-w-6xl px-3 py-2 text-[11px] leading-snug text-fg sm:px-4 sm:text-xs">
          <strong className="font-semibold">Uyarı: </strong>
          {DISCLAIMER_SHORT}{" "}
          <Link
            to="/yasal-uyari"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Detay
          </Link>
          {" · "}
          <Link
            to="/guvenlik"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Güvenlik
          </Link>
          {" · "}
          <Link
            to="/kurallar"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Kurallar
          </Link>
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">{children}</div>

      <footer className="mt-4 border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3 py-5 text-xs text-muted sm:px-4">
          <p className="max-w-3xl text-[11px] leading-relaxed text-subtle">
            {DISCLAIMER_SHORT} Otomatik filtre ve moderasyon riski azaltır; mutlak
            güvenlik vaat edilmez.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {SITE.name} ·{" "}
              <a
                href="mailto:info@konyago.com.tr"
                className="hover:text-primary"
              >
                info@konyago.com.tr
              </a>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/ara" className="hover:text-primary">
                Arama
              </Link>
              <Link to="/guvenlik" className="hover:text-primary">
                Güvenlik
              </Link>
              <Link to="/sss" className="hover:text-primary">
                SSS
              </Link>
              <Link to="/kurallar" className="hover:text-primary">
                Kurallar
              </Link>
              <Link to="/yasal-uyari" className="hover:text-primary">
                Yasal uyarı
              </Link>
              <Link to="/gizlilik" className="hover:text-primary">
                Gizlilik
              </Link>
              <Link to="/kvkk" className="hover:text-primary">
                KVKK
              </Link>
              <Link to="/hesabim" className="hover:text-primary">
                Hesabım
              </Link>
              <a
                href="https://konyago.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                konyago.com.tr
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  to,
  children,
  icon,
  className,
}: {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-header-muted transition-colors hover:bg-white/10 hover:text-header-fg",
        className,
      )}
      activeProps={{
        className:
          "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium bg-white/15 text-header-fg",
      }}
    >
      {icon}
      {children}
    </Link>
  );
}
