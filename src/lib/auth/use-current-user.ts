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
  const unsubHydrate = useMembersStore.persist.onFinishHydration(() => cb());
  return () => {
    unsubStore();
    unsubHydrate();
  };
}

/** String snapshot so avatar/activity changes re-render consumers */
function getMemberUserSnapshot(): string {
  const s = useMembersStore.getState().session;
  if (!s) return "null";
  const m = useMembersStore
    .getState()
    .members.find((x) => x.id === s.memberId);
  return [
    s.memberId,
    s.displayName,
    s.email,
    m?.avatarUrl?.length ?? 0,
    m?.avatarUrl?.slice(-24) ?? "",
    m?.activity?.totalMinutes ?? 0,
    m?.updatedAt ?? "",
  ].join("|");
}

function subscribeHydrated(cb: () => void) {
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
  const memberSnap = useSyncExternalStore(
    subscribeMembers,
    getMemberUserSnapshot,
    () => "null",
  );

  const ba = authEnabled
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      authClient.useSession()
    : { data: null, isPending: false };

  if (!hydrated) {
    return { user: null, isPending: true };
  }

  if (memberSnap !== "null") {
    const s = useMembersStore.getState().session!;
    const member = useMembersStore
      .getState()
      .members.find((m) => m.id === s.memberId);
    return {
      user: {
        id: s.memberId,
        displayName: s.displayName,
        primaryEmail: s.email,
        profileImageUrl: member?.avatarUrl ?? null,
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
