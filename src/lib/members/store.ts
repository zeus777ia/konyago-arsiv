import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Member = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
};

export type MemberSession = {
  memberId: string;
  email: string;
  displayName: string;
};

type MembersState = {
  members: Member[];
  session: MemberSession | null;
  register: (input: {
    email: string;
    password: string;
    displayName: string;
  }) => { ok: true } | { ok: false; error: string };
  login: (input: {
    email: string;
    password: string;
  }) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  updateProfile: (displayName: string) => void;
};

function id() {
  return `mbr_${Math.random().toString(36).slice(2, 12)}`;
}

/** Lightweight browser hash — demo membership, not bank-grade. */
async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const useMembersStore = create<MembersState>()(
  persist(
    (set, get) => ({
      members: [],
      session: null,
      register: ({ email, password, displayName }) => {
        const em = normalizeEmail(email);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
          return { ok: false, error: "Geçerli bir e-posta girin" };
        }
        if (password.length < 6) {
          return { ok: false, error: "Şifre en az 6 karakter olmalı" };
        }
        if (displayName.trim().length < 2) {
          return { ok: false, error: "Görünen ad en az 2 karakter" };
        }
        if (get().members.some((m) => m.email === em)) {
          return { ok: false, error: "Bu e-posta zaten kayıtlı" };
        }
        // sync path with precomputed salt; hash stored after promise via temporary sync salt
        // Use deterministic sync hash for store API simplicity (crypto.subtle is async)
        return { ok: false, error: "__ASYNC__" };
      },
      login: () => ({ ok: false, error: "__ASYNC__" }),
      logout: () => set({ session: null }),
      updateProfile: (displayName) => {
        const s = get().session;
        if (!s) return;
        const name = displayName.trim();
        if (name.length < 2) return;
        set({
          session: { ...s, displayName: name },
          members: get().members.map((m) =>
            m.id === s.memberId ? { ...m, displayName: name } : m,
          ),
        });
      },
    }),
    { name: "konyago-arsiv-members-v1" },
  ),
);

/** Async register — preferred API */
export async function registerMember(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const em = normalizeEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return { ok: false, error: "Geçerli bir e-posta girin" };
  }
  if (input.password.length < 6) {
    return { ok: false, error: "Şifre en az 6 karakter olmalı" };
  }
  if (input.displayName.trim().length < 2) {
    return { ok: false, error: "Görünen ad en az 2 karakter" };
  }
  const state = useMembersStore.getState();
  if (state.members.some((m) => m.email === em)) {
    return { ok: false, error: "Bu e-posta zaten kayıtlı" };
  }
  const memberId = id();
  const passwordHash = await hashPassword(input.password, memberId);
  const member: Member = {
    id: memberId,
    email: em,
    displayName: input.displayName.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  useMembersStore.setState({
    members: [...state.members, member],
    session: {
      memberId: member.id,
      email: member.email,
      displayName: member.displayName,
    },
  });
  return { ok: true };
}

export async function loginMember(input: {
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const em = normalizeEmail(input.email);
  const state = useMembersStore.getState();
  const member = state.members.find((m) => m.email === em);
  if (!member) {
    return { ok: false, error: "E-posta veya şifre hatalı" };
  }
  const hash = await hashPassword(input.password, member.id);
  if (hash !== member.passwordHash) {
    return { ok: false, error: "E-posta veya şifre hatalı" };
  }
  useMembersStore.setState({
    session: {
      memberId: member.id,
      email: member.email,
      displayName: member.displayName,
    },
  });
  return { ok: true };
}

export function logoutMember() {
  useMembersStore.getState().logout();
}
