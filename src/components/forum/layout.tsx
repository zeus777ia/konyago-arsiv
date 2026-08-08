import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Home,
  Menu,
  PenSquare,
  Search,
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
  const { user, isPending } = useCurrentUserState();

  return (
    <div className="min-h-dvh bg-bg text-fg">
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
            <NavLink
              to="/yeni-konu"
              icon={<PenSquare className="size-3.5" />}
              className="sm:hidden"
            >
              Yeni konu
            </NavLink>
            <div className="ml-auto hidden w-full max-w-xs md:block md:w-auto md:flex-1 md:max-w-sm">
              <label className="relative block">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-header-muted" />
                <input
                  type="search"
                  value={search ?? ""}
                  onChange={(e) => onSearch?.(e.target.value)}
                  placeholder="Ara…"
                  className="h-8 w-full rounded-md border border-white/10 bg-white/10 py-1 pr-3 pl-8 text-xs text-header-fg placeholder:text-header-muted outline-none focus:border-white/25 focus:bg-white/15"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-border bg-surface px-3 py-3 lg:hidden">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={search ?? ""}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Ara…"
              className="h-10 w-full rounded-md border border-border bg-bg-elevated py-2 pr-3 pl-9 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </label>
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
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">{children}</div>

      <footer className="mt-4 border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3 py-5 text-xs text-muted sm:px-4">
          <p className="max-w-3xl leading-relaxed text-[11px] text-subtle">
            {DISCLAIMER_SHORT}
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
              <Link to="/yasal-uyari" className="hover:text-primary">
                Yasal uyarı
              </Link>
              <Link to="/gizlilik" className="hover:text-primary">
                Gizlilik
              </Link>
              <Link to="/kvkk" className="hover:text-primary">
                KVKK
              </Link>
              <Link to="/ikinci-el" className="hover:text-primary">
                İkinci el
              </Link>
              <Link to="/is-ilani" className="hover:text-primary">
                İş panosu
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
