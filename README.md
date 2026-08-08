# KonyaGo Arşiv

**konyagoarsiv.org** için forum arayüzü — [Donanım Arşivi Forum](https://forum.donanimarsivi.com) düzeninden esinlenen, Konya odaklı dijital arşiv.

## Özellikler

- Kategori grupları (Gezi, Mutfak, Tarih, Semtler, Rotalar, …)
- Konu listesi (sabit / sıcak rozetleri, cevap & hit)
- Konu detayı + cevap yazma
- Yeni konu açma
- Yan menü: sıcak konular, son içerikler, çevrim içi, istatistikler
- Arama, mobil uyumlu layout
- Demo veriler (tarayıcıda localStorage ile kalıcı yeni konu/cevap)

## Geliştirme

```bash
npm install
npm run dev      # 0.0.0.0:8080
npm run build
npm run typecheck
```

Stack: React 19, TanStack Start, Tailwind v4, Zustand.

## Domain

Hedef site: **https://konyagoarsiv.org**  
İlgili proje: [konyago.com.tr](https://konyago.com.tr)

## Not

Bu depo demo arayüz + örnek içerik içerir. Canlı üretim forumu için backend (XenForo / Discourse / özel API) bağlanmalıdır.
