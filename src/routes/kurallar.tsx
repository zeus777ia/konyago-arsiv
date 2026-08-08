import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, Section } from "@/components/legal/legal-layout";
import { RULES_UPDATED, RULE_SECTIONS } from "@/lib/forum/rules-content";

export const Route = createFileRoute("/kurallar")({
  component: RulesPage,
});

function RulesPage() {
  return (
    <LegalLayout title="Platform Kullanım Kuralları">
      <p className="text-sm text-muted">
        Yürürlük / son güncelleme: <strong className="text-fg">{RULES_UPDATED}</strong>.
        İşbu metin{" "}
        <Link
          to="/konu/$threadId"
          params={{ threadId: "official_rules" }}
          className="text-primary hover:underline"
        >
          Duyurular ve Kurallar
        </Link>{" "}
        kapsamında da sabitlenmiştir. Üyelik ve içerik paylaşımı kabul anlamına
        gelir.
      </p>

      {RULE_SECTIONS.map((s) => (
        <Section key={s.id} title={s.title}>
          <ol className="list-decimal space-y-1.5 pl-5">
            {s.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Section>
      ))}

      <Section title="Moderasyon onay özeti">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Üye konuyu gönderir.</li>
          <li>Otomatik içerik ve spam filtreleri çalışır; aykırı içerik oluşmaz.</li>
          <li>
            Uygun içerik “İncelemede” kalır; genel listelerde görünmez.
          </li>
          <li>
            Kurucu onaylar → yayında; reddeder → kilitlenir; siler → kalıcı kaldırılır.
          </li>
        </ol>
      </Section>
    </LegalLayout>
  );
}
