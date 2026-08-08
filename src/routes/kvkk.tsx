import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, Section } from "@/components/legal/legal-layout";
import { LEGAL } from "@/lib/legal/content";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/kvkk")({
  head: () =>
    seoHead({
      title: 'KVKK',
      description: 'Kişisel verilerin korunması ve aydınlatma metni.',
      path: '/kvkk',
    }),
  component: KvkkPage,
});

function KvkkPage() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni">
      <Section title="1. Amaç ve kapsam">
        <p>
          İşbu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”)
          uyarınca, {LEGAL.controller.name} (“Platform”, “Site”) tarafından
          işlenen kişisel verilerinize ilişkin sizi bilgilendirmek amacıyla
          hazırlanmıştır. Siteyi ziyaret etmeniz, üye olmanız veya ilan / konu
          paylaşmanız bu metinde açıklanan veri işleme faaliyetlerini
          kabul ettiğiniz anlamına gelmez; yasal dayanaklar aşağıda belirtilir.
        </p>
        <p>
          <strong className="text-fg">Önemli:</strong> Bu site bağımsız bir
          topluluk arşividir; resmi bir kamu kurumu, belediye, valilik veya
          herhangi bir devlet organının resmî web sitesi değildir.
        </p>
      </Section>

      <Section title="2. Veri sorumlusu">
        <p>
          KVKK kapsamında veri sorumlusu sıfatıyla hareket eden taraf:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Unvan / ad: {LEGAL.controller.name}</li>
          <li>
            E-posta:{" "}
            <a
              className="text-primary hover:underline"
              href={`mailto:${LEGAL.controller.email}`}
            >
              {LEGAL.controller.email}
            </a>
          </li>
          <li>İlgili marka / site: {LEGAL.controller.related}</li>
        </ul>
        <p>
          Kişisel verilerinize ilişkin taleplerinizi bu e-posta adresine
          iletebilirsiniz. Talepleriniz, KVKK m.13 ve ilgili mevzuat
          çerçevesinde en geç otuz gün içinde sonuçlandırılır.
        </p>
      </Section>

      <Section title="3. İşlenen kişisel veri kategorileri">
        <p>Platform kapsamında işlenebilecek veriler:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-fg">Kimlik / iletişim:</strong> görünen ad,
            e-posta adresi
          </li>
          <li>
            <strong className="text-fg">Hesap güvenliği:</strong> şifre özeti
            (hash; düz metin şifre saklanmaz), şifre sıfırlama kodu özeti ve
            son kullanma bilgisi
          </li>
          <li>
            <strong className="text-fg">İçerik verileri:</strong> forum konuları
            ve mesajları, ikinci el ve iş panosu ilan metinleri, iletişim
            notları (telefon, kullanıcı adı vb. sizin girdiğiniz bilgiler)
          </li>
          <li>
            <strong className="text-fg">İşlem güvenliği / teknik:</strong> tarayıcı
            depolama (localStorage) kayıtları, oturum durumu, temel hata ve
            kullanım kayıtları
          </li>
          <li>
            <strong className="text-fg">İletişim kayıtları:</strong>{" "}
            {LEGAL.controller.email} adresine gönderdiğiniz talepler
          </li>
        </ul>
        <p>
          Özel nitelikli kişisel veri (sağlık, din, siyasi görüş vb.) talep
          edilmez; lütfen bu tür verileri ilan veya mesajlarda paylaşmayın.
        </p>
      </Section>

      <Section title="4. Verilerin işlenme amaçları">
        <ul className="list-disc space-y-1 pl-5">
          <li>Üyelik hesabı oluşturma, giriş ve oturum yönetimi</li>
          <li>Şifre sıfırlama ve hesap güvenliği</li>
          <li>Hoş geldiniz ve işlem bilgilendirme e-postaları gönderme</li>
          <li>Forum, ikinci el ve iş panosu işlevlerinin sunulması</li>
          <li>Topluluk kurallarının ve yasal yükümlülüklerin yerine getirilmesi</li>
          <li>Kötüye kullanım, spam ve güvenlik ihlallerinin önlenmesi</li>
          <li>Kullanıcı taleplerine ve yasal başvurularda cevap verilmesi</li>
        </ul>
      </Section>

      <Section title="5. Hukuki sebepler (KVKK m.5 ve m.6)">
        <p>Verileriniz başlıca şu hukuki sebeplere dayanılarak işlenir:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması
            (üyelik ve platform hizmeti)
          </li>
          <li>
            Veri sorumlusunun meşru menfaati (güvenlik, spam önleme, hizmet
            iyileştirme) — temel hak ve özgürlüklerinize zarar vermemek kaydıyla
          </li>
          <li>Açık rızanızın bulunduğu haller (ör. isteğe bağlı iletişim)</li>
          <li>
            Kanunlarda açıkça öngörülmesi veya hukuki yükümlülüğün yerine
            getirilmesi
          </li>
        </ul>
      </Section>

      <Section title="6. Saklama yeri ve süre">
        <p>
          Mevcut teknik yapıda üyelik ve içerik verilerinin bir kısmı
          tarayıcınızın yerel depolama alanında (localStorage) tutulabilir;
          e-posta iletimi üçüncü taraf e-posta altyapıları üzerinden yapılır.
          Veriler, işleme amacının gerektirdiği süre ve yasal zamanaşımı
          süreleri boyunca saklanır; amaç sona erdiğinde silinir, yok edilir
          veya anonim hale getirilir.
        </p>
        <p>
          Şifre sıfırlama kodları en fazla 30 dakika geçerlidir ve kullanıldıktan
          sonra silinir.
        </p>
      </Section>

      <Section title="7. Aktarım">
        <p>
          Kişisel verileriniz, yurt içinde veya yurt dışında bulunan e-posta
          iletim servis sağlayıcılarına, barındırma / CDN sağlayıcılarına ve
          yasal zorunluluk halinde yetkili kamu kurumlarına aktarılabilir.
          Aktarımlarda KVKK’nın yurt dışı aktarım hükümlerine ve teknik-idari
          tedbirlere uyulmasına özen gösterilir.
        </p>
        <p>
          İkinci el ve iş ilanlarında paylaştığınız iletişim bilgileri, ilanı
          gören diğer kullanıcılara açık hale gelir; bu paylaşım sizin
          sorumluluğunuzdadır.
        </p>
      </Section>

      <Section title="8. Toplanma yöntemi">
        <p>
          Veriler; üyelik ve giriş formları, şifre sıfırlama formu, forum / ilan
          formları, e-posta iletişimi ve otomatik teknik kayıtlar yoluyla
          elektronik ortamda toplanır.
        </p>
      </Section>

      <Section title="9. KVKK m.11 kapsamındaki haklarınız">
        <p>Veri sahibi olarak:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>
            Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
          </li>
          <li>
            Eksik veya yanlış işlenmişse düzeltilmesini isteme
          </li>
          <li>
            KVKK m.7 çerçevesinde silinmesini veya yok edilmesini isteme
          </li>
          <li>
            Düzeltme / silme işlemlerinin aktarıldığı üçüncü kişilere
            bildirilmesini isteme
          </li>
          <li>
            Münhasıran otomatik sistemlerle analiz edilmesi nedeniyle aleyhinize
            bir sonucun ortaya çıkmasına itiraz etme
          </li>
          <li>
            Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın
            giderilmesini talep etme
          </li>
        </ul>
        <p>
          Başvurularınızı{" "}
          <a
            className="text-primary hover:underline"
            href={`mailto:${LEGAL.controller.email}`}
          >
            {LEGAL.controller.email}
          </a>{" "}
          adresine iletebilirsiniz. Gerekirse kimlik doğrulaması istenebilir.
        </p>
      </Section>

      <Section title="10. Güvenlik">
        <p>
          Şifreler tek yönlü özet (hash) olarak saklanır. Yine de internet
          ortamında mutlak güvenlik garanti edilemez. Güçlü ve benzersiz şifre
          kullanmanız, ortak bilgisayarlarda oturum açtıktan sonra çıkış
          yapmanız önerilir.
        </p>
      </Section>

      <Section title="11. Çocuklar">
        <p>
          Platform 18 yaş altı kullanıcılara yönelik değildir. 18 yaşından küçük
          kişilerin veli / vasi onayı olmadan üye olmaması gerekir.
        </p>
      </Section>

      <Section title="12. Güncellemeler">
        <p>
          Bu metin gerektiğinde güncellenebilir. Güncel sürüm sitede
          yayımlandığı tarihte yürürlüğe girer. Son güncelleme:{" "}
          {LEGAL.updatedAt}.
        </p>
      </Section>
    </LegalLayout>
  );
}
