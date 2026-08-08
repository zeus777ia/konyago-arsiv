/** Boş kategoriler için “ilk sen yaz” şablonları */
export const CATEGORY_STARTERS: Record<
  string,
  { title: string; body: string }[]
> = {
  genel: [
    {
      title: "Kendimi tanıtayım — Konya’dan yazıyorum",
      body: "Merhaba!\n\nSemtim:\nNeden buradayım:\nİlgilendiğim konular:\n\n(Kısa ve saygılı tutalım.)",
    },
    {
      title: "Bugün Konya’da ne yapmalı?",
      body: "Arkadaşlar, bugün / bu hafta sonu için önerileriniz neler?\n\nBütçe:\nİlgi alanları:",
    },
  ],
  tarih: [
    {
      title: "Selçuklu mirası hakkında bir sorum var",
      body: "Merhaba,\n\nKonu:\nGördüğüm / okuduğum kaynak:\nSorum:\n\nKaynak paylaşırsanız sevinirim.",
    },
  ],
  mevlana: [
    {
      title: "Mevlana Müzesi ziyaret notlarım",
      body: "Ziyaret tarihi:\nSüre:\nDikkat edilmesi gerekenler:\n\nKısaca izlenimlerim:",
    },
  ],
  gezi: [
    {
      title: "Bu hafta sonu gezi planı arıyorum",
      body: "Kaç kişiyiz:\nAraç var mı:\nİlgilendiğim yerler:\n\nÖnerilerinizi yazın.",
    },
  ],
  semt: [
    {
      title: "Semtimden notlar: [semt adı]",
      body: "Semt:\nEn sevdiğim köşe:\nYeni gelenlere tavsiye:\n",
    },
  ],
  rotalar: [
    {
      title: "1 günlük Konya rotası (öneri)",
      body: "Sabah:\nÖğle:\nAkşam:\nUlaşım notu:\n",
    },
  ],
  mutfak: [
    {
      title: "Etli ekmek / fırın önerisi arıyorum",
      body: "Semt:\nTercihler (etli, sebzeli…):\nBütçe:\n",
    },
  ],
  sicak: [
    {
      title: "Gündem: bugün konuşalım",
      body: "Konu özeti:\nNe düşünüyorsunuz?\n\nLütfen saygılı ve doğrulanabilir bilgi paylaşın.",
    },
  ],
  default: [
    {
      title: "Bu bölümde ilk konuyu açıyorum",
      body: "Merhaba,\n\nKısaca:\n\nSoru / paylaşım:\n",
    },
    {
      title: "Tavsiye istiyorum",
      body: "Konu:\nDetay:\nBeklentim:\n",
    },
  ],
};

export function startersFor(categoryId: string) {
  return CATEGORY_STARTERS[categoryId] ?? CATEGORY_STARTERS.default;
}
