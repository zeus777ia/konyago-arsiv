/**
 * Seed / demo hesap e-postaları asla herkese açık gösterilmez.
 */

export function isSeedMemberId(id: string | null | undefined): boolean {
  return !!id && id.startsWith("mbr_seed_");
}

export function isSeedDemoEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return (
    e.endsWith("@konyago.demo") ||
    e.endsWith("@example.com") ||
    e.endsWith("@example.org")
  );
}

/** Profilde veya listelerde e-posta gösterilebilir mi? */
export function canShowMemberEmail(member: {
  id?: string;
  email?: string;
  prefs?: { showEmail?: boolean };
} | null | undefined): boolean {
  if (!member?.email) return false;
  if (isSeedMemberId(member.id)) return false;
  if (isSeedDemoEmail(member.email)) return false;
  return member.prefs?.showEmail === true;
}

/** UI’da e-posta metni (gizliyse null) */
export function publicMemberEmail(member: {
  id?: string;
  email?: string;
  prefs?: { showEmail?: boolean };
} | null | undefined): string | null {
  return canShowMemberEmail(member) ? (member!.email as string) : null;
}
