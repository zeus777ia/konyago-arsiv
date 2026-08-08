import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { ForumShell } from "@/components/forum/layout";
import { Button } from "@/components/ui/button";
import {
  JOBS_NOTICE,
  JOB_DISTRICTS,
  JOB_KINDS,
  type JobKind,
  type JobType,
} from "@/lib/jobs/data";
import { useJobsStore } from "@/lib/jobs/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { moderateContent } from "@/lib/forum/moderation";
import { recordSpamEvent, runAllSpamChecks } from "@/lib/forum/spam";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/is-ilani/yeni")({
  component: NewJobPage,
});

function NewJobPage() {
  const navigate = useNavigate();
  const addJob = useJobsStore((s) => s.addJob);
  const user = useCurrentUser();
  const [type, setType] = useState<JobType>("isveren");
  const [title, setTitle] = useState("");
  const [companyOrPerson, setCompanyOrPerson] = useState("");
  const [kind, setKind] = useState<JobKind>("tam-zamanli");
  const [district, setDistrict] = useState(JOB_DISTRICTS[0]!);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [salaryNote, setSalaryNote] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formStartedAt = useMemo(() => Date.now(), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("İlan vermek için giriş yapın");
      void navigate({ to: "/login" });
      return;
    }
    if (title.trim().length < 5) {
      toast.error("Başlık en az 5 karakter");
      return;
    }
    if (description.trim().length < 20) {
      toast.error("Açıklama en az 20 karakter");
      return;
    }
    if (!contact.trim()) {
      toast.error("İletişim bilgisi gerekli");
      return;
    }
    if (!accepted) {
      toast.error("Kuralları onaylayın");
      return;
    }
    const spam = runAllSpamChecks({ kind: "job", title, body: description, honeypot, formStartedAt });
    if (!spam.ok) {
      toast.error(spam.reason);
      return;
    }
    const mod = moderateContent(title, description + " " + salaryNote);
    if (!mod.ok) {
      toast.error(mod.reason);
      return;
    }
    const id = addJob({
      type,
      title,
      companyOrPerson:
        companyOrPerson.trim() ||
        (type === "isveren" ? "İşveren" : "Bireysel"),
      kind,
      district,
      description,
      contact,
      salaryNote: salaryNote || "Görüşülür",
      authorName: user?.displayName ?? "Misafir",
    });
    recordSpamEvent("job", title + "\n" + description);
    toast.success("İlan yayınlandı");
    void navigate({ to: "/is-ilani/$jobId", params: { jobId: id } });
  };

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
        <span className="text-fg">Yeni ilan</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold tracking-tight">İş ilanı aç</h1>
        <div className="mt-3 flex gap-2 rounded-lg border border-primary/20 bg-primary-soft px-3 py-2.5 text-xs leading-relaxed">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>{JOBS_NOTICE}</p>
        </div>

        <form
          onSubmit={submit}
          className="mt-5 space-y-4 rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5"
        >
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wide text-muted uppercase">
              İlan türü
            </p>
            <div className="grid grid-cols-2 gap-2">
              <TypeBtn
                active={type === "isveren"}
                onClick={() => setType("isveren")}
                title="İşveren"
                sub="Personel / pozisyon arıyorum"
              />
              <TypeBtn
                active={type === "is-arayan"}
                onClick={() => setType("is-arayan")}
                title="İş arayan"
                sub="İş / staj arıyorum"
              />
            </div>
          </div>

          <Field label="Başlık">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder={
                type === "isveren"
                  ? "Örn. Garson aranıyor"
                  : "Örn. Muhasebe işi arıyorum"
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={type === "isveren" ? "İşyeri / firma" : "Ad / unvan"}
            >
              <input
                value={companyOrPerson}
                onChange={(e) => setCompanyOrPerson(e.target.value)}
                className={inputCls}
                placeholder={type === "isveren" ? "Firma adı" : "Adınız"}
              />
            </Field>
            <Field label="Çalışma şekli">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as JobKind)}
                className={inputCls}
              >
                {JOB_KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Bölge">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputCls}
              >
                {JOB_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ücret notu (bilgi)">
              <input
                value={salaryNote}
                onChange={(e) => setSalaryNote(e.target.value)}
                className={inputCls}
                placeholder="Örn. asgari / proje / görüşülür"
              />
            </Field>
          </div>

          <Field label="Açıklama">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={cn(inputCls, "h-auto min-h-28 py-2.5")}
              placeholder="Pozisyon veya kendi profilinizi anlatın."
            />
          </Field>

          <Field label="İletişim">
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={inputCls}
              placeholder="E-posta, telefon…"
            />
          </Field>

          <label className="flex items-start gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Sitede maaş ödemesi / başvuru ücreti olmadığını; görüşmenin site
              dışında yapılacağını kabul ediyorum.
            </span>
          </label>

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to="/is-ilani">İptal</Link>
            </Button>
            <Button type="submit">İlanı yayınla</Button>
          </div>
        </form>
      </div>
    </ForumShell>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-bg-elevated px-3 h-10 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

function TypeBtn({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-3 text-left transition-colors",
        active
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-bg-elevated hover:bg-surface-hover",
      )}
    >
      <span className="block text-sm font-semibold text-fg">{title}</span>
      <span className="mt-0.5 block text-[11px] text-muted">{sub}</span>
    </button>
  );
}
