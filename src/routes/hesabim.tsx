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
import {
  ActivityProgress,
  FrameBadge,
  RankBadge,
} from "@/components/forum/member-badges";
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
  setMemberAvatar,
  useMembersStore,
  DEFAULT_PREFS,
  DEFAULT_PROFILE,
  type Member,
} from "@/lib/members/store";
import {
  getFrame,
  getRank,
  nextFrame,
  nextRank,
  normalizeActivity,
} from "@/lib/members/ranks";
import { compressImageFile } from "@/lib/marketplace/data";
import { isFounder } from "@/lib/staff/founder";
import { useForumStore } from "@/lib/forum/store";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";
import { useReportsStore } from "@/lib/reports/store";
import { cn, formatRelative } from "@/lib/utils";
import { authEnabled, signOut } from "@/lib/auth/client";
import { seoHead } from "@/lib/seo";

const searchSchema = z.object({
  sekme: z
    .enum(["ozet", "profil", "guvenlik", "aktivite", "tercihler", "tehlike"])
    .optional(),
});

export const Route = createFileRoute("/hesabim")({
  head: () =>
    seoHead({
      title: 'Hesabım',
      description: 'Kullanıcı paneli ve hesap yönetimi.',
      path: '/hesabim', noIndex: true,
    }),
  validateSearch: searchSchema,
  component: AccountPanelPage,
});

type Sekme = NonNullable<z.infer<typeof searchSchema>["sekme"]>;

const TABS: { id: Sekme; label: string; icon: React.ReactNode }[] = [
  { id: "ozet", label: "Özet", icon: <LayoutDashboard className="size-3.5" /> },
  { id: "profil", label: "Profil", icon: <User className="size-3.5" /> },
  { id: "guvenlik", label: "Güvenlik", icon: <Shield className="size-3.5" /> },
  { id: "aktivite", label: "Aktivite", icon: <Activity className="size-3.5" /> },
  {
    id: "tercihler",
    label: "Tercihler",
    icon: <Settings2 className="size-3.5" />,
  },
  {
    id: "tehlike",
    label: "Tehlikeli alan",
    icon: <AlertTriangle className="size-3.5" />,
  },
];

const inputCls =
  "w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

function AccountPanelPage() {
  const hydrated = useMembersHydrated();
  const { user, isPending } = useCurrentUserState();
  const { sekme } = Route.useSearch();
  const tab: Sekme = sekme ?? "ozet";
  const member = useMembersStore((s) => {
    if (!user?.isLocalMember) return null;
    const m = s.members.find((x) => x.id === user.id);
    return m ?? null;
  });
  const updateProfile = useMembersStore((s) => s.updateProfile);
  const threads = useForumStore((s) => s.threads);
  const posts = useForumStore((s) => s.posts);
  const names = useForumStore((s) => s.names);
  const listings = useMarketplaceStore((s) => s.listings);
  const jobs = useJobsStore((s) => s.jobs);
  const reports = useReportsStore((s) => s.reports);

  if (!hydrated || isPending) {
    return (
      <ForumShell>
        <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted">
          <Loader2 className="size-5 animate-spin text-primary" />
          Panel yükleniyor…
        </div>
      </ForumShell>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const founder = isFounder(user);
  const userName = user.displayName ?? "Üye";
  const email = user.primaryEmail ?? "—";
  const isLocal = !!user.isLocalMember;

  const go = (id: Sekme) => ({
    to: "/hesabim" as const,
    search: { sekme: id },
  });

  return (
    <ForumShell>
      <Toaster theme="light" position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar
                name={userName}
                size="lg"
                imageUrl={member?.avatarUrl ?? user.profileImageUrl}
              />
              <div>
                <p className="text-xs font-medium tracking-wide text-subtle uppercase">
                  Kullanıcı paneli
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <UserName name={userName} size="lg" link={false} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <RankBadge activity={member?.activity} />
                  <FrameBadge activity={member?.activity} />
                </div>
                <p className="mt-1 text-sm text-muted">{email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" asChild>
                <Link
                  to="/uye/$name"
                  params={{ name: encodeURIComponent(userName) }}
                >
                  Genel profil
                </Link>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (isLocal) logoutMember();
                  else if (authEnabled) void signOut();
                }}
              >
                <LogOut className="size-3.5" />
                Çıkış
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4 lg:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto lg:w-48 lg:flex-col">
            {TABS.map((t) => {
              if (t.id === "guvenlik" && !isLocal) return null;
              if (t.id === "tehlike" && !isLocal) return null;
              return (
                <Link
                  key={t.id}
                  {...go(t.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap",
                    tab === t.id
                      ? "bg-primary text-primary-fg"
                      : "text-muted hover:bg-surface-hover hover:text-fg",
                  )}
                >
                  {t.icon}
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <div className="min-w-0 flex-1">
            {tab === "ozet" && (
              <OverviewTab
                userName={userName}
                email={email}
                member={member}
                founder={founder}
                isLocal={isLocal}
                threads={threads}
                posts={posts}
                names={names}
                listings={listings}
                jobs={jobs}
                onGo={(id) => {
                  /* navigation via links in UI */
                }}
              />
            )}
            {tab === "profil" && (
              <ProfileTab
                userName={userName}
                member={member}
                isLocal={isLocal}
                updateProfile={updateProfile}
              />
            )}
            {tab === "guvenlik" && isLocal && <SecurityTab email={email} />}
            {tab === "aktivite" && (
              <ActivityTab
                userName={userName}
                member={member}
                threads={threads}
                posts={posts}
                names={names}
                listings={listings}
                jobs={jobs}
                reports={reports}
              />
            )}
            {tab === "tercihler" && isLocal && member && (
              <PrefsTab member={member} updateProfile={updateProfile} />
            )}
            {tab === "tehlike" && isLocal && <DangerTab />}
          </div>
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
    <section className="rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <h2 className="font-display text-base font-semibold text-fg">{title}</h2>
      {description && (
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

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

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated px-3 py-2.5">
      <div className="flex items-center gap-1 text-[10px] tracking-wide text-subtle uppercase">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-fg">
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
  threads,
  posts,
  names,
  listings,
  jobs,
}: {
  userName: string;
  email: string;
  member: Member | null;
  founder: boolean;
  isLocal: boolean;
  threads: ReturnType<typeof useForumStore.getState>["threads"];
  posts: ReturnType<typeof useForumStore.getState>["posts"];
  names: Record<string, string>;
  listings: ReturnType<typeof useMarketplaceStore.getState>["listings"];
  jobs: ReturnType<typeof useJobsStore.getState>["jobs"];
  onGo: (id: Sekme) => void;
}) {
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

  const act = normalizeActivity(member?.activity);

  return (
    <div className="space-y-4">
      <PanelCard
        title="Hoş geldiniz"
        description="Hesap özetiniz, aktiflik kademeniz ve hızlı erişim."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Avatar
            name={userName}
            size="lg"
            imageUrl={member?.avatarUrl}
          />
          <div>
            <UserName name={userName} size="lg" />
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <RankBadge activity={member?.activity} />
              <FrameBadge activity={member?.activity} />
            </div>
            <p className="mt-1 text-sm text-muted">{email}</p>
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
        {member && (
          <div className="mt-4 rounded-lg border border-border bg-bg-elevated/80 px-3 py-3">
            <p className="mb-2 text-xs font-semibold text-fg">
              Aktiflik kademesi
            </p>
            <ActivityProgress
              activity={act}
              rank={getRank(act.totalMinutes)}
              frame={getFrame(act)}
              nextR={nextRank(act.totalMinutes)}
              nextF={nextFrame(act)}
            />
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link to="/hesabim" search={{ sekme: "profil" }}>
              <UserCog className="size-3.5" />
              Profili düzenle
            </Link>
          </Button>
          {isLocal && (
            <Button size="sm" variant="secondary" asChild>
              <Link to="/hesabim" search={{ sekme: "guvenlik" }}>
                <Shield className="size-3.5" />
                Güvenlik
              </Link>
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
    ? `${member.id}|${member.updatedAt ?? ""}|${member.displayName}|${member.profile.bio}|${member.profile.city}|${member.profile.district}|${member.profile.website}|${member.profile.locationNote}|${member.avatarUrl?.length ?? 0}`
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
      description="Toplulukta görünen kimliğiniz, fotoğrafınız ve aktiflik rozetleriniz."
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
        <div className="flex flex-wrap items-center gap-4 rounded-lg bg-bg-elevated px-3 py-3">
          <Avatar
            name={displayName || userName}
            size="xl"
            imageUrl={member.avatarUrl}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="text-xs text-muted">
              Önizleme: <UserName name={displayName || userName} size="sm" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <RankBadge activity={member.activity} />
              <FrameBadge activity={member.activity} />
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-fg hover:bg-surface-hover">
                Profil fotoğrafı yükle
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    try {
                      const url = await compressImageFile(f, 320, 0.78);
                      const res = setMemberAvatar(url);
                      if (!res.ok) {
                        toast.error(res.error);
                        return;
                      }
                      toast.success("Profil fotoğrafı güncellendi");
                    } catch (err) {
                      toast.error(
                        err instanceof Error
                          ? err.message
                          : "Yükleme başarısız",
                      );
                    }
                  }}
                />
              </label>
              {member.avatarUrl && (
                <button
                  type="button"
                  className="rounded-md border border-border px-2.5 py-1.5 text-xs text-muted hover:bg-surface hover:text-fg"
                  onClick={() => {
                    const res = setMemberAvatar(null);
                    if (!res.ok) toast.error(res.error);
                    else toast.success("Profil fotoğrafı kaldırıldı");
                  }}
                >
                  Kaldır
                </button>
              )}
            </div>
            <p className="text-[11px] text-subtle">
              JPG/PNG/WebP · kare önerilir · otomatik sıkıştırılır. Fotoğraf
              forumda avatarınız olarak görünür; çerçeve aktifliğe göre
              otomatik eklenir.
            </p>
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
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Web sitesi">
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
            className={inputCls}
          />
        </Field>
        <Field label="Konum notu">
          <input
            value={locationNote}
            onChange={(e) => setLocationNote(e.target.value)}
            placeholder="Örn. Selçuklu civarı"
            className={inputCls}
          />
        </Field>
        <Button type="submit">Kaydet</Button>
      </form>
    </PanelCard>
  );
}

function SecurityTab({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(email);
  const [emailPassword, setEmailPassword] = useState("");

  return (
    <div className="space-y-4">
      <PanelCard
        title="Şifre değiştir"
        description="En az 8 karakter, harf + rakam."
      >
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await changePassword({ currentPassword, newPassword });
            if (!res.ok) {
              toast.error(res.error);
              return;
            }
            toast.success("Şifre güncellendi");
            setCurrentPassword("");
            setNewPassword("");
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
          <Button type="submit">
            <KeyRound className="size-3.5" />
            Şifreyi güncelle
          </Button>
        </form>
      </PanelCard>

      <PanelCard
        title="E-posta değiştir"
        description="Giriş e-postanız. Onay için mevcut şifre gerekir."
      >
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await changeEmail({
              password: emailPassword,
              newEmail,
            });
            if (!res.ok) {
              toast.error(res.error);
              return;
            }
            toast.success("E-posta güncellendi");
            setEmailPassword("");
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
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Button type="submit">
            <Mail className="size-3.5" />
            E-postayı güncelle
          </Button>
        </form>
      </PanelCard>
    </div>
  );
}

function ActivityTab({
  userName,
  member,
  threads,
  posts,
  names,
  listings,
  jobs,
  reports,
}: {
  userName: string;
  member: Member | null;
  threads: ReturnType<typeof useForumStore.getState>["threads"];
  posts: ReturnType<typeof useForumStore.getState>["posts"];
  names: Record<string, string>;
  listings: ReturnType<typeof useMarketplaceStore.getState>["listings"];
  jobs: ReturnType<typeof useJobsStore.getState>["jobs"];
  reports: ReturnType<typeof useReportsStore.getState>["reports"];
}) {
  const myThreads = threads
    .filter((t) => names[t.authorId] === userName)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 8);
  const myListings = listings
    .filter((l) => l.authorName === userName)
    .slice(0, 5);
  const myJobs = jobs.filter((j) => j.authorName === userName).slice(0, 5);
  const myReports = reports
    .filter((r) => r.reporterName === userName)
    .slice(0, 5);

  const act = normalizeActivity(member?.activity);

  return (
    <div className="space-y-4">
      {member && (
        <PanelCard
          title="Aktiflik, rozet ve çerçeve"
          description="Oturum açık ve sayfa görünürken süre birikir. Kademeler otomatik açılır."
        >
          <ActivityProgress
            activity={act}
            rank={getRank(act.totalMinutes)}
            frame={getFrame(act)}
            nextR={nextRank(act.totalMinutes)}
            nextF={nextFrame(act)}
          />
        </PanelCard>
      )}
      <PanelCard title="Son konularınız">
        {myThreads.length === 0 ? (
          <p className="text-sm text-muted">Henüz konu yok.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {myThreads.map((t) => (
              <li key={t.id} className="flex justify-between gap-2 py-2">
                <Link
                  to="/konu/$threadId"
                  params={{ threadId: t.id }}
                  className="min-w-0 truncate text-primary hover:underline"
                >
                  {t.title}
                </Link>
                <span className="shrink-0 text-[11px] text-subtle">
                  {formatRelative(t.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[11px] text-subtle">
          Toplam mesaj:{" "}
          {posts.filter((p) => names[p.authorId] === userName).length}
        </p>
      </PanelCard>
      <PanelCard title="İlanlar">
        {myListings.length + myJobs.length === 0 ? (
          <p className="text-sm text-muted">Aktif ilan yok.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {myListings.map((l) => (
              <li key={l.id}>
                <Link
                  to="/ikinci-el/$listingId"
                  params={{ listingId: l.id }}
                  className="text-primary hover:underline"
                >
                  {l.title}
                </Link>
              </li>
            ))}
            {myJobs.map((j) => (
              <li key={j.id}>
                <Link
                  to="/is-ilani/$jobId"
                  params={{ jobId: j.id }}
                  className="text-primary hover:underline"
                >
                  {j.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>
      {myReports.length > 0 && (
        <PanelCard title="Bildirimleriniz">
          <ul className="space-y-1 text-xs text-muted">
            {myReports.map((r) => (
              <li key={r.id}>
                {r.reason} · {formatRelative(r.createdAt)} · {r.status}
              </li>
            ))}
          </ul>
        </PanelCard>
      )}
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
  const prefs = { ...DEFAULT_PREFS, ...member.prefs };
  return (
    <PanelCard
      title="Tercihler"
      description="Gizlilik ve bilgilendirme tercihleri (yerel kayıt)."
    >
      <div className="space-y-3">
        {(
          [
            ["showEmail", "E-postamı profilimde göster"],
            ["notifyModeration", "Moderasyon bilgilendirmeleri"],
            ["notifyListings", "İlan özet tercihleri"],
            ["preferCompactLists", "Kompakt liste görünümü"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={!!prefs[key]}
              onChange={(e) => {
                const res = updateProfile({
                  prefs: { [key]: e.target.checked },
                });
                if (!res.ok) toast.error(res.error);
                else toast.success("Tercih kaydedildi");
              }}
              className="size-4 accent-[var(--color-primary,#1f6b56)]"
            />
            {label}
          </label>
        ))}
      </div>
    </PanelCard>
  );
}

function DangerTab() {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="space-y-4">
      <PanelCard
        title="Veri dışa aktar"
        description="Hesap bilgilerinizin JSON kopyası (şifre hariç)."
      >
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const data = exportMemberData();
            if (!data) {
              toast.error("Dışa aktarım yok");
              return;
            }
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "konyago-arsiv-hesap.json";
            a.click();
            URL.revokeObjectURL(url);
            toast.success("İndirildi");
          }}
        >
          <Download className="size-3.5" />
          JSON indir
        </Button>
      </PanelCard>

      <PanelCard
        title="Hesabı sil"
        description="Kalıcıdır. Onay için kutuya SIL yazın."
      >
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!confirm("Hesabınız kalıcı silinsin mi?")) return;
            const res = await deleteAccount({ password, confirmText });
            if (!res.ok) {
              toast.error(res.error);
              return;
            }
            toast.success("Hesap silindi");
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
          <Field label='Onay (SIL yazın)'>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Button type="submit" className="bg-danger text-white hover:bg-danger/90">
            Hesabı kalıcı sil
          </Button>
        </form>
      </PanelCard>
    </div>
  );
}
