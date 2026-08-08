import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, Section } from "@/components/legal/legal-layout";
import { RULES_UPDATED, RULE_SECTIONS } from "@/lib/forum/rules-content";

export const Route = createFileRoute("/kurallar")({
  component: RulesPage,
});

function RulesPage() {
  return (
    <LegalLayout title="Forum Kuralları">
      <p className="text-sm text-muted">
        Son güncelleme: {RULES_UPDATED}. Bu metin aynı zamanda{" "}
        <Link
          to="/konu/$threadId"
          params={{ threadId: "official_rules" }}
          className="text-primary hover:underline"
        >
          Duyurular & Kurallar
        </Link>{" "}
        bölümünde sabitlenmiştir. Üyelik kuralları kabul anlamına gelir.
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

      <Section title="Hızlı özet">
        <ul className="list-disc space-y-1 pl-5">
          <li>Duyurular & Kurallar’a üye konu açamaz.</li>
          <li>Yeni konular incelemeye alınır.</li>
          <li>
            +18, küfür, cinsellik, alkol/uyuşturucu, telif ihlali otomatik silinir
            / engellenir.
          </li>
        </ul>
      </Section>
    </LegalLayout>
  );
}
