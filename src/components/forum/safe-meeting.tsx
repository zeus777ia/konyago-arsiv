import { ShieldCheck } from "lucide-react";
import { SAFE_MEETING_CHECKLIST } from "@/lib/safety/checklists";

export function SafeMeetingChecklist() {
  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-card">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck className="size-4 text-emerald-800" />
        <h2 className="text-sm font-semibold text-emerald-950">
          Güvenli buluşma kontrol listesi
        </h2>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-emerald-900/80">
        İkinci el alışverişte site yalnızca ilanı gösterir. Anlaşma ve teslimat
        sizin sorumluluğunuzdadır. Aşağıdakileri uygulamanızı öneririz:
      </p>
      <ol className="space-y-2.5">
        {SAFE_MEETING_CHECKLIST.map((item, i) => (
          <li key={item.id} className="flex gap-2.5 text-xs text-emerald-950">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-900/75">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
