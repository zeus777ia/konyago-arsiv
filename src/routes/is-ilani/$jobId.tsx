import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { ChevronRight, MapPin, ShieldAlert, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { UserName } from "@/components/forum/user-name";
import { Button } from "@/components/ui/button";
import { JOBS_NOTICE, JOB_KINDS } from "@/lib/jobs/data";
import { useJobsStore } from "@/lib/jobs/store";
import { formatRelative } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { isFounder } from "@/lib/staff/founder";

export const Route = createFileRoute("/is-ilani/$jobId")({
  component: JobDetailPage,
});

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const job = useJobsStore((s) => s.jobs.find((j) => j.id === jobId));
  const closeJob = useJobsStore((s) => s.closeJob);
  const removeJob = useJobsStore((s) => s.removeJob);
  const user = useCurrentUser();
  const founder = isFounder(user);

  if (!job) throw notFound();

  const kindLabel = JOB_KINDS.find((k) => k.id === job.kind)?.label ?? job.kind;
  const isEmployer = job.type === "isveren";

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        <Link to="/is-ilani" className="hover:text-primary">
          İş panosu
        </Link>
        <ChevronRight className="size-3" />
        <span className="line-clamp-1 text-fg">{job.title}</span>
      </nav>

      <article className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span
              className={
                isEmployer
                  ? "rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary"
                  : "rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent"
              }
            >
              {isEmployer ? "İşveren ilanı" : "İş arayan"}
            </span>
            <span className="rounded bg-badge px-1.5 py-0.5 text-[10px] font-medium text-muted">
              {kindLabel}
            </span>
            {job.status === "kapandi" && (
              <span className="rounded bg-subtle/20 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                KAPANDI
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{job.title}</h1>
          <p className="mt-1 text-sm text-muted">{job.companyOrPerson}</p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs text-subtle">
            <MapPin className="size-3.5" />
            {job.district} · {formatRelative(job.createdAt)} ·{" "}
            <UserName name={job.authorName} size="sm" />
          </p>
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-fg">
            {job.description}
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-bg-elevated px-3 py-2">
              <dt className="text-[11px] text-subtle">Ücret notu</dt>
              <dd className="text-sm font-semibold">{job.salaryNote}</dd>
            </div>
            <div className="rounded-lg bg-bg-elevated px-3 py-2">
              <dt className="text-[11px] text-subtle">İletişim</dt>
              <dd className="text-sm font-semibold break-all">{job.contact}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {job.status === "aktif" && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  closeJob(job.id);
                  toast.message("İlan kapatıldı");
                }}
              >
                İlanı kapat
              </Button>
            )}
            {founder && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-danger"
                onClick={() => {
                  if (!confirm("İlan kalıcı silinsin mi?")) return;
                  removeJob(job.id);
                  toast.success("İlan silindi");
                  void navigate({ to: "/is-ilani" });
                }}
              >
                <Trash2 className="size-3.5" />
                Kurucu: sil
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2 rounded-lg border border-primary/20 bg-primary-soft px-3 py-2.5 text-xs leading-relaxed">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>{JOBS_NOTICE}</p>
        </div>
      </article>
    </ForumShell>
  );
}
