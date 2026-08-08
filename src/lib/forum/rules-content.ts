/** Duyurular & Kurallar — resmî kural metni (sabit / kilitli konular) */

export const RULES_UPDATED = "9 Ağustos 2026";

export type RuleSection = {
  id: string;
  title: string;
  items: string[];
};

export const RULE_SECTIONS: RuleSection[] = [
  {
    id: "genel",
    title: "1. Genel ilkeler",
    items: [
      "KonyaGo Arşiv bağımsız bir topluluk forumudur; resmî bir kamu kurumu sitesi değildir.",
      "Üyelik ile tüm kuralları okumuş ve kabul etmiş sayılırsınız.",
      "Site yönetimi (kurucu) kuralları güncelleme, içeriği kaldırma ve hesap kısıtlama hakkını saklı tutar.",
      "Türkçe iletişim esastır; argo ve hakaret yasaktır.",
      "Diğer üyelere saygı gösterin. Kişisel saldırı, linç ve ayrımcılık kabul edilmez.",
    ],
  },
  {
    id: "uyelik",
    title: "2. Üyelik ve hesap güvenliği",
    items: [
      "Her gerçek kişi kural olarak bir hesap kullanmalıdır.",
      "Sahte kimlik, taklit üye adı veya kurucuyu taklit etmek yasaktır.",
      "Şifrenizi kimseyle paylaşmayın; şüpheli durumda şifrenizi yenileyin.",
      "18 yaş altı kullanıcıların veli/vasi onayı olmadan üye olması uygun değildir.",
      "Hesap satışı, kiralanması veya devri yasaktır.",
    ],
  },
  {
    id: "icerik",
    title: "3. İçerik kuralları (zorunlu)",
    items: [
      "+18, NSFW, müstehcen veya cinsel içerik kesinlikle yasaktır; otomatik engellenir.",
      "Küfür, hakaret, aşağılama ve nefret söylemi yasaktır; otomatik engellenir.",
      "Alkol satışı / teşviki ve her türlü uyuşturucu maddesi içeriği yasaktır; otomatik engellenir.",
      "Telif hakkı ihlali (korsan yazılım, crack, illegal film/dizi/müzik indirme) yasaktır; otomatik engellenir.",
      "Şiddet, silah satışı, yasadışı faaliyet planı veya teşviki yasaktır.",
      "Spam, zincir mesaj, aşırı büyük harf ve konuyu saptıran flood yasaktır.",
      "Yanıltıcı başlık, tık tuzağı ve sahte duyuru yasaktır.",
      "Kişisel verileri (TC, adres, özel telefon vb.) izinsiz paylaşmak yasaktır.",
    ],
  },
  {
    id: "inceleme",
    title: "4. Konu inceleme süreci",
    items: [
      "Açılan yeni konular önce “incelemede” durumuna alınır; onaylanmadan herkese açık listelerde görünmez.",
      "Kurucu onayı sonrası konu yayınlanır.",
      "Kurallara aykırı içerik otomatik reddedilir veya silinir; itiraz için info@konyago.com.tr yazabilirsiniz.",
      "Duyurular & Kurallar bölümüne yalnızca kurucu konu açabilir; üyeler bu bölüme konu açamaz.",
    ],
  },
  {
    id: "forum",
    title: "5. Forum kullanımı",
    items: [
      "Konuyu doğru kategoriye açın; yanlış kategorideki konular taşınabilir veya kapatılabilir.",
      "Aynı konuda mükerrer başlık açmayın; önce arama yapın.",
      "Alıntı yaparken kaynağı belirtin; kopyala-yapıştır spam yasaktır.",
      "Tartışmalarda konuyu dağıtmayın; kişisel mesajlaşmayı konu dışına taşıyın.",
      "Kilitli konulara (kurucu hariç) cevap yazılamaz.",
      "Sabitlenmiş konular yönetim duyurusu niteliğindedir; lütfen okuyun.",
    ],
  },
  {
    id: "ikinci-el",
    title: "6. İkinci el panosu",
    items: [
      "Sitede ödeme, komisyon veya eskort işlem yapılmaz; ticaret site dışındadır.",
      "Yalnızca yasal ürünler ilan edilebilir. Çalıntı, sahte veya yasadışı ürün yasaktır.",
      "İletişim bilginizi bilinçli paylaşın; dolandırıcılığa karşı yüz yüze ve güvenli buluşun.",
      "İlan metninde küfür, +18 veya yasadışı içerik olamaz (otomatik engel).",
      "Satılan ilanı “satıldı” olarak işaretleyin veya kaldırın.",
    ],
  },
  {
    id: "is",
    title: "7. İş panosu",
    items: [
      "İşveren ve iş arayan ilanları bilgilendirme panosudur; sitede maaş ödemesi yoktur.",
      "Sahte iş ilanı, avans dolandırıcılığı ve yasadışı iş teklifleri yasaktır.",
      "Ayrımcı (ırk, din, cinsiyet vb.) ilan metinleri kabul edilmez.",
      "İletişim ve görüşme site dışında, tarafların sorumluluğundadır.",
    ],
  },
  {
    id: "reklam",
    title: "8. Reklam ve tanıtım",
    items: [
      "İzinsiz ticari reklam, affiliate link bombardımanı ve DM spam yasaktır.",
      "Kendi projenizi tanıtmak istiyorsanız ilgili kategoride abartısız ve tek seferlik paylaşın.",
      "Rakip siteleri kötüleme veya yanıltıcı karşılaştırma yapmayın.",
    ],
  },
  {
    id: "gizlilik",
    title: "9. Gizlilik ve KVKK",
    items: [
      "Kişisel verileriniz KVKK aydınlatma metni kapsamında işlenir.",
      "Başkasının özel bilgisini rızası olmadan paylaşmayın (doxxing yasaktır).",
      "Gizlilik ihlali bildirimleri öncelikli incelenir.",
      "Detay: /kvkk ve /gizlilik sayfaları.",
    ],
  },
  {
    id: "yaptirim",
    title: "10. Yaptırımlar",
    items: [
      "Uyarı → içerik silme → geçici kısıtlama → kalıcı ban kademeleri uygulanabilir.",
      "Ağır ihlallerde (uyuşturucu, telif, cinsel istismar vb.) doğrudan kalıcı ban uygulanır.",
      "Yasadışı faaliyet şüphesinde yasal mercilere bildirim hakkı saklıdır.",
      "Ban kaçırma (yeni hesap) tespit edilirse tüm hesaplar kapatılır.",
    ],
  },
  {
    id: "sorumluluk",
    title: "11. Sorumluluk reddi",
    items: [
      "Kullanıcı içeriklerinden içerik sahibi sorumludur.",
      "İkinci el ve iş anlaşmalarından platform sorumlu değildir.",
      "Hizmet “olduğu gibi” sunulur; kesintisiz çalışma garanti edilmez.",
      "Yasal uyarı: /yasal-uyari",
    ],
  },
  {
    id: "iletisim",
    title: "12. İletişim ve şikâyet",
    items: [
      "Kural ihlali, telif ve KVKK talepleri: info@konyago.com.tr",
      "Acil güvenlik bildirimlerinde konuyu ve bağlantıyı mailde belirtin.",
      "Kurucu görünen adı: KonyaGoArşiv (KURUCU rozetli).",
    ],
  },
];

export function buildRulesBody(): string {
  const lines: string[] = [
    `Son güncelleme: ${RULES_UPDATED}`,
    "",
    "Aşağıdaki kurallar KonyaGo Arşiv’in tüm bölümleri (forum, ikinci el, iş panosu) için geçerlidir. Üyelik ve içerik paylaşımı bu metnin kabulü anlamına gelir.",
    "",
  ];
  for (const s of RULE_SECTIONS) {
    lines.push(`**${s.title}**`, "");
    s.items.forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
    lines.push("");
  }
  lines.push(
    "—",
    "Bu metin Duyurular & Kurallar bölümünde sabitlenmiştir. Bu bölüme yalnızca kurucu konu açabilir.",
  );
  return lines.join("\n");
}

export function buildAnnouncementBody(): string {
  return [
    "**Hoş geldiniz — KonyaGo Arşiv**",
    "",
    "Forum, ikinci el ilan ve iş panosu burada bir arada.",
    "",
    "1. Lütfen önce **Forum Kuralları** konusunu okuyun.",
    "2. Yeni konular inceleme kuyruğuna alınır; onay sonrası yayınlanır.",
    "3. +18, küfür, cinsellik, alkol/uyuşturucu ve telif ihlali otomatik engellenir.",
    "4. Duyurular & Kurallar bölümüne üye konu açamaz.",
    "5. Resmî kurum sitesi değiliz — yasal uyarıyı okuyun.",
    "",
    "İyi forumlar.",
    "KonyaGoArşiv · KURUCU",
  ].join("\n");
}
