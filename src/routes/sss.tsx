import { createFileRoute, Link } from "@tanstack/react-router";
import { ForumShell } from "@/components/forum/layout";

export const Route = createFileRoute("/sss")({
  component: FaqPage,
});

const FAQ: { q: string; a: string }[] = [
  {
    q: "KonyaGo Arşiv resmî bir kurum sitesi mi?",
    a: "Hayır. Bağımsız bir topluluk forumu ve arşiv panosudur. Kamu kurumu, belediye veya valilik sitesi değildir.",
  },
  {
    q: "Konum neden hemen görünmüyor?",
    a: "Yeni konular otomatik filtreden geçer, ardından moderasyon incelemesine alınır. Onaylanınca herkese açık yayınlanır. Bu, spam ve zararlı içeriği azaltmak içindir.",
  },
  {
    q: "Duyurular bölümüne konu açamıyorum.",
    a: "Doğrudur. Duyurular ve Kurallar yalnızca yönetim (kurucu) tarafından kullanılır.",
  },
  {
    q: "Sitede ödeme yapılıyor mu?",
    a: "Hayır. İkinci el ve iş panosunda platform üzerinden para ticareti yoktur. Anlaşma site dışındadır.",
  },
  {
    q: "Spam koruması nasıl çalışır?",
    a: "Sekiz katmanlı denetim vardır: honeypot, form süresi, metin hijyeni, risk skoru, kalıp engeli, benzerlik, hız limitleri ve ihlal puanı. Ayrıntı: Güvenlik merkezi.",
  },
  {
    q: "Hesabım güvende mi?",
    a: "Şifreler tarayıcıda tuzlu özet (hash) olarak saklanır; düz metin tutulmaz. Güçlü şifre kullanın. Mutlak güvenlik vaat edilmez; temel korumalar uygulanır.",
  },
  {
    q: "İçerik nasıl şikâyet edilir?",
    a: "Konu veya ilan sayfasında “Bildir” kullanın veya info@konyago.com.tr yazın.",
  },
];

function FaqPage() {
  return (
    <ForumShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold tracking-tight">
          Sık sorulan sorular
        </h1>
        <p className="mb-6 text-sm text-muted">
          Kısa ve doğru cevaplar — abartısız bilgilendirme.
        </p>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <dt className="text-sm font-semibold text-fg">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center text-xs text-subtle">
          <Link to="/guvenlik" className="text-primary hover:underline">
            Güvenlik merkezi
          </Link>
          {" · "}
          <Link to="/kurallar" className="text-primary hover:underline">
            Kurallar
          </Link>
          {" · "}
          <Link to="/yasal-uyari" className="text-primary hover:underline">
            Yasal uyarı
          </Link>
        </p>
      </div>
    </ForumShell>
  );
}
