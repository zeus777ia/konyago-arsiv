import { useSyncExternalStore } from "react";
import { authClient, authEnabled } from "./client";
import { useMembersStore } from "@/lib/members/store";

/** Normalized user shape used across the app, auth on or off. */
export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
  isLocalMember?: boolean;
};

export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

export type CurrentUserState = {
  user: AppUser | null;
  isPending: boolean;
};

function subscribeMembers(cb: () => void) {
  const unsubStore = useMembersStore.subscribe(cb);
  // Re-notify when persist finishes hydrating (session may appear)
  const unsubHydrate = useMembersStore.persist.onFinishHydration(() => cb());
  return () => {
    unsubStore();
    unsubHydrate();
  };
}

function getMemberSession() {
  return useMembersStore.getState().session;
}

function subscribeHydrated(cb: () => void) {
  if (useMembersStore.persist.hasHydrated()) {
    // already done
  }
  const unsub = useMembersStore.persist.onFinishHydration(() => cb());
  return () => {
    unsub();
  };
}

function getMembersHydrated() {
  return useMembersStore.persist.hasHydrated();
}

/** true after localStorage rehydrate — avoid false "logged out" redirects */
export function useMembersHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydrated,
    getMembersHydrated,
    () => false,
  );
}

/**
 * Prefer local member session (email/password), then Better Auth OAuth.
 */
export function useCurrentUserState(): CurrentUserState {
  const hydrated = useMembersHydrated();
  const session = useSyncExternalStore(
    subscribeMembers,
    getMemberSession,
    () => null,
  );

  const ba = authEnabled
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      authClient.useSession()
    : { data: null, isPending: false };

  if (!hydrated) {
    return { user: null, isPending: true };
  }

  if (session) {
    return {
      user: {
        id: session.memberId,
        displayName: session.displayName,
        primaryEmail: session.email,
        profileImageUrl: null,
        isDevFallback: false,
        isLocalMember: true,
      },
      isPending: false,
    };
  }

  const user = ba.data?.user;
  return {
    user: user
      ? {
          id: user.id,
          displayName: user.name ?? null,
          primaryEmail: user.email ?? null,
          profileImageUrl: user.image ?? null,
          isDevFallback: false,
        }
      : null,
    isPending: ba.isPending,
  };
}

export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
