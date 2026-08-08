export type ListingCondition = "sifir" | "cok-iyi" | "iyi" | "orta";
export type ListingCategory =
  | "elektronik"
  | "ev"
  | "giyim"
  | "arac"
  | "kitap"
  | "diger";

export type MarketplaceListing = {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  condition: ListingCondition;
  district: string;
  priceNote: string; // free-text price hint only — no payment on site
  contact: string; // phone / telegram / etc shown to interested parties
  authorName: string;
  createdAt: string;
  status: "aktif" | "satildi" | "kaldirildi";
};

export const LISTING_CATEGORIES: { id: ListingCategory; label: string }[] = [
  { id: "elektronik", label: "Elektronik" },
  { id: "ev", label: "Ev & Yaşam" },
  { id: "giyim", label: "Giyim" },
  { id: "arac", label: "Araç & Bisiklet" },
  { id: "kitap", label: "Kitap & Hobi" },
  { id: "diger", label: "Diğer" },
];

export const CONDITIONS: { id: ListingCondition; label: string }[] = [
  { id: "sifir", label: "Sıfır gibi" },
  { id: "cok-iyi", label: "Çok iyi" },
  { id: "iyi", label: "İyi" },
  { id: "orta", label: "Orta" },
];

export const DISTRICTS = [
  "Selçuklu",
  "Meram",
  "Karatay",
  "Sille",
  "Çumra",
  "Ereğli",
  "Akşehir",
  "Diğer / Konya geneli",
];

const now = Date.now();
const hours = (h: number) => new Date(now - h * 3600_000).toISOString();
const days = (d: number) => hours(d * 24);

export const SEED_LISTINGS: MarketplaceListing[] = [
  {
    id: "m1",
    title: "Kullanılmış kitaplık + 20 kitap",
    description:
      "Taşınma nedeniyle satılık. Kitaplık sağlam, kitaplar karışık (roman + tarih). Yüz yüze teslim Selçuklu.",
    category: "kitap",
    condition: "iyi",
    district: "Selçuklu",
    priceNote: "1.200 ₺ civarı (pazarlık)",
    contact: "Mesaj: @kitapkonya",
    authorName: "MeramRotası",
    createdAt: hours(5),
    status: "aktif",
  },
  {
    id: "m2",
    title: "Çalışır vaziyette bisiklet",
    description:
      "Şehir içi kullanım, vitesli. Frenler yeni. Site üzerinden ödeme yok; buluşup elden teslim.",
    category: "arac",
    condition: "cok-iyi",
    district: "Meram",
    priceNote: "3.500 ₺",
    contact: "Tel: 05xx (ilan sonrası özel)",
    authorName: "Karatayli",
    createdAt: days(1),
    status: "aktif",
  },
  {
    id: "m3",
    title: "Bebek arabası (az kullanılmış)",
    description:
      "Kışın 3 ay kullanıldı. Temiz. Sadece yüz yüze, sitede para transferi yok.",
    category: "ev",
    condition: "cok-iyi",
    district: "Karatay",
    priceNote: "2.000 ₺",
    authorName: "SilleGezgini",
    contact: "DM / WhatsApp ilan sonrası",
    createdAt: days(2),
    status: "aktif",
  },
  {
    id: "m4",
    title: "Eski fotoğraf makinesi gövdesi",
    description:
      "Koleksiyon / hobi. Çalışıyor, kutu yok. Alıcı ile sitede buluşun, ticareti dışarıda yapın.",
    category: "elektronik",
    condition: "orta",
    district: "Selçuklu",
    priceNote: "Tekliflere açık",
    contact: "forum mesajı",
    authorName: "FotoKonya",
    createdAt: days(3),
    status: "aktif",
  },
];

export const MARKETPLACE_NOTICE =
  "Bu alan yalnızca ilan panosudur. Sitede ödeme, komisyon veya eskort işlem yapılmaz. Alıcı ve satıcı iletişime geçer; anlaşma ve teslimat site dışında, kendi sorumluluklarındadır.";
