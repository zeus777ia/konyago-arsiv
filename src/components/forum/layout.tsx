import { Link } from "@tanstack/react-router";
import {
  Home,
  Menu,
  MessageSquarePlus,
  PenSquare,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/forum/data";
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
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight sm:text-base">
                {SITE.name}
              </span>
              <span className="hidden truncate text-[11px] text-header-muted sm:block">
                {SITE.domain}
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/yeni-konu"
              className="hidden sm:inline-flex"
            >
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
                <Link to="/login">Giriş</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-2 py-1.5 sm:px-4">
            <NavLink to="/" icon={<Home className="size-3.5" />}>
              Ana sayfa
            </NavLink>
            <NavLink to="/yeni-mesajlar" icon={<MessageSquarePlus className="size-3.5" />}>
              Yeni mesajlar
            </NavLink>
            <NavLink to="/yeni-konu" icon={<PenSquare className="size-3.5" />} className="sm:hidden">
              Yeni konu
            </NavLink>
            <div className="ml-auto hidden w-full max-w-xs md:block md:w-auto md:flex-1 md:max-w-sm">
              <label className="relative block">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-header-muted" />
                <input
                  type="search"
                  value={search ?? ""}
                  onChange={(e) => onSearch?.(e.target.value)}
                  placeholder="Forumda ara…"
                  className="h-8 w-full rounded-md border border-white/10 bg-white/10 py-1 pr-3 pl-8 text-xs text-header-fg placeholder:text-header-muted outline-none focus:border-white/25 focus:bg-white/15"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-border bg-surface px-3 py-3 lg:hidden">
          <label className="relative mb-2 block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={search ?? ""}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Forumda ara…"
              className="h-10 w-full rounded-md border border-border bg-bg-elevated py-2 pr-3 pl-9 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <p className="text-xs text-muted">{SITE.tagline}</p>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <p className="mb-4 hidden text-sm text-muted sm:block">{SITE.tagline}</p>
        {children}
      </div>

      <footer className="mt-4 border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p>
            © {new Date().getFullYear()} {SITE.name} · {SITE.domain}
          </p>
          <p className="text-subtle">
            KonyaGo ailesi ·{" "}
            <a
              href="https://konyago.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              konyago.com.tr
            </a>
          </p>
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
