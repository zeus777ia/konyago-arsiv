import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { authEnabled, signOut } from "./client";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";
import { logoutMember } from "@/lib/members/store";

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

  const onSignOut = () => {
    if (user.isLocalMember) {
      logoutMember();
      return;
    }
    if (authEnabled) void signOut();
  };

  return (
    <div className="flex items-center gap-2">
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-xs font-semibold text-header-fg">
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="hidden max-w-[7rem] truncate text-sm font-medium text-header-fg sm:inline">
        {label}
      </span>
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
