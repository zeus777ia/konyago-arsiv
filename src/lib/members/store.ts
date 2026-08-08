import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  resetPasswordEmail,
  sendAppEmail,
  welcomeEmail,
} from "@/lib/email/send";

export type MemberPrefs = {
  /** E-posta panoda gösterilsin mi */
  showEmail: boolean;
  /** Konu onay bildirim tercihi (bilgi amaçlı) */
  notifyModeration: boolean;
  /** Pazar yeri ilan özeti */
  notifyListings: boolean;
  /** Karanlık mod tercihi (UI henüz light; kayıt tutulur) */
  preferCompactLists: boolean;
};

export type MemberProfile = {
  bio: string;
  city: string;
  district: string;
  website: string;
  locationNote: string;
};

export type Member = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  profile: MemberProfile;
  prefs: MemberPrefs;
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

export const DEFAULT_PROFILE: MemberProfile = {
  bio: "",
  city: "Konya",
  district: "",
  website: "",
  locationNote: "",
};

export const DEFAULT_PREFS: MemberPrefs = {
  showEmail: false,
  notifyModeration: true,
  notifyListings: true,
  preferCompactLists: false,
};

type MembersState = {
  members: Member[];
  session: MemberSession | null;
  resetTokens: ResetToken[];
  logout: () => void;
  updateProfile: (input: {
    displayName?: string;
    profile?: Partial<MemberProfile>;
    prefs?: Partial<MemberPrefs>;
  }) => { ok: true } | { ok: false; error: string };
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

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Şifre en az 8 karakter olmalı";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Şifre en az bir harf ve bir rakam içermelidir";
  }
  return null;
}

function normalizeMember(raw: Partial<Member> & {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}): Member {
  return {
    id: raw.id,
    email: raw.email,
    displayName: raw.displayName,
    passwordHash: raw.passwordHash,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    lastLoginAt: raw.lastLoginAt,
    profile: { ...DEFAULT_PROFILE, ...(raw.profile ?? {}) },
    prefs: { ...DEFAULT_PREFS, ...(raw.prefs ?? {}) },
  };
}

export const useMembersStore = create<MembersState>()(
  persist(
    (set, get) => ({
      members: [],
      session: null,
      resetTokens: [],
      logout: () => set({ session: null }),
      updateProfile: (input) => {
        const s = get().session;
        if (!s) return { ok: false, error: "Oturum yok" };

        const name =
          input.displayName !== undefined
            ? input.displayName.trim()
            : undefined;
        if (name !== undefined && name.length < 2) {
          return { ok: false, error: "Görünen ad en az 2 karakter olmalı" };
        }
        if (name !== undefined && name.length > 32) {
          return { ok: false, error: "Görünen ad en fazla 32 karakter" };
        }

        const bio = input.profile?.bio;
        if (bio !== undefined && bio.length > 400) {
          return { ok: false, error: "Hakkımda en fazla 400 karakter" };
        }

        const website = input.profile?.website?.trim();
        if (
          website &&
          website.length > 0 &&
          !/^https?:\/\/.+/i.test(website)
        ) {
          return {
            ok: false,
            error: "Web sitesi http:// veya https:// ile başlamalı",
          };
        }

        const now = new Date().toISOString();
        set({
          session: {
            ...s,
            displayName: name ?? s.displayName,
          },
          members: get().members.map((m) => {
            if (m.id !== s.memberId) return m;
            const nm = normalizeMember(m);
            return {
              ...nm,
              displayName: name ?? nm.displayName,
              updatedAt: now,
              profile: {
                ...nm.profile,
                ...(input.profile ?? {}),
                website:
                  input.profile?.website !== undefined
                    ? (input.profile.website?.trim() ?? "")
                    : nm.profile.website,
                bio:
                  input.profile?.bio !== undefined
                    ? input.profile.bio.slice(0, 400)
                    : nm.profile.bio,
              },
              prefs: {
                ...nm.prefs,
                ...(input.prefs ?? {}),
              },
            };
          }),
        });
        return { ok: true };
      },
    }),
    {
      name: "konyago-arsiv-members-v3",
      version: 4,
      migrate: (persisted, fromVersion) => {
        const p = (persisted ?? {}) as {
          members?: Partial<Member>[];
          session?: MemberSession | null;
          resetTokens?: ResetToken[];
        };
        return {
          members: (p.members ?? []).map((m) =>
            normalizeMember(
              m as Member & {
                id: string;
                email: string;
                displayName: string;
                passwordHash: string;
                createdAt: string;
              },
            ),
          ),
          session: p.session ?? null,
          resetTokens: p.resetTokens ?? [],
        };
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<MembersState>;
        return {
          ...current,
          ...p,
          members: (p.members ?? current.members).map((m) =>
            normalizeMember(m as Member),
          ),
          session: p.session ?? null,
          resetTokens: p.resetTokens ?? [],
        };
      },
    },
  ),
);

export function getSessionMember(): Member | null {
  const s = useMembersStore.getState().session;
  if (!s) return null;
  const m = useMembersStore.getState().members.find((x) => x.id === s.memberId);
  return m ? normalizeMember(m) : null;
}

export async function registerMember(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const em = normalizeEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return { ok: false, error: "Geçerli bir e-posta girin" };
  }
  const pwErr = validatePassword(input.password);
  if (pwErr) return { ok: false, error: pwErr };
  if (input.displayName.trim().length < 2) {
    return { ok: false, error: "Görünen ad en az 2 karakter" };
  }
  const state = useMembersStore.getState();
  if (state.members.some((m) => m.email === em)) {
    return { ok: false, error: "Bu e-posta zaten kayıtlı" };
  }
  const memberId = id();
  const passwordHash = await hashPassword(input.password, memberId);
  const now = new Date().toISOString();
  const member: Member = {
    id: memberId,
    email: em,
    displayName: input.displayName.trim(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    profile: { ...DEFAULT_PROFILE },
    prefs: { ...DEFAULT_PREFS },
  };
  useMembersStore.setState({
    members: [...state.members, member],
    session: {
      memberId: member.id,
      email: member.email,
      displayName: member.displayName,
    },
  });

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
  const now = new Date().toISOString();
  useMembersStore.setState({
    members: state.members.map((m) =>
      m.id === member.id
        ? normalizeMember({ ...m, lastLoginAt: now })
        : normalizeMember(m),
    ),
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

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const s = useMembersStore.getState().session;
  if (!s) return { ok: false, error: "Oturum yok" };
  const member = useMembersStore
    .getState()
    .members.find((m) => m.id === s.memberId);
  if (!member) return { ok: false, error: "Hesap bulunamadı" };

  const cur = await hashPassword(input.currentPassword, member.id);
  if (cur !== member.passwordHash) {
    return { ok: false, error: "Mevcut şifre hatalı" };
  }
  const pwErr = validatePassword(input.newPassword);
  if (pwErr) return { ok: false, error: pwErr };
  if (input.currentPassword === input.newPassword) {
    return { ok: false, error: "Yeni şifre eskisiyle aynı olamaz" };
  }
  const passwordHash = await hashPassword(input.newPassword, member.id);
  useMembersStore.setState({
    members: useMembersStore.getState().members.map((m) =>
      m.id === member.id
        ? {
            ...normalizeMember(m),
            passwordHash,
            updatedAt: new Date().toISOString(),
          }
        : m,
    ),
  });
  return { ok: true };
}

export async function changeEmail(input: {
  password: string;
  newEmail: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const s = useMembersStore.getState().session;
  if (!s) return { ok: false, error: "Oturum yok" };
  const em = normalizeEmail(input.newEmail);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return { ok: false, error: "Geçerli bir e-posta girin" };
  }
  const member = useMembersStore
    .getState()
    .members.find((m) => m.id === s.memberId);
  if (!member) return { ok: false, error: "Hesap bulunamadı" };
  const hash = await hashPassword(input.password, member.id);
  if (hash !== member.passwordHash) {
    return { ok: false, error: "Şifre hatalı" };
  }
  if (useMembersStore.getState().members.some((m) => m.email === em && m.id !== member.id)) {
    return { ok: false, error: "Bu e-posta başka bir hesapta kayıtlı" };
  }
  useMembersStore.setState({
    members: useMembersStore.getState().members.map((m) =>
      m.id === member.id
        ? {
            ...normalizeMember(m),
            email: em,
            updatedAt: new Date().toISOString(),
          }
        : m,
    ),
    session: { ...s, email: em },
  });
  return { ok: true };
}

export async function deleteAccount(input: {
  password: string;
  confirmText: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.confirmText.trim().toUpperCase() !== "SIL") {
    return {
      ok: false,
      error: 'Onay için kutuya SIL yazın (büyük harf, Türkçe İ değil).',
    };
  }
  const s = useMembersStore.getState().session;
  if (!s) return { ok: false, error: "Oturum yok" };
  const member = useMembersStore
    .getState()
    .members.find((m) => m.id === s.memberId);
  if (!member) return { ok: false, error: "Hesap bulunamadı" };
  const hash = await hashPassword(input.password, member.id);
  if (hash !== member.passwordHash) {
    return { ok: false, error: "Şifre hatalı" };
  }
  useMembersStore.setState({
    members: useMembersStore
      .getState()
      .members.filter((m) => m.id !== member.id),
    session: null,
    resetTokens: useMembersStore
      .getState()
      .resetTokens.filter((t) => t.email !== member.email),
  });
  return { ok: true };
}

export function exportMemberData(): string | null {
  const m = getSessionMember();
  if (!m) return null;
  const payload = {
    exportedAt: new Date().toISOString(),
    account: {
      id: m.id,
      email: m.email,
      displayName: m.displayName,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      lastLoginAt: m.lastLoginAt,
      profile: m.profile,
      prefs: m.prefs,
    },
    note: "Şifre özeti güvenlik nedeniyle dışa aktarılmaz.",
  };
  return JSON.stringify(payload, null, 2);
}

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
      error: `E-posta gönderilemedi: ${mail.error}. Lütfen daha sonra tekrar dene veya info@konyago.com.tr adresine yaz.`,
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
  const pwErr = validatePassword(input.newPassword);
  if (pwErr) return { ok: false, error: pwErr };
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
      .members.map((m) =>
        m.id === member.id
          ? {
              ...normalizeMember(m),
              passwordHash,
              updatedAt: new Date().toISOString(),
            }
          : m,
      ),
    resetTokens: useMembersStore
      .getState()
      .resetTokens.filter((t) => t.email !== em),
    session: null,
  });
  return { ok: true };
}
