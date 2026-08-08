import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ForumShell } from "@/components/forum/layout";
import { ForumSidebar } from "@/components/forum/sidebar";
import { HomeHubs } from "@/components/forum/home-hubs";
import { OfficialSpotlight } from "@/components/forum/official-spotlight";
import { TrustStrip } from "@/components/forum/trust-strip";
import { FeaturedArchiveCard } from "@/components/forum/featured-card";
import { PwaInstallHint } from "@/components/forum/pwa-install";
import {
  CategoryList,
  LatestThreadsTable,
} from "@/components/forum/category-list";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      title: "Ana sayfa",
      description:
        "Konya forum ana sayfa: kategoriler, duyurular, sıcak konular. KonyaGo Arşiv topluluğu.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <ForumShell search={search} onSearch={setSearch}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <PwaInstallHint />
          <TrustStrip />
          <OfficialSpotlight />
          <FeaturedArchiveCard />
          <HomeHubs />
          <CategoryList filter={search} hideOfficialGroup />
          <LatestThreadsTable filter={search} />
        </div>
        <ForumSidebar />
      </div>
    </ForumShell>
  );
}
