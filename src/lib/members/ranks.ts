/**
 * Aktiflik rozetleri (kademe) + profil çerçeveleri.
 * Süre: oturum açıkken sayılan dakika (görünür sekme).
 */

export type RankId =
  | "yeni"
  | "merakli"
  | "aktif"
  | "duzenli"
  | "kidemli"
  | "emektar"
  | "efsane";

export type FrameId =
  | "none"
  | "bronze"
  | "silver"
  | "gold"
  | "emerald"
  | "obsidian";

export type MemberActivity = {
  /** Toplam aktif dakika */
  totalMinutes: number;
  /** Bugünkü dakika (yerel gün) */
  dayMinutes: number;
  /** dayKey yyyy-mm-dd */
  dayKey: string;
  /** Farklı aktif gün sayısı */
  activeDays: number;
  /** Son tick ISO */
  lastTickAt?: string;
  /** Üst üste aktif gün */
  streakDays: number;
};

export const DEFAULT_ACTIVITY: MemberActivity = {
  totalMinutes: 0,
  dayMinutes: 0,
  dayKey: "",
  activeDays: 0,
  streakDays: 0,
};

export type RankDef = {
  id: RankId;
  label: string;
  /** Minimum toplam dakika */
  minMinutes: number;
  description: string;
  /** Tailwind-ish classes for badge */
  className: string;
};

/** Kademe kademe aktiflik rozetleri (süre odaklı) */
export const RANKS: RankDef[] = [
  {
    id: "yeni",
    label: "Yeni üye",
    minMinutes: 0,
    description: "Topluluğa yeni katıldınız",
    className: "bg-badge text-muted border-border",
  },
  {
    id: "merakli",
    label: "Meraklı",
    minMinutes: 30,
    description: "30+ dakika aktif",
    className: "bg-sky-50 text-sky-800 border-sky-200",
  },
  {
    id: "aktif",
    label: "Aktif",
    minMinutes: 3 * 60,
    description: "3+ saat aktif",
    className: "bg-primary-soft text-primary border-primary/25",
  },
  {
    id: "duzenli",
    label: "Düzenli",
    minMinutes: 10 * 60,
    description: "10+ saat aktif",
    className: "bg-violet-50 text-violet-800 border-violet-200",
  },
  {
    id: "kidemli",
    label: "Kıdemli",
    minMinutes: 30 * 60,
    description: "30+ saat aktif",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  {
    id: "emektar",
    label: "Emektar",
    minMinutes: 100 * 60,
    description: "100+ saat aktif",
    className: "bg-orange-50 text-orange-900 border-orange-200",
  },
  {
    id: "efsane",
    label: "Efsane",
    minMinutes: 300 * 60,
    description: "300+ saat aktif",
    className: "bg-rose-50 text-rose-900 border-rose-200",
  },
];

export type FrameDef = {
  id: FrameId;
  label: string;
  /** Toplam saat eşiği */
  minHours: number;
  /** En az bu kadar farklı günde aktif olmalı */
  minActiveDays: number;
  description: string;
  ringClass: string;
};

/**
 * Profil çerçevesi: düzenli aktiflik + belirli saat aralığı.
 * Hepsi birikimli — önceki kademe gerekmez, eşik aşıldığında açılır.
 */
export const FRAMES: FrameDef[] = [
  {
    id: "none",
    label: "Çerçevesiz",
    minHours: 0,
    minActiveDays: 0,
    description: "Henüz çerçeve kazanılmadı",
    ringClass: "",
  },
  {
    id: "bronze",
    label: "Bronz çerçeve",
    minHours: 5,
    minActiveDays: 3,
    description: "5 saat + en az 3 farklı günde aktif",
    ringClass: "frame-bronze",
  },
  {
    id: "silver",
    label: "Gümüş çerçeve",
    minHours: 20,
    minActiveDays: 7,
    description: "20 saat + en az 7 farklı günde aktif",
    ringClass: "frame-silver",
  },
  {
    id: "gold",
    label: "Altın çerçeve",
    minHours: 50,
    minActiveDays: 14,
    description: "50 saat + en az 14 farklı günde aktif",
    ringClass: "frame-gold",
  },
  {
    id: "emerald",
    label: "Zümrüt çerçeve",
    minHours: 100,
    minActiveDays: 21,
    description: "100 saat + en az 21 farklı günde aktif",
    ringClass: "frame-emerald",
  },
  {
    id: "obsidian",
    label: "Obsidyen çerçeve",
    minHours: 250,
    minActiveDays: 40,
    description: "250 saat + en az 40 farklı günde aktif",
    ringClass: "frame-obsidian",
  },
];

export function localDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function normalizeActivity(
  raw?: Partial<MemberActivity> | null,
): MemberActivity {
  return {
    totalMinutes: Math.max(0, Math.floor(raw?.totalMinutes ?? 0)),
    dayMinutes: Math.max(0, Math.floor(raw?.dayMinutes ?? 0)),
    dayKey: raw?.dayKey ?? "",
    activeDays: Math.max(0, Math.floor(raw?.activeDays ?? 0)),
    lastTickAt: raw?.lastTickAt,
    streakDays: Math.max(0, Math.floor(raw?.streakDays ?? 0)),
  };
}

export function getRank(totalMinutes: number): RankDef {
  let current = RANKS[0]!;
  for (const r of RANKS) {
    if (totalMinutes >= r.minMinutes) current = r;
  }
  return current;
}

export function getFrame(activity: MemberActivity): FrameDef {
  const hours = activity.totalMinutes / 60;
  let current = FRAMES[0]!;
  for (const f of FRAMES) {
    if (hours >= f.minHours && activity.activeDays >= f.minActiveDays) {
      current = f;
    }
  }
  return current;
}

export function nextRank(totalMinutes: number): RankDef | null {
  const cur = getRank(totalMinutes);
  const idx = RANKS.findIndex((r) => r.id === cur.id);
  return RANKS[idx + 1] ?? null;
}

export function nextFrame(activity: MemberActivity): FrameDef | null {
  const cur = getFrame(activity);
  const idx = FRAMES.findIndex((f) => f.id === cur.id);
  return FRAMES[idx + 1] ?? null;
}

export function formatActiveDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h < 48) return m ? `${h} sa ${m} dk` : `${h} sa`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return rh ? `${d} gün ${rh} sa` : `${d} gün`;
}

/** Apply one minute of activity (or catch-up minutes) */
export function applyActivityTick(
  prev: MemberActivity,
  minutes = 1,
  now = new Date(),
): MemberActivity {
  const key = localDayKey(now);
  let dayMinutes = prev.dayMinutes;
  let activeDays = prev.activeDays;
  let streakDays = prev.streakDays;
  let dayKey = prev.dayKey;

  if (dayKey !== key) {
    // new calendar day
    if (dayKey) {
      // streak: yesterday consecutive?
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = localDayKey(yesterday);
      streakDays = dayKey === yKey ? streakDays + 1 : 1;
    } else {
      streakDays = 1;
    }
    dayMinutes = 0;
    dayKey = key;
    activeDays += 1;
  }

  dayMinutes += minutes;
  return {
    totalMinutes: prev.totalMinutes + minutes,
    dayMinutes,
    dayKey,
    activeDays,
    streakDays: Math.max(streakDays, 1),
    lastTickAt: now.toISOString(),
  };
}
