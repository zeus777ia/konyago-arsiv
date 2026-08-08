import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, Section } from "@/components/legal/legal-layout";
import { LEGAL } from "@/lib/legal/content";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/yasal-uyari")({
  head: () =>
    seoHead({
      title: 'Yasal uyarı',
      description: 'Yasal uyarı: bağımsız topluluk platformu, resmî kurum sitesi değildir.',
      path: '/yasal-uyari',
    }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalLayout title="Yasal Uyarı ve Sorumluluk Reddi">
      <Section title="1. Resmî site değildir">
        <p>
          <strong className="text-fg">
            konyagoarsiv.org resmî bir web sitesi değildir.
          </strong>{" "}
          Bu platform; T.C. kamu kurumları, Konya Büyükşehir Belediyesi, ilçe
          belediyeleri, valilik, kaymakamlık, bakanlıklar veya herhangi bir
          resmî kuruluş adına hareket etmez; onların resmî yayın organı,
          duyuru kanalı veya e-devlet benzeri bir hizmeti değildir.
        </p>
        <p>
          Resmî işlemler, başvurular ve duyurular için yalnızca ilgili
          kurumların kendi resmî internet siteleri ve kanalları kullanılmalıdır.
        </p>
      </Section>

      <Section title="2. Platformun niteliği">
        <p>
          KonyaGo Arşiv; Konya ile ilgili sohbet, arşiv notu, ikinci el ilan ve
          iş panosu sunan bağımsız bir topluluk sitesidir. İçerikler
          kullanıcılar tarafından üretilir. Bilgilerin doğruluğu, güncelliği
          veya eksiksizliği garanti edilmez.
        </p>
      </Section>

      <Section title="3. Kullanıcı içerikleri">
        <p>
          Forum yazıları, ilanlar ve paylaşılan bağlantılardan doğan hukuki,
          cezai ve mali sorumluluk içeriği yayınlayan kullanıcıya aittir.
          Platform, önceden bilgilendirilmeksizin hukuka aykırı içerikleri
          kaldırma veya hesabı askıya alma hakkını saklı tutar.
        </p>
      </Section>

      <Section title="4. İkinci el ve iş panosu">
        <p>
          İkinci el ve iş bölümleri yalnızca ilan panosudur. Sitede ödeme,
          tahsilat, komisyon, emanet veya aracılık hizmeti sunulmaz. Alıcı–satıcı
          ve işveren–aday anlaşmaları site dışında, tarafların kendi
          sorumluluğunda yapılır. Dolandırıcılık, ayıplı mal, ücret anlaşmazlığı
          gibi konularda Platform taraf değildir.
        </p>
      </Section>

      <Section title="5. Sorumluluğun sınırları">
        <p>
          Platform; dolaylı, arızi veya sonuç olarak ortaya çıkan zararlardan,
          kâr kaybından, veri kaybından veya iş kesintisinden, kanunen izin
          verilen azami ölçüde sorumlu tutulamaz. Hizmet “olduğu gibi”
          sunulur; kesintisiz veya hatasız çalışma taahhüt edilmez.
        </p>
      </Section>

      <Section title="6. Fikri mülkiyet">
        <p>
          Site tasarımı, logolar ve Platform’a ait metinler korunur. Kullanıcı
          içeriklerinin hakları ilgili kullanıcıya aittir; Platform’a yalnızca
          hizmeti sunmak için gerekli lisansı verir.
        </p>
      </Section>

      <Section title="7. Uygulanacak hukuk">
        <p>
          Bu metinden doğan uyuşmazlıklarda Türkiye Cumhuriyeti hukuku uygulanır;
          yetkili mahkemeler Konya mahkemeleri ve icra daireleridir (kanunen
          zorunlu haller saklıdır).
        </p>
      </Section>

      <Section title="8. İletişim">
        <p>
          Sorularınız için:{" "}
          <a
            className="text-primary hover:underline"
            href={`mailto:${LEGAL.controller.email}`}
          >
            {LEGAL.controller.email}
          </a>
        </p>
        <p>
          Ayrıca{" "}
          <Link to="/kvkk" className="text-primary hover:underline">
            KVKK Aydınlatma
          </Link>{" "}
          ve{" "}
          <Link to="/gizlilik" className="text-primary hover:underline">
            Gizlilik Politikası
          </Link>{" "}
          metinlerini inceleyiniz.
        </p>
      </Section>
    </LegalLayout>
  );
}
