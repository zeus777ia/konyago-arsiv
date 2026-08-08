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
  priceNote: string;
  contact: string;
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

/** Yeni site — boş. */
export const SEED_LISTINGS: MarketplaceListing[] = [];

export const MARKETPLACE_NOTICE =
  "Bu alan yalnızca ilan panosudur. Sitede ödeme, komisyon veya eskort işlem yapılmaz. Alıcı ve satıcı iletişime geçer; anlaşma ve teslimat site dışında, kendi sorumluluklarındadır.";
