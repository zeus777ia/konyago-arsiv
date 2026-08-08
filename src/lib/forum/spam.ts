/**
 * Spam koruma — istemci tarafı hız sınırı, tekrar, flood, link spam.
 */

export type SpamCheckResult =
  | { ok: true }
  | { ok: false; reason: string; code: string };

const STORAGE_KEY = "konyago-arsiv-spam-v1";

type SpamLog = {
  events: { at: number; kind: string; hash: string }[];
};

function load(): SpamLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { events: [] };
    const parsed = JSON.parse(raw) as SpamLog;
    return { events: Array.isArray(parsed.events) ? parsed.events : [] };
  } catch {
    return { events: [] };
  }
}

function save(log: SpamLog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* ignore */
  }
}

function hashText(s: string): string {
  let h = 0;
  const t = s.trim().toLowerCase();
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
  return String(h);
}

function prune(log: SpamLog, maxAgeMs: number): SpamLog {
  const cut = Date.now() - maxAgeMs;
  return { events: log.events.filter((e) => e.at >= cut) };
}

const LIMITS = {
  /** Aynı türde ardışık paylaşım arası minimum süre */
  cooldownMs: 45_000,
  /** Saatlik üst sınır (konu + cevap + ilan) */
  perHour: 12,
  /** 10 dakikada üst sınır */
  per10min: 5,
  /** Aynı metin tekrarı penceresi */
  dupWindowMs: 24 * 60 * 60_000,
};

export function recordSpamEvent(kind: string, content: string) {
  if (typeof localStorage === "undefined") return;
  let log = prune(load(), 24 * 60 * 60_000);
  log.events.push({ at: Date.now(), kind, hash: hashText(content) });
  save(log);
}

export function checkSpamLimits(input: {
  kind: "thread" | "reply" | "listing" | "job";
  title?: string;
  body: string;
}): SpamCheckResult {
  if (typeof localStorage === "undefined") return { ok: true };

  const text = `${input.title ?? ""}\n${input.body}`.trim();
  const log = prune(load(), 24 * 60 * 60_000);
  const now = Date.now();

  const last = log.events[log.events.length - 1];
  if (last && now - last.at < LIMITS.cooldownMs) {
    const wait = Math.ceil((LIMITS.cooldownMs - (now - last.at)) / 1000);
    return {
      ok: false,
      code: "cooldown",
      reason: `Spam koruması: Lütfen ${wait} saniye bekleyip tekrar deneyin.`,
    };
  }

  const last10 = log.events.filter((e) => now - e.at < 10 * 60_000);
  if (last10.length >= LIMITS.per10min) {
    return {
      ok: false,
      code: "rate_10m",
      reason:
        "Spam koruması: Kısa sürede çok fazla paylaşım yaptınız. 10 dakika sonra tekrar deneyin.",
    };
  }

  const lastHour = log.events.filter((e) => now - e.at < 60 * 60_000);
  if (lastHour.length >= LIMITS.perHour) {
    return {
      ok: false,
      code: "rate_1h",
      reason:
        "Spam koruması: Saatlik paylaşım limitine ulaşıldı. Daha sonra tekrar deneyin.",
    };
  }

  const h = hashText(text);
  const dup = log.events.find(
    (e) => e.hash === h && now - e.at < LIMITS.dupWindowMs,
  );
  if (dup) {
    return {
      ok: false,
      code: "duplicate",
      reason:
        "Spam koruması: Aynı veya neredeyse aynı içeriği tekrar paylaşamazsınız.",
    };
  }

  return { ok: true };
}

/** Metin tabanlı spam sinyalleri (link bombası, CAPS, tekrarlayan karakter) */
export function checkSpamContent(
  title: string,
  body: string,
): SpamCheckResult {
  const full = `${title}\n${body}`;
  const letters = full.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, "");
  const upper = letters.replace(/[^A-ZĞÜŞİÖÇ]/g, "");
  if (letters.length >= 20 && upper.length / letters.length > 0.7) {
    return {
      ok: false,
      code: "caps",
      reason:
        "Spam koruması: Aşırı büyük harf kullanımı engellendi. Normal yazım kullanın.",
    };
  }

  if (/(.)\1{9,}/.test(full)) {
    return {
      ok: false,
      code: "flood_chars",
      reason: "Spam koruması: Anlamsız karakter tekrarı tespit edildi.",
    };
  }

  const urls =
    full.match(
      /https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9-]+\.(com|net|org|xyz|top|click|info)\b/gi,
    ) ?? [];
  if (urls.length >= 4) {
    return {
      ok: false,
      code: "link_spam",
      reason:
        "Spam koruması: Çok sayıda bağlantı içeren paylaşımlar engellenir (en fazla 3 link).",
    };
  }

  // Tekrarlayan aynı cümle / satır
  const lines = body
    .split(/\n+/)
    .map((l) => l.trim().toLowerCase())
    .filter((l) => l.length > 8);
  if (lines.length >= 3) {
    const counts = new Map<string, number>();
    for (const l of lines) counts.set(l, (counts.get(l) ?? 0) + 1);
    for (const n of counts.values()) {
      if (n >= 3) {
        return {
          ok: false,
          code: "line_repeat",
          reason: "Spam koruması: Aynı satırın tekrarı flood sayılır.",
        };
      }
    }
  }

  // Tipik spam kalıpları
  const spamPhrases = [
    "bedava takipci",
    "ucuz takipci",
    "whatsapp grubu ekle",
    "telegram kanalima",
    "kazanc firsati",
    "evden para",
    "bitcoin yatir",
    "forex sinyal",
    "guaranteed profit",
    "click here now",
    "free followers",
    "dm me now",
  ];
  const norm = full
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
  for (const p of spamPhrases) {
    if (norm.includes(p)) {
      return {
        ok: false,
        code: "spam_phrase",
        reason: "Spam koruması: Reklam / dolandırıcılık kalıbı tespit edildi.",
      };
    }
  }

  return { ok: true };
}

/** Honeypot: gizli alan doluysa bot */
export function checkHoneypot(value: string | undefined | null): SpamCheckResult {
  if (value && value.trim().length > 0) {
    return {
      ok: false,
      code: "honeypot",
      reason: "İstek reddedildi.",
    };
  }
  return { ok: true };
}

export function runAllSpamChecks(input: {
  kind: "thread" | "reply" | "listing" | "job";
  title?: string;
  body: string;
  honeypot?: string;
}): SpamCheckResult {
  const hp = checkHoneypot(input.honeypot);
  if (!hp.ok) return hp;
  const content = checkSpamContent(input.title ?? "", input.body);
  if (!content.ok) return content;
  return checkSpamLimits({
    kind: input.kind,
    title: input.title,
    body: input.body,
  });
}
