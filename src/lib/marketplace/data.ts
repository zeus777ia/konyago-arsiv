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
  /** base64 data URL — küçük önizleme (max ~400KB) */
  imageDataUrl?: string;
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

/** Tarayıcıda sıkıştırılmış JPEG data URL üretir */
export async function compressImageFile(
  file: File,
  maxEdge = 960,
  quality = 0.72,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Yalnızca görsel dosyası yükleyin");
  }
  if (file.size > 6 * 1024 * 1024) {
    throw new Error("Görsel en fazla 6 MB olabilir");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Görsel işlenemedi");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  if (dataUrl.length > 550_000) {
    throw new Error("Görsel hâlâ çok büyük; daha küçük bir foto seçin");
  }
  return dataUrl;
}
