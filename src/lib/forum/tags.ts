/** Önerilen etiketler — serbest etiket de kabul edilir */
export const SUGGESTED_TAGS = [
  "Sille",
  "Meram",
  "Selçuklu",
  "Karatay",
  "Mevlana",
  "Etli ekmek",
  "Gezi",
  "Tarih",
  "Yemek",
  "Ulaşım",
  "Fotoğraf",
  "Soru",
  "Tavsiye",
  "İkinci el",
  "İş",
] as const;

export function normalizeTags(raw: string[] | undefined): string[] {
  if (!raw?.length) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    const clean = t
      .trim()
      .replace(/^#+/, "")
      .slice(0, 24)
      .replace(/\s+/g, " ");
    if (clean.length < 2) continue;
    const key = clean.toLocaleLowerCase("tr");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    if (out.length >= 5) break;
  }
  return out;
}

export function parseTagsInput(s: string): string[] {
  return normalizeTags(
    s
      .split(/[,#]+/)
      .map((x) => x.trim())
      .filter(Boolean),
  );
}
