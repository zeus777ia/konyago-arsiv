import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, Section } from "@/components/legal/legal-layout";
import { LEGAL } from "@/lib/legal/content";

export const Route = createFileRoute("/gizlilik")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Gizlilik Politikası">
      <Section title="1. Politikanın konusu">
        <p>
          Bu Gizlilik Politikası, {LEGAL.controller.name} (“biz”, “Platform”)
          tarafından işletilen konyagoarsiv.org sitesinde gizliliğinizin nasıl
          korunduğunu, hangi bilgilerin toplandığını ve nasıl kullanıldığını
          açıklar. KVKK Aydınlatma Metni ile birlikte okunmalıdır.
        </p>
        <p>
          Platform, Konya odaklı bağımsız bir topluluk arşivi ve ilan panosudur.
          Resmî bir kurum sitesi değildir.
        </p>
      </Section>

      <Section title="2. Topladığımız bilgiler">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-fg">Doğrudan verdiğiniz bilgiler:</strong>{" "}
            e-posta, görünen ad, şifre, forum yazıları, ikinci el ve iş ilanı
            içerikleri, iletişim bilgileri
          </li>
          <li>
            <strong className="text-fg">Otomatik bilgiler:</strong> tarayıcı
            depolama verileri, oturum durumu, temel teknik kayıtlar
          </li>
          <li>
            <strong className="text-fg">E-posta iletişimi:</strong> hoş geldin
            ve şifre sıfırlama gibi işlem mailleri; bize yazdığınız mesajlar
          </li>
        </ul>
      </Section>

      <Section title="3. Bilgileri nasıl kullanırız">
        <ul className="list-disc space-y-1 pl-5">
          <li>Hesap oluşturma, giriş ve şifre sıfırlama</li>
          <li>Platform özelliklerini (forum, ilanlar) sunma</li>
          <li>
            İşlem bilgilendirmeleri gönderme (gönderen: {LEGAL.controller.email})
          </li>
          <li>Güvenlik, spam ve kötüye kullanımla mücadele</li>
          <li>Yasal yükümlülüklere uyum ve kullanıcı taleplerine yanıt</li>
        </ul>
        <p>
          Bilgilerinizi izinsiz olarak üçüncü taraflara satmayız. Reklam ağı
          ortaklarına kimlik bilgisi satışı yapılmaz.
        </p>
      </Section>

      <Section title="4. Çerezler ve yerel depolama">
        <p>
          Site, oturum ve tercihleri hatırlamak için tarayıcı yerel depolama
          (localStorage) ve benzeri teknolojiler kullanabilir. Bu veriler
          cihazınızda tutulur; tarayıcı ayarlarından temizlenebilir. Temizleme
          hesabınıza ve yerelde saklanan içeriklere erişimi kaybettirebilir.
        </p>
      </Section>

      <Section title="5. E-posta iletişimi">
        <p>
          Kayıt olduğunuzda aramıza hoş geldiniz e-postası; şifre unutma
          talebinde sıfırlama kodu e-postası gönderilir. Gönderimler{" "}
          <strong className="text-fg">{LEGAL.controller.email}</strong> kimliği
          / yanıt adresi ile ilişkilendirilir. Pazarlama bülteni göndermeyiz;
          ileride böyle bir kanal açılırsa ayrıca onay istenir.
        </p>
        <p>
          İlk e-posta iletiminde e-posta sağlayıcınızın onay / spam politikaları
          nedeniyle kutunuza düşmesi gecikebilir; spam klasörünü kontrol edin.
        </p>
      </Section>

      <Section title="6. Herkese açık içerik">
        <p>
          Forum mesajları ve ilanlar platform kullanıcıları tarafından
          görülebilir. İkinci el / iş panosunda yazdığınız telefon veya e-posta
          gibi bilgiler diğer ziyaretçilere açık olur. Paylaşmadan önce
          dikkatli olun. Sitede ödeme alınmaz; ticaret ve görüşmeler site
          dışındadır ve tarafların kendi sorumluluğundadır.
        </p>
      </Section>

      <Section title="7. Üçüncü taraf siteler">
        <p>
          Sitede konyago.com.tr ve başka bağlantılar bulunabilir. Bu sitelerin
          gizlilik uygulamalarından sorumlu değiliz. Bağlantıya tıkladığınızda
          ilgili sitenin politikası geçerli olur.
        </p>
      </Section>

      <Section title="8. Veri güvenliği">
        <p>
          Şifreler hash’lenerek saklanır; HTTPS kullanılır. Buna rağmen hiçbir
          sistem %100 güvenli değildir. Şüpheli bir durum fark ederseniz{" "}
          <a
            className="text-primary hover:underline"
            href={`mailto:${LEGAL.controller.email}`}
          >
            {LEGAL.controller.email}
          </a>{" "}
          adresine bildirin.
        </p>
      </Section>

      <Section title="9. Haklarınız ve iletişim">
        <p>
          KVKK kapsamındaki haklarınız Aydınlatma Metni’nde listelenmiştir.
          Gizlilikle ilgili sorularınız için:{" "}
          <a
            className="text-primary hover:underline"
            href={`mailto:${LEGAL.controller.email}`}
          >
            {LEGAL.controller.email}
          </a>
        </p>
      </Section>

      <Section title="10. Değişiklikler">
        <p>
          Bu politika güncellenebilir. Önemli değişikliklerde sitede duyuru
          yapılır. Son güncelleme: {LEGAL.updatedAt}.
        </p>
      </Section>
    </LegalLayout>
  );
}
