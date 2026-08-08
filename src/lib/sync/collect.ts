import { useForumStore } from "@/lib/forum/store";
import { useMembersStore } from "@/lib/members/store";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useJobsStore } from "@/lib/jobs/store";
import { useReportsStore } from "@/lib/reports/store";
import { useNotificationsStore } from "@/lib/notifications/store";
import { useSiteMetaStore } from "@/lib/site/announcements";
import type { CloudSnapshot } from "./types";
import { emptySnapshot } from "./merge";

export function collectLocalSnapshot(): CloudSnapshot {
  const forum = useForumStore.getState();
  const members = useMembersStore.getState();
  const market = useMarketplaceStore.getState();
  const jobs = useJobsStore.getState();
  const reports = useReportsStore.getState();
  const notif = useNotificationsStore.getState();
  const site = useSiteMetaStore.getState();

  return {
    v: 1,
    updatedAt: new Date().toISOString(),
    forum: {
      threads: forum.threads,
      posts: forum.posts,
      names: forum.names,
    },
    members: members.members,
    marketplace: { listings: market.listings },
    jobs: { jobs: jobs.jobs },
    reports: { reports: reports.reports },
    notifications: { items: notif.items },
    siteMeta: {
      bannerText: site.bannerText,
      bannerHref: site.bannerHref,
      bannerActive: site.bannerActive,
      featuredThreadId: site.featuredThreadId,
      featuredLabel: site.featuredLabel,
    },
  };
}

/** Apply cloud snapshot into zustand stores (preserves local session). */
export function applySnapshot(data: CloudSnapshot) {
  const snap = data?.v === 1 ? data : emptySnapshot();
  const session = useMembersStore.getState().session;
  const resetTokens = useMembersStore.getState().resetTokens;

  useForumStore.setState({
    threads: snap.forum.threads,
    posts: snap.forum.posts,
    names: snap.forum.names,
    seededOfficial: true,
  });
  // re-ensure official content on top
  useForumStore.getState().ensureSeed();

  useMembersStore.setState({
    members: snap.members,
    session,
    resetTokens,
  });

  useMarketplaceStore.setState({ listings: snap.marketplace.listings });
  useJobsStore.setState({ jobs: snap.jobs.jobs });
  useReportsStore.setState({ reports: snap.reports.reports });
  useNotificationsStore.setState({ items: snap.notifications.items });
  useSiteMetaStore.setState({
    bannerText: snap.siteMeta.bannerText,
    bannerHref: snap.siteMeta.bannerHref,
    bannerActive: snap.siteMeta.bannerActive,
    featuredThreadId: snap.siteMeta.featuredThreadId,
    featuredLabel: snap.siteMeta.featuredLabel,
  });
}
