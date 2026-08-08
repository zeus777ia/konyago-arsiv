/**
 * KonyaGo Arşiv — çok katmanlı spam koruma motoru
 *
 * Katmanlar (sırayla):
 *  L0 Honeypot / bot tuzak
 *  L1 Form zamanı (çok hızlı gönderim)
 *  L2 Metin hijyeni (zero-width, zalgo, leetspeak sadeleştirme)
 *  L3 İçerik sinyalleri (CAPS, flood, link, TLD, kısaltıcı, skor)
 *  L4 Kalıp engeli (reklam / dolandırıcılık ifadeleri)
 *  L5 Benzerlik / tekrar (hash + n-gram Jaccard)
 *  L6 Hız limitleri (cooldown, 10dk, saatlik)
 *  L7 İhlal puanı (tekrarlayan engeller → geçici soft-ban)
 *
 * Not (dürüst bilgilendirme): Bu denetimler tarayıcıda çalışır; kurucu moderasyonu
 * ve otomatik filtre birlikte kullanılır. Sunucu tarafı ban altyapısı statik
 * barındırmada sınırlıdır — iddialar buna göre konumlandırılmalıdır.
 */

export type SpamCheckResult =
  | { ok: true; score: number }
  | { ok: false; reason: string; code: string; score: number };

const STORAGE_KEY = "konyago-arsiv-spam-v2";
const VIOLATION_KEY = "konyago-arsiv-spam-violations-v1";

type SpamEvent = {
  at: number;
  kind: string;
  hash: string;
  /** İlk 64 karakterlik n-gram imzası */
  sig: string;
};

type SpamLog = { events: SpamEvent[] };

type ViolationLog = {
  hits: { at: number; code: string }[];
  banUntil?: number;
};

export const SPAM_LIMITS = {
  cooldownMs: 60_000,
  per10min: 4,
  perHour: 10,
  perDay: 40,
  dupWindowMs: 48 * 60 * 60_000,
  similarThreshold: 0.82,
  maxLinks: 3,
  maxScore: 55,
  formMinMs: 2_500,
  softBanAfterHits: 5,
  softBanWindowMs: 2 * 60 * 60_000,
  softBanDurationMs: 30 * 60_000,
} as const;

function loadLog(): SpamLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { events: [] };
    const p = JSON.parse(raw) as SpamLog;
    return { events: Array.isArray(p.events) ? p.events : [] };
  } catch {
    return { events: [] };
  }
}

function saveLog(log: SpamLog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* quota */
  }
}

function loadViolations(): ViolationLog {
  try {
    const raw = localStorage.getItem(VIOLATION_KEY);
    if (!raw) return { hits: [] };
    return JSON.parse(raw) as ViolationLog;
  } catch {
    return { hits: [] };
  }
}

function saveViolations(v: ViolationLog) {
  try {
    localStorage.setItem(VIOLATION_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export function recordSpamViolation(code: string) {
  if (typeof localStorage === "undefined") return;
  const now = Date.now();
  let v = loadViolations();
  v.hits = v.hits.filter((h) => now - h.at < SPAM_LIMITS.softBanWindowMs);
  v.hits.push({ at: now, code });
  if (v.hits.length >= SPAM_LIMITS.softBanAfterHits) {
    v.banUntil = now + SPAM_LIMITS.softBanDurationMs;
  }
  saveViolations(v);
}

function checkSoftBan(): SpamCheckResult | null {
  if (typeof localStorage === "undefined") return null;
  const v = loadViolations();
  if (v.banUntil && v.banUntil > Date.now()) {
    const min = Math.ceil((v.banUntil - Date.now()) / 60_000);
    return {
      ok: false,
      code: "soft_ban",
      score: 100,
      reason: `Güvenlik: Tekrarlayan kural ihlalleri nedeniyle yaklaşık ${min} dakika paylaşım geçici olarak kısıtlandı.`,
    };
  }
  return null;
}

/** Türkçe + leetspeak sadeleştirme */
export function normalizeForSpam(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "") // zero-width
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/\$/g, "s")
    .replace(/@/g, "a")
    .replace(/[^a-z0-9\s./:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashText(s: string): string {
  let h = 2166136261;
  const t = normalizeForSpam(s);
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

/** Karakter 3-gram imzası (benzerlik için) */
function signature(s: string): string {
  const t = normalizeForSpam(s).replace(/\s/g, "");
  if (t.length < 6) return t;
  const grams = new Set<string>();
  for (let i = 0; i < t.length - 2; i++) grams.add(t.slice(i, i + 3));
  return [...grams].sort().slice(0, 80).join("");
}

function jaccard(a: string, b: string): number {
  const sa = new Set(a.match(/.{1,3}/g) ?? []);
  const sb = new Set(b.match(/.{1,3}/g) ?? []);
  if (!sa.size || !sb.size) return 0;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  return inter / (sa.size + sb.size - inter);
}

function prune(log: SpamLog, maxAgeMs: number): SpamLog {
  const cut = Date.now() - maxAgeMs;
  return { events: log.events.filter((e) => e.at >= cut) };
}

export function recordSpamEvent(kind: string, content: string) {
  if (typeof localStorage === "undefined") return;
  let log = prune(loadLog(), 7 * 24 * 60 * 60_000);
  log.events.push({
    at: Date.now(),
    kind,
    hash: hashText(content),
    sig: signature(content),
  });
  // en fazla 200 olay
  if (log.events.length > 200) log.events = log.events.slice(-200);
  saveLog(log);
}

const SPAM_PHRASES = [
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
  "kripto airdrop",
  "nft mint",
  "double your money",
  "yatirim firsati",
  "kolay kazanc",
  "gunluk gelir",
  "bahis tahmini",
  "iddaa banko",
  "casino bonus",
  "vip sinyal grubu",
  "ucretsiz netflix",
  "hesap satisi",
  "hack hizmeti",
  "sms bomb",
  "phishing",
];

const SUSPICIOUS_TLDS =
  /\.(xyz|top|click|loan|work|gq|ml|cf|tk|zip|mov|country|stream|download)\b/i;

const SHORTENERS =
  /\b(bit\.ly|t\.co|goo\.gl|tinyurl|is\.gd|cutt\.ly|rebrand\.ly|rb\.gy|ow\.ly|shorturl|s\.id)\b/i;

function fail(
  code: string,
  reason: string,
  score: number,
): SpamCheckResult {
  recordSpamViolation(code);
  return { ok: false, code, reason, score };
}

export function checkHoneypot(
  value: string | undefined | null,
): SpamCheckResult {
  if (value && value.trim().length > 0) {
    return fail("honeypot", "İstek güvenlik denetiminden geçemedi.", 100);
  }
  return { ok: true, score: 0 };
}

export function checkFormTiming(formStartedAt?: number): SpamCheckResult {
  if (!formStartedAt) return { ok: true, score: 0 };
  const elapsed = Date.now() - formStartedAt;
  if (elapsed < SPAM_LIMITS.formMinMs) {
    return fail(
      "too_fast",
      "Güvenlik: Form çok hızlı gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.",
      70,
    );
  }
  return { ok: true, score: 0 };
}

export function checkSpamContent(
  title: string,
  body: string,
): SpamCheckResult {
  let score = 0;
  const full = `${title}\n${body}`;
  const norm = normalizeForSpam(full);

  // Zero-width / zalgo yoğunluğu
  const zw = (full.match(/[\u200B-\u200D\uFEFF]/g) ?? []).length;
  if (zw >= 3) {
    return fail(
      "zero_width",
      "Güvenlik: Gizli karakterler içeren metin engellendi.",
      90,
    );
  }
  if (/[\u0300-\u036f]{4,}/.test(full.normalize("NFD"))) {
    return fail(
      "zalgo",
      "Güvenlik: Bozuk / okunaksız karakter dizisi engellendi.",
      85,
    );
  }

  // CAPS oranı
  const letters = full.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, "");
  const upper = letters.replace(/[^A-ZĞÜŞİÖÇ]/g, "");
  if (letters.length >= 18 && upper.length / letters.length > 0.65) {
    score += 40;
  }

  // Karakter flood
  if (/(.)\1{8,}/.test(full)) score += 45;
  if (/(.{2,6})\1{4,}/.test(full)) score += 35;

  // Link analizi
  const urls =
    full.match(
      /https?:\/\/[^\s]+|www\.[^\s]+|(?:^|[\s(])[a-z0-9][-a-z0-9]{1,40}\.(com|net|org|xyz|top|click|info|io|co|me|tr)(?:\/[^\s]*)?/gi,
    ) ?? [];
  if (urls.length > SPAM_LIMITS.maxLinks) {
    return fail(
      "link_spam",
      `Spam koruması: En fazla ${SPAM_LIMITS.maxLinks} bağlantıya izin verilir.`,
      80,
    );
  }
  if (urls.length >= 2) score += urls.length * 12;
  if (SUSPICIOUS_TLDS.test(full)) score += 35;
  if (SHORTENERS.test(full)) score += 30;

  // Satır tekrarı
  const lines = body
    .split(/\n+/)
    .map((l) => normalizeForSpam(l))
    .filter((l) => l.length > 8);
  if (lines.length >= 3) {
    const counts = new Map<string, number>();
    for (const l of lines) counts.set(l, (counts.get(l) ?? 0) + 1);
    for (const n of counts.values()) {
      if (n >= 3) score += 50;
    }
  }

  // Kelime çeşitliliği (çok düşük = spam)
  const words = norm.split(" ").filter((w) => w.length > 2);
  if (words.length >= 12) {
    const unique = new Set(words);
    if (unique.size / words.length < 0.28) score += 40;
  }

  // Kalıp engeli
  for (const p of SPAM_PHRASES) {
    if (norm.includes(p)) {
      return fail(
        "spam_phrase",
        "Güvenlik: Reklam, dolandırıcılık veya yasaklı tanıtım kalıbı tespit edildi.",
        95,
      );
    }
  }

  // E-posta / telefon bombardımanı
  const phones = full.match(/(?:\+90|0)?\s*5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/g) ?? [];
  if (phones.length >= 3) score += 30;

  if (score >= SPAM_LIMITS.maxScore) {
    return fail(
      "score",
      "Spam koruması: İçerik risk skoru yüksek olduğu için engellendi. Metni sadeleştirip tekrar deneyin.",
      score,
    );
  }

  if (upper.length / Math.max(letters.length, 1) > 0.65 && letters.length >= 18) {
    return fail(
      "caps",
      "Spam koruması: Aşırı büyük harf kullanımı engellendi.",
      score,
    );
  }

  return { ok: true, score };
}

export function checkSpamLimits(input: {
  kind: string;
  title?: string;
  body: string;
}): SpamCheckResult {
  if (typeof localStorage === "undefined") return { ok: true, score: 0 };

  const ban = checkSoftBan();
  if (ban) return ban;

  const text = `${input.title ?? ""}\n${input.body}`.trim();
  const log = prune(loadLog(), 7 * 24 * 60 * 60_000);
  const now = Date.now();
  const h = hashText(text);
  const sig = signature(text);

  const last = log.events[log.events.length - 1];
  if (last && now - last.at < SPAM_LIMITS.cooldownMs) {
    const wait = Math.ceil((SPAM_LIMITS.cooldownMs - (now - last.at)) / 1000);
    return fail(
      "cooldown",
      `Spam koruması: Lütfen ${wait} saniye bekleyip tekrar deneyin.`,
      40,
    );
  }

  const last10 = log.events.filter((e) => now - e.at < 10 * 60_000);
  if (last10.length >= SPAM_LIMITS.per10min) {
    return fail(
      "rate_10m",
      "Spam koruması: 10 dakikalık paylaşım limitine ulaşıldı.",
      60,
    );
  }

  const lastHour = log.events.filter((e) => now - e.at < 60 * 60_000);
  if (lastHour.length >= SPAM_LIMITS.perHour) {
    return fail(
      "rate_1h",
      "Spam koruması: Saatlik paylaşım limitine ulaşıldı.",
      65,
    );
  }

  const lastDay = log.events.filter((e) => now - e.at < 24 * 60 * 60_000);
  if (lastDay.length >= SPAM_LIMITS.perDay) {
    return fail(
      "rate_1d",
      "Spam koruması: Günlük paylaşım limitine ulaşıldı.",
      70,
    );
  }

  // Tam hash tekrarı
  if (
    log.events.some(
      (e) => e.hash === h && now - e.at < SPAM_LIMITS.dupWindowMs,
    )
  ) {
    return fail(
      "duplicate",
      "Spam koruması: Aynı içerik daha önce paylaşılmış.",
      75,
    );
  }

  // Benzer içerik (Jaccard)
  for (const e of log.events) {
    if (now - e.at > SPAM_LIMITS.dupWindowMs) continue;
    if (jaccard(sig, e.sig) >= SPAM_LIMITS.similarThreshold) {
      return fail(
        "similar",
        "Spam koruması: Çok benzer bir içerik yakın zamanda paylaşılmış.",
        72,
      );
    }
  }

  return { ok: true, score: 0 };
}

export function runAllSpamChecks(input: {
  kind: "thread" | "reply" | "listing" | "job";
  title?: string;
  body: string;
  honeypot?: string;
  formStartedAt?: number;
}): SpamCheckResult {
  let score = 0;

  const ban = checkSoftBan();
  if (ban) return ban;

  const hp = checkHoneypot(input.honeypot);
  if (!hp.ok) return hp;

  const timing = checkFormTiming(input.formStartedAt);
  if (!timing.ok) return timing;

  const content = checkSpamContent(input.title ?? "", input.body);
  if (!content.ok) return content;
  score += content.score;

  const limits = checkSpamLimits({
    kind: input.kind,
    title: input.title,
    body: input.body,
  });
  if (!limits.ok) return limits;

  return { ok: true, score };
}

/** Kullanıcıya gösterilecek şeffaf açıklama (yanlış bilgilendirme yok) */
export const SPAM_PUBLIC_EXPLAIN = {
  title: "Spam ve kötüye kullanım koruması",
  layers: [
    {
      id: "L0",
      name: "Bot tuzak alanı (honeypot)",
      detail:
        "İnsanların görmediği gizli alan doldurulursa istek reddedilir.",
    },
    {
      id: "L1",
      name: "Form süre kontrolü",
      detail:
        "Bir formun insan makul süreden kısa doldurulması bot sinyali sayılır.",
    },
    {
      id: "L2",
      name: "Metin hijyeni",
      detail:
        "Gizli karakter, zalgo ve leetspeak sadeleştirilerek taranır.",
    },
    {
      id: "L3",
      name: "İçerik risk skoru",
      detail:
        "CAPS, flood, şüpheli alan adı, link kısaltıcı ve çeşitlilik ölçülür; eşik aşılırsa engel.",
    },
    {
      id: "L4",
      name: "Kalıp engeli",
      detail:
        "Dolandırıcılık / yasadışı reklam kalıpları doğrudan reddedilir.",
    },
    {
      id: "L5",
      name: "Tekrar ve benzerlik",
      detail:
        "Aynı veya çok benzer metin hash + n-gram benzerliği ile engellenir.",
    },
    {
      id: "L6",
      name: "Hız limitleri",
      detail:
        "60 sn soğuma, 10 dk / saat / gün kotaları flood’u keser.",
    },
    {
      id: "L7",
      name: "İhlal puanı ve geçici kısıt",
      detail:
        "Kısa sürede çok ihlal → geçici soft-ban. Kurucu moderasyonu ayrı çalışır.",
    },
  ],
  honesty:
    "Bu korumalar içerik riskini azaltır; %100 güvenlik vaat etmez. Kullanıcılar ikinci el ve iş panosunda site dışı işlemlerde dikkatli olmalıdır. Resmî kurum sitesi değildir.",
} as const;
