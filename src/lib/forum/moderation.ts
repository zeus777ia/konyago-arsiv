/**
 * Otomatik içerik denetimi — +18, küfür, cinsellik, alkol/uyuşturucu, telif.
 * Eşleşen içerik yayınlanmaz / silinir.
 */

export type ModerationHit = {
  ok: false;
  reason: string;
  category:
    | "yas-siniri"
    | "kufur"
    | "cinsellik"
    | "madde"
    | "telif"
    | "siddet"
    | "spam";
};

export type ModerationOk = { ok: true };
export type ModerationResult = ModerationOk | ModerationHit;

/** Duyurular & Kurallar — yalnızca kurucu konu açabilir */
export const LOCKED_CATEGORY_IDS = new Set(["duyurular"]);

export function isCategoryLockedForUsers(categoryId: string): boolean {
  return LOCKED_CATEGORY_IDS.has(categoryId);
}

function normalize(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Kelime sınırı ile ara (yanlış pozitif azaltmak için) */
function hasWord(hay: string, word: string): boolean {
  const re = new RegExp(`(?:^|\\s)${word.replace(/\s+/g, "\\s+")}(?:\\s|$)`);
  return re.test(hay);
}

function hasAnyWord(hay: string, words: string[]): string | null {
  for (const w of words) {
    if (hasWord(hay, w) || hay.includes(` ${w} `) || hay.startsWith(w + " ") || hay.endsWith(" " + w) || hay === w) {
      return w;
    }
    // bitişik yazımlar
    if (w.length >= 4 && hay.includes(w.replace(/\s/g, ""))) {
      return w;
    }
  }
  return null;
}

const PLUS18 = [
  "18+",
  "+18",
  "18 yas",
  "yas siniri",
  "yetiskin icerik",
  "adult",
  "nsfw",
  "onlyfans",
];

const SEXUAL = [
  "porno",
  "porn",
  "xxx",
  "seks",
  "sex",
  "cinsel",
  "cinsellik",
  "erotik",
  "erotizm",
  "nude",
  "ciplak",
  "ciplaklik",
  "escort",
  "eskort",
  "fuhus",
  "masturb",
  "penis",
  "vajina",
  "orospu",
  "kahpe",
  "sikis",
  "sikmek",
  "sikiy",
];

const PROFANITY = [
  "amk",
  "aq",
  "a q",
  "mk",
  "oc",
  "oç",
  "o c",
  "siktir",
  "sikerim",
  "sikerim",
  "sikeyim",
  "amına",
  "amina",
  "amini",
  "göt",
  "gotune",
  "gotunu",
  "yarrak",
  "yarak",
  "piç",
  "pic",
  "pezevenk",
  "gavat",
  "ibne",
  "puşt",
  "pust",
  "mal oglu",
  "salak herif",
  "kahpe",
  "orospu cocugu",
  "orospu cocu",
  "ananı",
  "anani",
  "bacını",
  "bacini",
  "fuck",
  "shit",
  "bitch",
  "asshole",
];

const SUBSTANCE = [
  "uyusturucu",
  "uyuşturucu",
  "esrar",
  "marijuana",
  "marihuana",
  "cannabis",
  "ot sat",
  "ot satis",
  "bonzai",
  "kokain",
  "eroin",
  "heroin",
  "metamfetamin",
  "meth",
  "lsd",
  "extacy",
  "ecstasy",
  "hap satisi",
  "uyusturucu sat",
  "alkol satisi",
  "icki satisi",
  "sarap satisi",
  "bira satisi",
  "votka satisi",
  "rakı satisi",
  "raki satisi",
  "sarhosluk",
  "ayyas",
];

const COPYRIGHT = [
  "crack",
  "keygen",
  "warez",
  "nulled",
  "full program indir",
  "ucretsiz netflix",
  "ucretsiz spotify",
  "bedava film indir",
  "torrent full",
  "telif ihlal",
  "korsan kopya",
  "korsan film",
  "korsan dizi",
  "korsan yazilim",
  "lisans kir",
  "lisans hile",
  "serial key",
  "activation key bedava",
  "pirate bay",
  "illegal indirme",
];

const VIOLENCE = [
  "silah satisi",
  "silah sat",
  "tabanca sat",
  "pompalı",
  "pompali sat",
  "bomba yap",
  "canlı bomba",
  "cinayet plan",
  "oldurme rehber",
];

export function moderateContent(
  title: string,
  body: string = "",
): ModerationResult {
  const raw = `${title}\n${body}`;
  const hay = " " + normalize(raw) + " ";

  // +18 işaretleri
  for (const w of PLUS18) {
    if (hay.includes(normalize(w)) || raw.toLowerCase().includes(w.toLowerCase())) {
      return {
        ok: false,
        category: "yas-siniri",
        reason:
          "İçerik +18 / yaş sınırı gerektiren materyal içeriyor. Bu tür paylaşımlara izin verilmez.",
      };
    }
  }

  if (hasAnyWord(hay, SEXUAL.map(normalize)) || hasAnyWord(hay, SEXUAL)) {
    return {
      ok: false,
      category: "cinsellik",
      reason:
        "Cinsel / müstehcen içerik tespit edildi. Paylaşım otomatik reddedildi.",
    };
  }

  const swear = hasAnyWord(hay, PROFANITY.map(normalize));
  if (swear) {
    return {
      ok: false,
      category: "kufur",
      reason:
        "Küfür veya hakaret içeren ifadeler kullanılamaz. Lütfen saygılı bir dil kullanın.",
    };
  }

  if (hasAnyWord(hay, SUBSTANCE.map(normalize))) {
    return {
      ok: false,
      category: "madde",
      reason:
        "Alkol satışı / teşviki veya uyuşturucu ile ilgili içerik yasaktır. Paylaşım engellendi.",
    };
  }

  if (hasAnyWord(hay, COPYRIGHT.map(normalize))) {
    return {
      ok: false,
      category: "telif",
      reason:
        "Telif hakkı ihlali (korsan, crack, illegal indirme vb.) tespit edildi. Paylaşıma izin verilmez.",
    };
  }

  if (hasAnyWord(hay, VIOLENCE.map(normalize))) {
    return {
      ok: false,
      category: "siddet",
      reason: "Şiddet veya yasadışı silah içeriği engellendi.",
    };
  }

  // Ham metinde sık kullanılan +18 etiketleri
  if (/\b18\s*\+|plus\s*18|nsfw\b/i.test(raw)) {
    return {
      ok: false,
      category: "yas-siniri",
      reason: "+18 / NSFW içerik yayınlanamaz.",
    };
  }

  return { ok: true };
}

export function canPostInCategory(
  categoryId: string,
  isFounderUser: boolean,
): { ok: true } | { ok: false; reason: string } {
  if (isCategoryLockedForUsers(categoryId) && !isFounderUser) {
    return {
      ok: false,
      reason:
        "Duyurular & Kurallar bölümüne yalnızca site kurucusu konu açabilir.",
    };
  }
  return { ok: true };
}
