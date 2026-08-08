export type Category = {
  id: string;
  group: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

export type User = {
  id: string;
  name: string;
  title?: string;
  posts: number;
  joined: string;
};

export type Thread = {
  id: string;
  categoryId: string;
  title: string;
  authorId: string;
  createdAt: string;
  lastPostAt: string;
  lastPosterId: string;
  replies: number;
  views: number;
  pinned?: boolean;
  locked?: boolean;
  hot?: boolean;
};

export type Post = {
  id: string;
  threadId: string;
  authorId: string;
  createdAt: string;
  body: string;
};

export const SITE = {
  name: "KonyaGo Arşiv",
  domain: "konyagoarsiv.org",
  tagline: "Forum · İkinci el · İş panosu",
  url: "https://konyagoarsiv.org",
} as const;

/** Seed users — empty; gerçek üyeler local membership store’da. */
export const USERS: User[] = [];

export const CATEGORIES: Category[] = [
  {
    id: "duyurular",
    group: "Resmi",
    name: "Duyurular & Kurallar",
    description: "Forum duyuruları ve kurallar",
    icon: "megaphone",
    color: "#0f6b52",
  },
  {
    id: "sicak",
    group: "Öne çıkan",
    name: "Sıcak Konular",
    description: "Gündemdeki başlıklar",
    icon: "flame",
    color: "#c45c26",
  },
  {
    id: "tarih",
    group: "Kültür & Tarih",
    name: "Konya Tarihi",
    description: "Selçuklu, Osmanlı ve şehir hafızası",
    icon: "landmark",
    color: "#8b5e34",
  },
  {
    id: "mevlana",
    group: "Kültür & Tarih",
    name: "Mevlana & Tasavvuf",
    description: "Müze, sema ve ziyaret notları",
    icon: "book-open",
    color: "#1a7a5c",
  },
  {
    id: "gezi",
    group: "Keşfet",
    name: "Gezilecek Yerler",
    description: "Müzeler, hanlar, camiler, doğa",
    icon: "map",
    color: "#0f6b52",
  },
  {
    id: "semt",
    group: "Keşfet",
    name: "Semtler & Mahalleler",
    description: "Sille, Meram, Karatay, Selçuklu",
    icon: "building-2",
    color: "#3d6b8a",
  },
  {
    id: "rotalar",
    group: "Keşfet",
    name: "Rotalar & Planlar",
    description: "1 gün / 2 gün gezi planları",
    icon: "route",
    color: "#2f7d6b",
  },
  {
    id: "mutfak",
    group: "Lezzet",
    name: "Konya Mutfağı",
    description: "Etli ekmek, fırın, tatlı, restoran",
    icon: "utensils",
    color: "#b45309",
  },
  {
    id: "etkinlik",
    group: "Şehir Hayatı",
    name: "Etkinlikler",
    description: "Konser, sergi, festival",
    icon: "calendar",
    color: "#7c3aed",
  },
  {
    id: "ulasim",
    group: "Şehir Hayatı",
    name: "Ulaşım & Konaklama",
    description: "Tramvay, otobüs, otel",
    icon: "bus",
    color: "#0369a1",
  },
  {
    id: "foto",
    group: "Arşiv",
    name: "Fotoğraf Arşivi",
    description: "Eski ve yeni Konya kareleri",
    icon: "camera",
    color: "#475569",
  },
  {
    id: "haber",
    group: "Arşiv",
    name: "Haber & Duyuru",
    description: "Şehirden haberler",
    icon: "newspaper",
    color: "#334155",
  },
  {
    id: "genel",
    group: "Topluluk",
    name: "Genel Sohbet",
    description: "Tanışma ve günlük muhabbet",
    icon: "messages-square",
    color: "#64748b",
  },
  {
    id: "yardim",
    group: "Topluluk",
    name: "Yardım & Destek",
    description: "Forum kullanımı ve destek",
    icon: "life-buoy",
    color: "#0f766e",
  },
];

/** Yeni site — başlangıçta boş; içerik kullanıcılar tarafından eklenir. */
export const THREADS: Thread[] = [];
export const POSTS: Post[] = [];

export function getUser(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getThread(id: string) {
  return THREADS.find((t) => t.id === id);
}

export function threadsByCategory(categoryId: string) {
  return THREADS.filter((t) => t.categoryId === categoryId).sort(
    (a, b) => +new Date(b.lastPostAt) - +new Date(a.lastPostAt),
  );
}

export function latestThreads(limit = 12) {
  return [...THREADS]
    .sort((a, b) => +new Date(b.lastPostAt) - +new Date(a.lastPostAt))
    .slice(0, limit);
}

export function postsByThread(threadId: string) {
  return POSTS.filter((p) => p.threadId === threadId).sort(
    (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
  );
}

export function categoryGroups() {
  const map = new Map<string, Category[]>();
  for (const c of CATEGORIES) {
    const list = map.get(c.group) ?? [];
    list.push(c);
    map.set(c.group, list);
  }
  return [...map.entries()];
}

export function hotThreads(limit = 5) {
  return [...THREADS]
    .filter((t) => t.hot || t.replies > 5)
    .sort((a, b) => b.replies - a.replies)
    .slice(0, limit);
}
