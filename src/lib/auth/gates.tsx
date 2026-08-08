import type { ReactNode } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { Crown, LayoutDashboard } from "lucide-react";
import { authEnabled, signOut } from "./client";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";
import { logoutMember } from "@/lib/members/store";
import { FOUNDER_TITLE, isFounder } from "@/lib/staff/founder";
import { UserName } from "@/components/forum/user-name";
import { Avatar } from "@/components/forum/avatar";

export const SIGN_IN_PATH = "/login";

export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  return user ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  return <Navigate to={to} />;
}

export function UserButton() {
  const user = useCurrentUser();
  if (!user) return null;
  const label = user.displayName ?? user.primaryEmail ?? "Üye";
  const founder = isFounder(user);

  const onSignOut = () => {
    if (user.isLocalMember) {
      logoutMember();
      return;
    }
    if (authEnabled) void signOut();
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        to="/hesabim"
        search={{ sekme: "ozet" }}
        className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-header-muted hover:bg-white/10 hover:text-header-fg sm:inline-flex"
        title="Kullanıcı paneli"
      >
        <LayoutDashboard className="size-3.5" />
        Panel
      </Link>
      <Link
        to="/hesabim"
        search={{ sekme: "ozet" }}
        className="flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 hover:bg-white/10"
        title="Hesap yönetimi"
      >
        <Avatar
          name={label}
          size="sm"
          imageUrl={user.profileImageUrl}
          className="ring-1 ring-white/15"
        />
        <div className="hidden min-w-0 flex-col sm:flex">
          <UserName
            name={label}
            size="sm"
            className="max-w-[9rem] truncate"
            link={false}
          />
          {founder && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold tracking-wider text-emerald-300 uppercase">
              <Crown className="size-2.5" />
              {FOUNDER_TITLE}
            </span>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={onSignOut}
        className="cursor-pointer rounded-md px-2 py-1 text-xs text-header-muted hover:bg-white/10 hover:text-header-fg"
      >
        Çıkış
      </button>
    </div>
  );
}
