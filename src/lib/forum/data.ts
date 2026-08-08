export type Category = {
  id: string;
  group: string;
  name: string;
  description: string;
  icon: string;
  topics: number;
  posts: number;
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

export const USERS: User[] = [
  { id: "u1", name: "MevlanaSever", title: "Kurucu", posts: 1842, joined: "2024-03-12" },
  { id: "u2", name: "SilleGezgini", title: "Moderatör", posts: 932, joined: "2024-06-01" },
  { id: "u3", name: "EtliEkmekTR", title: "Yerel rehber", posts: 1204, joined: "2024-05-18" },
  { id: "u4", name: "SelcukluTarih", title: "Arşivci", posts: 2103, joined: "2024-02-20" },
  { id: "u5", name: "KonyaHava", posts: 411, joined: "2025-01-09" },
  { id: "u6", name: "TramvaySaati", posts: 288, joined: "2025-04-02" },
  { id: "u7", name: "FotoKonya", title: "Fotoğrafçı", posts: 756, joined: "2024-09-11" },
  { id: "u8", name: "MeramRotası", posts: 534, joined: "2025-02-14" },
  { id: "u9", name: "Karatayli", posts: 190, joined: "2025-11-03" },
  { id: "u10", name: "YeniUye42", posts: 12, joined: "2026-07-22" },
];

export const CATEGORIES: Category[] = [
  {
    id: "duyurular",
    group: "Resmi",
    name: "Duyurular & Kurallar",
    description: "Forum duyuruları ve kurallar",
    icon: "megaphone",
    topics: 48,
    posts: 612,
    color: "#0f6b52",
  },
  {
    id: "sicak",
    group: "Öne çıkan",
    name: "Sıcak Konular",
    description: "Bu haftanın konuşulan başlıkları",
    icon: "flame",
    topics: 126,
    posts: 4890,
    color: "#c45c26",
  },
  {
    id: "tarih",
    group: "Kültür & Tarih",
    name: "Konya Tarihi",
    description: "Selçuklu, Osmanlı ve şehir hafızası",
    icon: "landmark",
    topics: 3840,
    posts: 42100,
    color: "#8b5e34",
  },
  {
    id: "mevlana",
    group: "Kültür & Tarih",
    name: "Mevlana & Tasavvuf",
    description: "Müze, sema ve ziyaret notları",
    icon: "book-open",
    topics: 2190,
    posts: 28600,
    color: "#1a7a5c",
  },
  {
    id: "gezi",
    group: "Keşfet",
    name: "Gezilecek Yerler",
    description: "Müzeler, hanlar, camiler, doğa",
    icon: "map",
    topics: 5620,
    posts: 61400,
    color: "#0f6b52",
  },
  {
    id: "semt",
    group: "Keşfet",
    name: "Semtler & Mahalleler",
    description: "Sille, Meram, Karatay, Selçuklu",
    icon: "building-2",
    topics: 1870,
    posts: 22300,
    color: "#3d6b8a",
  },
  {
    id: "rotalar",
    group: "Keşfet",
    name: "Rotalar & Planlar",
    description: "1 gün / 2 gün gezi planları",
    icon: "route",
    topics: 980,
    posts: 11200,
    color: "#2f7d6b",
  },
  {
    id: "mutfak",
    group: "Lezzet",
    name: "Konya Mutfağı",
    description: "Etli ekmek, fırın, tatlı, restoran",
    icon: "utensils",
    topics: 3240,
    posts: 47800,
    color: "#b45309",
  },
  {
    id: "etkinlik",
    group: "Şehir Hayatı",
    name: "Etkinlikler",
    description: "Konser, sergi, festival",
    icon: "calendar",
    topics: 1560,
    posts: 18900,
    color: "#7c3aed",
  },
  {
    id: "ulasim",
    group: "Şehir Hayatı",
    name: "Ulaşım & Konaklama",
    description: "Tramvay, otobüs, otel",
    icon: "bus",
    topics: 2100,
    posts: 25400,
    color: "#0369a1",
  },
  {
    id: "foto",
    group: "Arşiv",
    name: "Fotoğraf Arşivi",
    description: "Eski ve yeni Konya kareleri",
    icon: "camera",
    topics: 890,
    posts: 13400,
    color: "#475569",
  },
  {
    id: "haber",
    group: "Arşiv",
    name: "Haber & Duyuru",
    description: "Şehirden haberler",
    icon: "newspaper",
    topics: 1420,
    posts: 16800,
    color: "#334155",
  },
  {
    id: "genel",
    group: "Topluluk",
    name: "Genel Sohbet",
    description: "Tanışma ve günlük muhabbet",
    icon: "messages-square",
    topics: 6780,
    posts: 92000,
    color: "#64748b",
  },
  {
    id: "yardim",
    group: "Topluluk",
    name: "Yardım & Destek",
    description: "Forum kullanımı ve destek",
    icon: "life-buoy",
    topics: 320,
    posts: 2100,
    color: "#0f766e",
  },
];

const now = Date.now();
const mins = (m: number) => new Date(now - m * 60_000).toISOString();
const hours = (h: number) => mins(h * 60);
const days = (d: number) => hours(d * 24);

export const THREADS: Thread[] = [
  {
    id: "t1",
    categoryId: "duyurular",
    title: "Hoş geldiniz — forum kuralları",
    authorId: "u1",
    createdAt: days(40),
    lastPostAt: hours(3),
    lastPosterId: "u2",
    replies: 42,
    views: 8120,
    pinned: true,
  },
  {
    id: "t2",
    categoryId: "sicak",
    title: "2026 yazında Konya’da kaçırılmayacak 7 nokta",
    authorId: "u2",
    createdAt: days(2),
    lastPostAt: mins(18),
    lastPosterId: "u8",
    replies: 87,
    views: 4320,
    hot: true,
  },
  {
    id: "t3",
    categoryId: "mutfak",
    title: "Etli ekmek: nerede yenir? (2026 listesi)",
    authorId: "u3",
    createdAt: days(5),
    lastPostAt: mins(35),
    lastPosterId: "u9",
    replies: 156,
    views: 9800,
    hot: true,
  },
  {
    id: "t4",
    categoryId: "gezi",
    title: "Mevlana Müzesi ziyaret saatleri ve ipuçları",
    authorId: "u4",
    createdAt: days(8),
    lastPostAt: mins(52),
    lastPosterId: "u7",
    replies: 64,
    views: 5600,
  },
  {
    id: "t5",
    categoryId: "semt",
    title: "Sille’de sabah yürüyüşü — kahvaltı + sokaklar",
    authorId: "u2",
    createdAt: days(1),
    lastPostAt: hours(1),
    lastPosterId: "u5",
    replies: 29,
    views: 2100,
  },
  {
    id: "t6",
    categoryId: "tarih",
    title: "Alaeddin Tepesi ve Selçuklu izleri",
    authorId: "u4",
    createdAt: days(12),
    lastPostAt: hours(4),
    lastPosterId: "u1",
    replies: 48,
    views: 3900,
  },
  {
    id: "t7",
    categoryId: "rotalar",
    title: "1 günde Konya: Mevlana, Sille, sofra",
    authorId: "u8",
    createdAt: days(3),
    lastPostAt: hours(2),
    lastPosterId: "u3",
    replies: 73,
    views: 6400,
    hot: true,
  },
  {
    id: "t8",
    categoryId: "ulasim",
    title: "Tramvay + otogar aktarma rotası",
    authorId: "u6",
    createdAt: days(6),
    lastPostAt: hours(6),
    lastPosterId: "u6",
    replies: 33,
    views: 2800,
  },
  {
    id: "t9",
    categoryId: "foto",
    title: "1980’lerden Konya: aile albümü taraması",
    authorId: "u7",
    createdAt: days(9),
    lastPostAt: hours(8),
    lastPosterId: "u10",
    replies: 91,
    views: 7200,
  },
  {
    id: "t10",
    categoryId: "etkinlik",
    title: "Bu hafta sonu açık hava etkinlikleri",
    authorId: "u5",
    createdAt: days(1),
    lastPostAt: mins(90),
    lastPosterId: "u2",
    replies: 21,
    views: 1500,
  },
  {
    id: "t11",
    categoryId: "mevlana",
    title: "Sema ayini: bilet, saat ve görgü",
    authorId: "u1",
    createdAt: days(15),
    lastPostAt: days(1),
    lastPosterId: "u4",
    replies: 58,
    views: 5100,
  },
  {
    id: "t12",
    categoryId: "mutfak",
    title: "Fırın kebabı vs etli ekmek",
    authorId: "u3",
    createdAt: days(4),
    lastPostAt: hours(5),
    lastPosterId: "u8",
    replies: 112,
    views: 8100,
  },
  {
    id: "t13",
    categoryId: "genel",
    title: "Konya’ya ilk kez geliyorum — 3 günlük öneri",
    authorId: "u10",
    createdAt: hours(10),
    lastPostAt: mins(12),
    lastPosterId: "u2",
    replies: 18,
    views: 640,
  },
  {
    id: "t14",
    categoryId: "haber",
    title: "İkinci el ve iş panoları açıldı",
    authorId: "u1",
    createdAt: days(1),
    lastPostAt: hours(2),
    lastPosterId: "u1",
    replies: 12,
    views: 980,
    pinned: true,
  },
  {
    id: "t15",
    categoryId: "gezi",
    title: "İnce Minareli Medrese fotoğraf saati?",
    authorId: "u7",
    createdAt: days(2),
    lastPostAt: hours(7),
    lastPosterId: "u7",
    replies: 24,
    views: 1900,
  },
];

export const POSTS: Post[] = [
  {
    id: "p1",
    threadId: "t1",
    authorId: "u1",
    createdAt: days(40),
    body: `KonyaGo Arşiv’e hoş geldiniz.

**Kurallar**
1. Saygılı dil
2. Spam yok
3. İkinci el / iş panolarında sitede ödeme yok — anlaşma dışarıda
4. Telifli içerikte kaynak belirtin

İyi forumlar.`,
  },
  {
    id: "p2",
    threadId: "t1",
    authorId: "u2",
    createdAt: hours(3),
    body: "Kurallar net. Gezi ve Rotalar’dan başlayabilirsiniz.",
  },
  {
    id: "p3",
    threadId: "t2",
    authorId: "u2",
    createdAt: days(2),
    body: `Yaz 2026 kısa liste:
1. Mevlana Müzesi
2. Sille
3. Alaeddin Tepesi
4. Meram Bağları
5. Karatay Medresesi
6. Japon Parkı
7. Tarihi çarşı

Sizin eklemeniz?`,
  },
  {
    id: "p4",
    threadId: "t2",
    authorId: "u8",
    createdAt: mins(18),
    body: "Çatalhöyük eklerdim. Akşam etli ekmek şart.",
  },
  {
    id: "p5",
    threadId: "t3",
    authorId: "u3",
    createdAt: days(5),
    body: `En iyi etli ekmek tartışması:
- Merkez: ince hamur sevenler
- Meram: aile usulü sakin yerler
- Ayran + köz biber hâlâ klasik

Gerçek deneyim yazın.`,
  },
  {
    id: "p6",
    threadId: "t3",
    authorId: "u9",
    createdAt: mins(35),
    body: "Karatay’da hamur çok iyiydi; sabah 11’den önce gidin.",
  },
  {
    id: "p7",
    threadId: "t13",
    authorId: "u10",
    createdAt: hours(10),
    body: "İlk kez geliyorum, 3 günüm var. Yemek + tarih + doğa önerisi?",
  },
  {
    id: "p8",
    threadId: "t13",
    authorId: "u2",
    createdAt: mins(12),
    body: `**Gün 1:** Mevlana → çarşı → etli ekmek  
**Gün 2:** Sille + Karatay  
**Gün 3:** Meram + fotoğraf`,
  },
  {
    id: "p9",
    threadId: "t7",
    authorId: "u8",
    createdAt: days(3),
    body: `08:30 Mevlana · 12:30 etli ekmek · 14:30 Sille · 17:30 Alaeddin · 19:30 Meram
Yazın su ve şapka unutmayın.`,
  },
  {
    id: "p10",
    threadId: "t7",
    authorId: "u3",
    createdAt: hours(2),
    body: "Sille dönüşü trafik olabiliyor; tramvay + minibüs daha rahat.",
  },
  {
    id: "p11",
    threadId: "t4",
    authorId: "u4",
    createdAt: days(8),
    body: "Resmi saatleri kontrol edin; bayramda yoğun. Avlu daha ferah.",
  },
  {
    id: "p12",
    threadId: "t4",
    authorId: "u7",
    createdAt: mins(52),
    body: "09:00 açılışa yakın gittim, kuyruk yoktu.",
  },
  {
    id: "p13",
    threadId: "t14",
    authorId: "u1",
    createdAt: days(1),
    body: `**İkinci el** ve **iş panosu** menüde.

- İkinci el: sitede ödeme yok, alıcı-satıcı dışarıda anlaşır  
- İş: işveren / iş arayan ilan; görüşme dışarıda  

Herkese açık.`,
  },
];

export const STATS = {
  topics: 28_412,
  posts: 214_890,
  members: 6_240,
  newestMember: "YeniUye42",
  online: { total: 184, members: 27, guests: 157 },
};

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
    .filter((t) => t.hot || t.replies > 50)
    .sort((a, b) => b.replies - a.replies)
    .slice(0, limit);
}
