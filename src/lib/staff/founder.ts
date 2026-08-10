/**
 * Site kurucusu: görünen ad "KonyaGoArşiv" (varyasyonlar dahil).
 * Bu isimle kayıt olan hesap özel yetki + KURUCU rozeti alır.
 */

const FOUNDER_KEYS = new Set([
  "konyagoarsiv",
  "konyagoarsivi",
  "konyago arsiv",
  "konya go arsiv",
  "konyago-arsiv",
  "konyago_arsiv",
]);

/** Türkçe karakterleri sadeleştirip karşılaştırma anahtarı üretir */
export function normalizeMemberName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "");
}

export function isFounderName(name: string | null | undefined): boolean {
  if (!name) return false;
  const key = normalizeMemberName(name);
  if (FOUNDER_KEYS.has(key)) return true;
  // boşluksuz "konyagoarsiv" içeriyorsa ve kısa isim
  if (key === "konyagoarsiv" || key.startsWith("konyagoarsiv")) return true;
  return false;
}

export function isFounderEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return (
    e === "info@konyago.com.tr" ||
    e === "kurucu@konyago.com.tr" ||
    e === "admin@konyagoarsiv.org"
  );
}

export type FounderCheck = {
  displayName?: string | null;
  primaryEmail?: string | null;
};

export function isFounder(user: FounderCheck | null | undefined): boolean {
  if (!user) return false;
  return isFounderName(user.displayName) || isFounderEmail(user.primaryEmail);
}

export const FOUNDER_TITLE = "KURUCU";
export const FOUNDER_CANONICAL = "KonyaGoArşiv";

/** Kurucu giriş şifresi (ensureFounderBootstrap ile sabitlenir) */
export const FOUNDER_DEFAULT_PASSWORD = "KonyaGo#2026";

export const FOUNDER_LOGIN_EMAIL = "info@konyago.com.tr";
