import type { Post, Thread } from "@/lib/forum/data";
import type { Member } from "@/lib/members/store";
import type { MarketplaceListing } from "@/lib/marketplace/data";
import type { JobListing } from "@/lib/jobs/data";
import type { ContentReport } from "@/lib/reports/store";
import type { AppNotification } from "@/lib/notifications/store";

export type CloudSnapshot = {
  v: 1;
  updatedAt: string;
  forum: {
    threads: Thread[];
    posts: Post[];
    names: Record<string, string>;
  };
  members: Member[];
  marketplace: { listings: MarketplaceListing[] };
  jobs: { jobs: JobListing[] };
  reports: { reports: ContentReport[] };
  notifications: { items: AppNotification[] };
  siteMeta: {
    bannerText: string;
    bannerHref: string;
    bannerActive: boolean;
    featuredThreadId: string | null;
    featuredLabel: string;
  };
};

export type SyncPullResponse = {
  ok: true;
  rev: number;
  updatedAt: string;
  data: CloudSnapshot | null;
};

export type SyncPushResponse =
  | { ok: true; rev: number; updatedAt: string; data: CloudSnapshot }
  | { ok: false; error: string; rev?: number; data?: CloudSnapshot };

export const CLOUD_DOC_KEY = "konyago-arsiv-main";
export const SYNC_LOCAL_REV_KEY = "konyago-arsiv-sync-rev";
export const SYNC_LOCAL_DIRTY_KEY = "konyago-arsiv-sync-dirty";
