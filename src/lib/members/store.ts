import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  resetPasswordEmail,
  sendAppEmail,
  welcomeEmail,
} from "@/lib/email/send";

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

export type ResetToken = {
  email: string;
  codeHash: string;
  expiresAt: number;
};

type MembersState = {
  members: Member[];
  session: MemberSession | null;
  resetTokens: ResetToken[];
  logout: () => void;
  updateProfile: (displayName: string) => void;
};

function id() {
  return `mbr_${Math.random().toString(36).slice(2, 12)}`;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const useMembersStore = create<MembersState>()(
  persist(
    (set, get) => ({
      members: [],
      session: null,
      resetTokens: [],
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
    { name: "konyago-arsiv-members-v3" },
  ),
);

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

  // Hoş geldin e-postası (arka planda; hata kayıtı bozmaz)
  void sendAppEmail(
    welcomeEmail({ displayName: member.displayName, email: member.email }),
  ).catch(() => undefined);

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

/**
 * Şifre sıfırlama kodu üretir ve e-posta gönderir.
 * Güvenlik: e-posta kayıtlı olmasa da aynı mesajı döner.
 */
export async function requestPasswordReset(
  email: string,
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const em = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return { ok: false, error: "Geçerli bir e-posta girin" };
  }

  const member = useMembersStore.getState().members.find((m) => m.email === em);
  const generic =
    "Kayıtlıysa e-postana 6 haneli kod gönderildi. Gelen kutunu ve spam klasörünü kontrol et.";

  if (!member) {
    // Enumerasyonu engelle
    return { ok: true, message: generic };
  }

  const code = randomCode();
  const codeHash = await hashPassword(code, `reset:${em}`);
  const expiresAt = Date.now() + 30 * 60 * 1000;

  const others = useMembersStore
    .getState()
    .resetTokens.filter((t) => t.email !== em && t.expiresAt > Date.now());

  useMembersStore.setState({
    resetTokens: [...others, { email: em, codeHash, expiresAt }],
  });

  const mail = await sendAppEmail(
    resetPasswordEmail({
      displayName: member.displayName,
      email: em,
      code,
    }),
  );

  if (!mail.ok) {
    return {
      ok: false,
      error: `E-posta gönderilemedi: ${mail.error}. Lütfen daha sonra tekrar dene veya ${"info@konyago.com.tr"} adresine yaz.`,
    };
  }

  return { ok: true, message: generic };
}

export async function resetPasswordWithCode(input: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const em = normalizeEmail(input.email);
  if (input.newPassword.length < 6) {
    return { ok: false, error: "Yeni şifre en az 6 karakter olmalı" };
  }
  const token = useMembersStore
    .getState()
    .resetTokens.find((t) => t.email === em && t.expiresAt > Date.now());
  if (!token) {
    return { ok: false, error: "Kod geçersiz veya süresi dolmuş" };
  }
  const codeHash = await hashPassword(input.code.trim(), `reset:${em}`);
  if (codeHash !== token.codeHash) {
    return { ok: false, error: "Kod hatalı" };
  }
  const member = useMembersStore.getState().members.find((m) => m.email === em);
  if (!member) {
    return { ok: false, error: "Hesap bulunamadı" };
  }
  const passwordHash = await hashPassword(input.newPassword, member.id);
  useMembersStore.setState({
    members: useMembersStore
      .getState()
      .members.map((m) => (m.id === member.id ? { ...m, passwordHash } : m)),
    resetTokens: useMembersStore
      .getState()
      .resetTokens.filter((t) => t.email !== em),
    session: null,
  });
  return { ok: true };
}
