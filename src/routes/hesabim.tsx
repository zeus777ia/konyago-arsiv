import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Download,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Settings2,
  Shield,
  ShoppingBag,
  User,
  UserCog,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { ForumShell } from "@/components/forum/layout";
import { Avatar } from "@/components/forum/avatar";
import { UserName } from "@/components/forum/user-name";
import { Button } from "@/components/ui/button";
import {
  useCurrentUserState,
  useMembersHydrated,
} from "@/lib/auth/use-current-user";
import {
  changeEmail,
  changePassword,
  deleteAccount,
  exportMemberData,
  logoutMember,
  useMembersStore,
  DEFAULT_PREFS,
  DEFAULT_PROFILE,
  type Member,
} from "@/lib/members/store";
import { isFounder } from "@/lib/staff/founder";
import { useForumStore } from "@/lib/forum/store";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";
import { useReportsStore } from "@/lib/reports/store";
import { cn, formatRelative } from "@/lib/utils";
import { authEnabled, signOut } from "@/lib/auth/client";

const searchSchema = z.object({
  sekme: z
    .enum(["ozet", "profil", "guvenlik", "aktivite", "tercihler", "tehlike"])
    .optional(),
});

export const Route = createFileRoute("/hesabim")({
  validateSearch: searchSchema,
  component: AccountPanel,
});

type TabId =
  | "ozet"
  | "profil"
  | "guvenlik"
  | "aktivite"
  | "tercihler"
  | "tehlike";

const TABS: {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  localOnly?: boolean;
}[] = [
  {
    id: "ozet",
    label: "Özet",
    icon: <LayoutDashboard className="size-3.5" />,
  },
  { id: "profil", label: "Profil", icon: <User className="size-3.5" /> },
  {
    id: "guvenlik",
    label: "Güvenlik",
    icon: <KeyRound className="size-3.5" />,
    localOnly: true,
  },
  {
    id: "aktivite",
    label: "Aktivite",
    icon: <Activity className="size-3.5" />,
  },
  {
    id: "tercihler",
    label: "Tercihler",
    icon: <Settings2 className="size-3.5" />,
    localOnly: true,
  },
  {
    id: "tehlike",
    label: "Hesap",
    icon: <AlertTriangle className="size-3.5" />,
    localOnly: true,
  },
];

function normalizeMember(m: Member): Member {
  return {
    ...m,
    profile: { ...DEFAULT_PROFILE, ...m.profile },
    prefs: { ...DEFAULT_PREFS, ...m.prefs },
  };
}

function AccountPanel() {
  const { user, isPending } = useCurrentUserState();
  const hydrated = useMembersHydrated();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const sessionMemberId = useMembersStore((s) => s.session?.memberId ?? null);
  const rawMember = useMembersStore((s) => {
    const id = s.session?.memberId;
    if (!id) return null;
    return s.members.find((m) => m.id === id) ?? null;
  });
  const updateProfile = useMembersStore((s) => s.updateProfile);

  const fullMember = useMemo(
    () => (rawMember ? normalizeMember(rawMember as Member) : null),
    [rawMember],
  );

  const tab = (search.sekme ?? "ozet") as TabId;
  const setTab = (id: TabId) => {
    void navigate({ search: { sekme: id } });
  };

  // Wait for localStorage rehydrate before redirecting
  if (!hydrated || isPending) {
    return (
      <ForumShell>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-muted">
          <Loader2 className="size-6 animate-spin text-primary" />
          Panel yükleniyor…
        </div>
      </ForumShell>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const founder = isFounder(user);
  const isLocal = !!user.isLocalMember && !!sessionMemberId;
  const member = isLocal ? fullMember : null;
  const tabs = TABS.filter((t) => !t.localOnly || isLocal);

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" />
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
            Kullanıcı paneli
          </p>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Hesap yönetimi
          </h1>
          <p className="mt-1 text-sm text-muted">
            Profil, güvenlik, aktivite ve tercihlerinizi buradan yönetin.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (isLocal) logoutMember();
            else if (authEnabled) void signOut();
          }}
        >
          <LogOut className="size-3.5" />
          Çıkış yap
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
            <div className="flex items-center gap-3">
              <Avatar name={user.displayName ?? "Üye"} size="lg" />
              <div className="min-w-0">
                <UserName
                  name={user.displayName ?? "Üye"}
                  size="md"
                  className="truncate"
                />
                <p className="truncate text-[11px] text-subtle">
                  {user.primaryEmail}
                </p>
              </div>
            </div>
            {founder && (
              <p className="mt-3 rounded-md bg-primary-soft px-2 py-1.5 text-[11px] font-medium text-primary">
                Kurucu yetkileri aktif
              </p>
            )}
            {!isLocal && (
              <p className="mt-3 text-[11px] leading-relaxed text-subtle">
                Harici oturum. Tam hesap yönetimi için e-posta ile üye olun.
              </p>
            )}
          </div>

          <nav className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-sm last:border-b-0 transition-colors",
                  tab === t.id
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-muted hover:bg-surface-hover hover:text-fg",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>

          <div className="rounded-xl border border-border bg-bg-elevated px-3 py-2.5 text-[11px] leading-relaxed text-subtle">
            Destek:{" "}
            <a
              href="mailto:info@konyago.com.tr"
              className="text-primary hover:underline"
            >
              info@konyago.com.tr
            </a>
            <br />
            <Link to="/guvenlik" className="text-primary hover:underline">
              Güvenlik merkezi
            </Link>
            {" · "}
            <Link to="/kvkk" className="text-primary hover:underline">
              KVKK
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          {tab === "ozet" && (
            <OverviewTab
              userName={user.displayName ?? "Üye"}
              email={user.primaryEmail}
              member={member}
              founder={founder}
              isLocal={isLocal}
              onGo={setTab}
            />
          )}
          {tab === "profil" && (
            <ProfileTab
              userName={user.displayName ?? "Üye"}
              member={member}
              isLocal={isLocal}
              updateProfile={updateProfile}
            />
          )}
          {tab === "guvenlik" && isLocal && (
            <SecurityTab email={user.primaryEmail ?? ""} />
          )}
          {tab === "aktivite" && (
            <ActivityTab displayName={user.displayName ?? ""} />
          )}
          {tab === "tercihler" && isLocal && member && (
            <PrefsTab member={member} updateProfile={updateProfile} />
          )}
          {tab === "tehlike" && isLocal && <DangerTab />}
        </div>
      </div>
    </ForumShell>
  );
}

function PanelCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface shadow-card">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-fg">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-subtle">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums text-fg">
        {value}
      </div>
    </div>
  );
}

function OverviewTab({
  userName,
  email,
  member,
  founder,
  isLocal,
  onGo,
}: {
  userName: string;
  email: string | null;
  member: Member | null;
  founder: boolean;
  isLocal: boolean;
  onGo: (t: TabId) => void;
}) {
  const names = useForumStore((s) => s.names);
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const listings = useMarketplaceStore((s) => s.listings);
  const jobs = useJobsStore((s) => s.jobs);

  const stats = useMemo(() => {
    const threadCount = threads.filter(
      (t) => names[t.authorId] === userName,
    ).length;
    const postCount = posts.filter(
      (p) => names[p.authorId] === userName,
    ).length;
    const listingCount = listings.filter(
      (l) => l.authorName === userName,
    ).length;
    const jobCount = jobs.filter((j) => j.authorName === userName).length;
    const pending = threads.filter(
      (t) => names[t.authorId] === userName && t.status === "pending",
    ).length;
    return { threadCount, postCount, listingCount, jobCount, pending };
  }, [threads, posts, listings, jobs, names, userName]);

  return (
    <div className="space-y-4">
      <PanelCard
        title="Hoş geldiniz"
        description="Hesap özetiniz ve hızlı erişim."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Avatar name={userName} size="lg" />
          <div>
            <UserName name={userName} size="lg" />
            <p className="mt-0.5 text-sm text-muted">{email}</p>
            {member && (
              <p className="mt-1 text-[11px] text-subtle">
                Üyelik: {formatRelative(member.createdAt)}
                {member.lastLoginAt
                  ? ` · Son giriş: ${formatRelative(member.lastLoginAt)}`
                  : ""}
              </p>
            )}
            {founder && (
              <p className="mt-1 text-xs font-medium text-primary">
                Site kurucusu — moderasyon paneline erişiminiz var.
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            label="Konu"
            value={stats.threadCount}
            icon={<User className="size-3" />}
          />
          <Stat label="Mesaj" value={stats.postCount} />
          <Stat
            label="İkinci el"
            value={stats.listingCount}
            icon={<ShoppingBag className="size-3" />}
          />
          <Stat
            label="İş ilanı"
            value={stats.jobCount}
            icon={<Briefcase className="size-3" />}
          />
        </div>
        {stats.pending > 0 && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {stats.pending} konunuz moderasyon incelemesinde.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onGo("profil")}>
            <UserCog className="size-3.5" />
            Profili düzenle
          </Button>
          {isLocal && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onGo("guvenlik")}
            >
              <Shield className="size-3.5" />
              Güvenlik
            </Button>
          )}
          <Button size="sm" variant="secondary" asChild>
            <Link to="/yeni-konu">Yeni konu</Link>
          </Button>
          {founder && (
            <Button size="sm" variant="secondary" asChild>
              <Link to="/moderasyon">Moderasyon</Link>
            </Button>
          )}
        </div>
      </PanelCard>

      <PanelCard title="Hızlı bağlantılar">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li>
            <Link to="/ikinci-el" className="text-primary hover:underline">
              İkinci el panosu
            </Link>
          </li>
          <li>
            <Link to="/is-ilani" className="text-primary hover:underline">
              İş panosu
            </Link>
          </li>
          <li>
            <Link to="/kurallar" className="text-primary hover:underline">
              Platform kuralları
            </Link>
          </li>
          <li>
            <Link to="/guvenlik" className="text-primary hover:underline">
              Güvenlik merkezi
            </Link>
          </li>
        </ul>
      </PanelCard>
    </div>
  );
}

function ProfileTab({
  userName,
  member,
  isLocal,
  updateProfile,
}: {
  userName: string;
  member: Member | null;
  isLocal: boolean;
  updateProfile: ReturnType<typeof useMembersStore.getState>["updateProfile"];
}) {
  const [displayName, setDisplayName] = useState(userName);
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("Konya");
  const [district, setDistrict] = useState("");
  const [website, setWebsite] = useState("");
  const [locationNote, setLocationNote] = useState("");

  const memberKey = member
    ? `${member.id}|${member.updatedAt ?? ""}|${member.displayName}|${member.profile.bio}|${member.profile.city}|${member.profile.district}|${member.profile.website}|${member.profile.locationNote}`
    : "";

  useEffect(() => {
    setDisplayName(userName);
    if (member) {
      setBio(member.profile.bio);
      setCity(member.profile.city);
      setDistrict(member.profile.district);
      setWebsite(member.profile.website);
      setLocationNote(member.profile.locationNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, memberKey]);

  if (!isLocal || !member) {
    return (
      <PanelCard title="Profil" description="Görünen ad ve iletişim.">
        <p className="text-sm text-muted">
          Harici oturumda profil alanları sınırlıdır. Tam hesap yönetimi için
          e-posta ile üye olun.
        </p>
        <p className="mt-3 text-sm">
          Görünen ad: <UserName name={userName} />
        </p>
      </PanelCard>
    );
  }

  return (
    <PanelCard
      title="Profil bilgileri"
      description="Toplulukta görünen kimliğiniz. Kurucu yetkileri görünen ada bağlıdır."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const res = updateProfile({
            displayName,
            profile: { bio, city, district, website, locationNote },
          });
          if (!res.ok) {
            toast.error(res.error);
            return;
          }
          toast.success("Profil kaydedildi");
        }}
      >
        <div className="flex items-center gap-3 rounded-lg bg-bg-elevated px-3 py-3">
          <Avatar name={displayName || userName} size="lg" />
          <div className="text-xs text-muted">
            Önizleme: <UserName name={displayName || userName} size="sm" />
          </div>
        </div>

        <Field label="Görünen ad">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={32}
            className={inputCls}
          />
        </Field>
        <Field label="Hakkımda">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={400}
            rows={4}
            placeholder="Kısa bir tanıtım (isteğe bağlı)"
            className={inputCls + " h-auto py-2"}
          />
          <span className="text-[11px] text-subtle">{bio.length}/400</span>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Şehir">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="İlçe">
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Örn. Selçuklu"
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Konum notu">
          <input
            value={locationNote}
            onChange={(e) => setLocationNote(e.target.value)}
            placeholder="Örn. Meram civarı"
            className={inputCls}
          />
        </Field>
        <Field label="Web sitesi">
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
            className={inputCls}
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit">Değişiklikleri kaydet</Button>
        </div>
      </form>
    </PanelCard>
  );
}

function SecurityTab({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [emailPass, setEmailPass] = useState("");
  const [newEmail, setNewEmail] = useState(email);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNewEmail(email);
  }, [email]);

  return (
    <div className="space-y-4">
      <PanelCard
        title="Şifre değiştir"
        description="En az 8 karakter, en az bir harf ve bir rakam."
      >
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (newPassword !== newPassword2) {
              toast.error("Yeni şifreler eşleşmiyor");
              return;
            }
            setBusy(true);
            try {
              const res = await changePassword({
                currentPassword,
                newPassword,
              });
              if (!res.ok) {
                toast.error(res.error);
                return;
              }
              toast.success("Şifre güncellendi");
              setCurrentPassword("");
              setNewPassword("");
              setNewPassword2("");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Mevcut şifre">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputCls}
              autoComplete="current-password"
            />
          </Field>
          <Field label="Yeni şifre">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputCls}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Yeni şifre (tekrar)">
            <input
              type="password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              className={inputCls}
              autoComplete="new-password"
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>
              Şifreyi güncelle
            </Button>
          </div>
        </form>
      </PanelCard>

      <PanelCard
        title="E-posta değiştir"
        description="Doğrulama için mevcut şifreniz istenir."
      >
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const res = await changeEmail({
                password: emailPass,
                newEmail,
              });
              if (!res.ok) {
                toast.error(res.error);
                return;
              }
              toast.success("E-posta güncellendi");
              setEmailPass("");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Yeni e-posta">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Şifre onayı">
            <input
              type="password"
              value={emailPass}
              onChange={(e) => setEmailPass(e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>
              <Mail className="size-3.5" />
              E-postayı güncelle
            </Button>
          </div>
        </form>
      </PanelCard>

      <PanelCard title="Oturum">
        <p className="mb-3 text-xs text-muted">
          Bu cihazdaki oturumu sonlandırmak için çıkış yapın.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              logoutMember();
              toast.message("Çıkış yapıldı");
            }}
          >
            <LogOut className="size-3.5" />
            Çıkış yap
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link to="/login">Şifremi unuttum</Link>
          </Button>
        </div>
      </PanelCard>
    </div>
  );
}

function ActivityTab({ displayName }: { displayName: string }) {
  const names = useForumStore((s) => s.names);
  const threads = useForumStore((s) => s.threads);
  const listings = useMarketplaceStore((s) => s.listings);
  const jobs = useJobsStore((s) => s.jobs);
  const reports = useReportsStore((s) => s.reports);

  const myThreads = useMemo(
    () =>
      threads
        .filter((t) => names[t.authorId] === displayName)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [threads, names, displayName],
  );
  const myListings = useMemo(
    () => listings.filter((l) => l.authorName === displayName),
    [listings, displayName],
  );
  const myJobs = useMemo(
    () => jobs.filter((j) => j.authorName === displayName),
    [jobs, displayName],
  );
  const myReports = useMemo(
    () => reports.filter((r) => r.reporterName === displayName),
    [reports, displayName],
  );

  return (
    <div className="space-y-4">
      <PanelCard title={`Konularım (${myThreads.length})`}>
        {myThreads.length === 0 ? (
          <Empty>
            Henüz konu yok.{" "}
            <Link to="/yeni-konu" className="text-primary hover:underline">
              İlk konuyu aç
            </Link>
          </Empty>
        ) : (
          <ul className="divide-y divide-border">
            {myThreads.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
              >
                <Link
                  to="/konu/$threadId"
                  params={{ threadId: t.id }}
                  className="text-sm font-medium text-fg hover:text-primary"
                >
                  {t.title}
                </Link>
                <span className="text-[11px] text-subtle">
                  {t.status === "pending"
                    ? "İncelemede"
                    : t.status === "rejected"
                      ? "Reddedildi"
                      : "Yayında"}
                  {" · "}
                  {formatRelative(t.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>

      <PanelCard title={`İkinci el ilanlarım (${myListings.length})`}>
        {myListings.length === 0 ? (
          <Empty>
            <Link to="/ikinci-el/yeni" className="text-primary hover:underline">
              İlan ver
            </Link>
          </Empty>
        ) : (
          <ul className="divide-y divide-border">
            {myListings.map((l) => (
              <li key={l.id} className="py-2 first:pt-0 last:pb-0">
                <Link
                  to="/ikinci-el/$listingId"
                  params={{ listingId: l.id }}
                  className="text-sm text-primary hover:underline"
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>

      <PanelCard title={`İş ilanlarım (${myJobs.length})`}>
        {myJobs.length === 0 ? (
          <Empty>
            <Link to="/is-ilani/yeni" className="text-primary hover:underline">
              İş ilanı aç
            </Link>
          </Empty>
        ) : (
          <ul className="divide-y divide-border">
            {myJobs.map((j) => (
              <li key={j.id} className="py-2 first:pt-0 last:pb-0">
                <Link
                  to="/is-ilani/$jobId"
                  params={{ jobId: j.id }}
                  className="text-sm text-primary hover:underline"
                >
                  {j.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>

      <PanelCard title={`Gönderdiğim bildirimler (${myReports.length})`}>
        {myReports.length === 0 ? (
          <Empty>Henüz içerik bildiriminiz yok.</Empty>
        ) : (
          <ul className="space-y-2 text-xs text-muted">
            {myReports.slice(0, 12).map((r) => (
              <li key={r.id} className="rounded-md bg-bg-elevated px-2.5 py-2">
                {r.targetType} · {r.reason} · {r.status} ·{" "}
                {formatRelative(r.createdAt)}
              </li>
            ))}
          </ul>
        )}
      </PanelCard>
    </div>
  );
}

function PrefsTab({
  member,
  updateProfile,
}: {
  member: Member;
  updateProfile: ReturnType<typeof useMembersStore.getState>["updateProfile"];
}) {
  const [showEmail, setShowEmail] = useState(member.prefs.showEmail);
  const [notifyModeration, setNotifyModeration] = useState(
    member.prefs.notifyModeration,
  );
  const [notifyListings, setNotifyListings] = useState(
    member.prefs.notifyListings,
  );
  const [preferCompactLists, setPreferCompactLists] = useState(
    member.prefs.preferCompactLists,
  );

  const prefsKey = `${member.id}|${member.prefs.showEmail}|${member.prefs.notifyModeration}|${member.prefs.notifyListings}|${member.prefs.preferCompactLists}`;

  useEffect(() => {
    setShowEmail(member.prefs.showEmail);
    setNotifyModeration(member.prefs.notifyModeration);
    setNotifyListings(member.prefs.notifyListings);
    setPreferCompactLists(member.prefs.preferCompactLists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsKey]);

  return (
    <PanelCard
      title="Tercihler"
      description="Gizlilik ve bildirim tercihleri bu cihazda saklanır."
    >
      <div className="space-y-3">
        <ToggleRow
          label="E-posta adresimi profilde göster"
          checked={showEmail}
          onChange={setShowEmail}
        />
        <ToggleRow
          label="Moderasyon sonucu hakkında bilgilendir"
          checked={notifyModeration}
          onChange={setNotifyModeration}
        />
        <ToggleRow
          label="İlan panosu hatırlatmaları"
          checked={notifyListings}
          onChange={setNotifyListings}
        />
        <ToggleRow
          label="Liste görünümünde kompakt satırlar"
          checked={preferCompactLists}
          onChange={setPreferCompactLists}
        />
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={() => {
              const res = updateProfile({
                prefs: {
                  showEmail,
                  notifyModeration,
                  notifyListings,
                  preferCompactLists,
                },
              });
              if (!res.ok) {
                toast.error(res.error);
                return;
              }
              toast.success("Tercihler kaydedildi");
            }}
          >
            Kaydet
          </Button>
        </div>
      </div>
    </PanelCard>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[var(--color-primary,#0f6b52)]"
      />
    </label>
  );
}

function DangerTab() {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-4">
      <PanelCard
        title="Veri dışa aktar"
        description="Hesap ve profil bilgilerinizin JSON kopyası (şifre hariç)."
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            const data = exportMemberData();
            if (!data) {
              toast.error("Oturum bulunamadı");
              return;
            }
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `konyago-arsiv-hesap-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("İndirme başladı");
          }}
        >
          <Download className="size-3.5" />
          JSON indir
        </Button>
      </PanelCard>

      <PanelCard
        title="Hesabı kalıcı sil"
        description="Bu işlem geri alınamaz. Oturum kapanır; hesap kaydı silinir."
      >
        <div className="mb-3 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">
          Onay için şifrenizi girin ve kutuya <strong>SIL</strong> yazın.
        </div>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!confirm("Hesabınız kalıcı olarak silinsin mi?")) return;
            setBusy(true);
            try {
              const res = await deleteAccount({ password, confirmText });
              if (!res.ok) {
                toast.error(res.error);
                return;
              }
              toast.success("Hesap silindi");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Şifre">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Onay metni (SIL)">
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={inputCls}
              placeholder="SIL"
            />
          </Field>
          <Button
            type="submit"
            disabled={busy}
            className="bg-danger text-white hover:bg-danger/90"
          >
            Hesabı sil
          </Button>
        </form>
      </PanelCard>
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}
