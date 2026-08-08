import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, ChevronRight, Plus, ShieldAlert, UserSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import {
  JOBS_NOTICE,
  JOB_KINDS,
  type JobType,
} from "@/lib/jobs/data";
import { useJobsStore } from "@/lib/jobs/store";
import { cn, formatRelative } from "@/lib/utils";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/is-ilani/")({
  head: () =>
    seoHead({
      title: 'İş panosu',
      description: 'Konya iş ilanları: iş veren ve iş arayan panosu.',
      path: '/is-ilani',
    }),
  component: JobsPage,
});

function JobsPage() {
  const jobs = useJobsStore((s) => s.jobs);
  const [type, setType] = useState<JobType | "hepsi">("hepsi");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return jobs
      .filter((j) => type === "hepsi" || j.type === type)
      .filter(
        (j) =>
          !query ||
          j.title.toLowerCase().includes(query) ||
          j.companyOrPerson.toLowerCase().includes(query) ||
          j.district.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query),
      )
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [jobs, type, q]);

  return (
    <ForumShell search={q} onSearch={setQ}>
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-fg">İş panosu</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">İş Panosu</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            İşveren ilan açar, iş arayan kendini tanıtır. Görüşme ve maaş
            sitede değil — dışarıda anlaşın.
          </p>
        </div>
        <Button asChild>
          <Link to="/is-ilani/yeni">
            <Plus className="size-3.5" />
            İlan aç
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex gap-2 rounded-lg border border-primary/20 bg-primary-soft px-3 py-2.5 text-xs leading-relaxed text-fg">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>{JOBS_NOTICE}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {(
          [
            ["hepsi", "Tümü"],
            ["isveren", "İşveren ilanları"],
            ["is-arayan", "İş arayanlar"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setType(id)}
            className={cn(
              "h-8 rounded-full border px-3 text-xs font-medium transition-colors",
              type === id
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-surface text-muted hover:bg-surface-hover hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.map((j) => {
          const kindLabel =
            JOB_KINDS.find((k) => k.id === j.kind)?.label ?? j.kind;
          const isEmployer = j.type === "isveren";
          return (
            <li key={j.id}>
              <Link
                to="/is-ilani/$jobId"
                params={{ jobId: j.id }}
                className="block rounded-xl border border-border bg-surface p-4 shadow-card transition-colors hover:border-primary/30 hover:bg-surface-hover"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      isEmployer
                        ? "bg-primary-soft text-primary"
                        : "bg-accent-soft text-accent",
                    )}
                  >
                    {isEmployer ? (
                      <Briefcase className="size-5" />
                    ) : (
                      <UserSearch className="size-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap gap-1.5">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                          isEmployer
                            ? "bg-primary-soft text-primary"
                            : "bg-accent-soft text-accent",
                        )}
                      >
                        {isEmployer ? "İşveren" : "İş arayan"}
                      </span>
                      <span className="rounded bg-badge px-1.5 py-0.5 text-[10px] font-medium text-muted">
                        {kindLabel}
                      </span>
                      {j.status === "kapandi" && (
                        <span className="rounded bg-subtle/20 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                          KAPANDI
                        </span>
                      )}
                    </div>
                    <h2 className="text-sm font-semibold text-fg">{j.title}</h2>
                    <p className="mt-0.5 text-xs text-muted">
                      {j.companyOrPerson} · {j.district}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-subtle">
                      {j.description}
                    </p>
                    <p className="mt-2 text-[11px] text-subtle">
                      {formatRelative(j.createdAt)}
                      {j.salaryNote ? ` · ${j.salaryNote}` : ""}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="rounded-lg border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
          Bu filtrede ilan yok.
        </p>
      )}
    </ForumShell>
  );
}
