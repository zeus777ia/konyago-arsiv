import { AlertTriangle } from "lucide-react";
import { JOB_SCAM_WARNINGS } from "@/lib/safety/checklists";

export function JobScamWarning() {
  return (
    <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-card">
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-800" />
        <h2 className="text-sm font-semibold text-amber-950">
          Şüpheli iş ilanı uyarıları
        </h2>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-amber-900/85">
        Bu panoda aracılık veya maaş ödemesi yoktur. Aşağıdakilerden biri
        varsa durun ve doğrulamadan ilerlemeyin:
      </p>
      <ul className="space-y-2">
        {JOB_SCAM_WARNINGS.map((w) => (
          <li
            key={w.id}
            className="flex gap-2 text-xs leading-relaxed text-amber-950"
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-700" />
            {w.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
