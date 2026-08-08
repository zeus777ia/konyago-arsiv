import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, ShoppingBag } from "lucide-react";
import { MARKETPLACE_NOTICE } from "@/lib/marketplace/data";
import { JOBS_NOTICE } from "@/lib/jobs/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";

export function HomeHubs() {
  const marketCount = useMarketplaceStore(
    (s) => s.listings.filter((l) => l.status === "aktif").length,
  );
  const jobCount = useJobsStore(
    (s) => s.jobs.filter((j) => j.status === "aktif").length,
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        to="/ikinci-el"
        className="group rounded-xl border border-border bg-surface p-4 shadow-card transition-colors hover:border-primary/30 hover:bg-surface-hover"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <ShoppingBag className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-fg">İkinci El Pano</h2>
              <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Fazla ürününü ilan et, alıcı bul. Ödeme ve teslimat sitede yok —
              anlaşma dışarıda.
            </p>
            <p className="mt-2 text-[11px] font-medium text-primary">
              {marketCount} aktif ilan
            </p>
          </div>
        </div>
      </Link>

      <Link
        to="/is-ilani"
        className="group rounded-xl border border-border bg-surface p-4 shadow-card transition-colors hover:border-primary/30 hover:bg-surface-hover"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Briefcase className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-fg">İş Panosu</h2>
              <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              İşveren ilan açsın, iş arayan profilini yazsın. Görüşme site
              dışında.
            </p>
            <p className="mt-2 text-[11px] font-medium text-primary">
              {jobCount} aktif ilan
            </p>
          </div>
        </div>
      </Link>

      <p className="sr-only">
        {MARKETPLACE_NOTICE} {JOBS_NOTICE}
      </p>
    </div>
  );
}
