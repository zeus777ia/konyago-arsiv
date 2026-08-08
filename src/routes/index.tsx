import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ForumShell } from "@/components/forum/layout";
import { ForumSidebar } from "@/components/forum/sidebar";
import { HomeHubs } from "@/components/forum/home-hubs";
import {
  CategoryList,
  LatestThreadsTable,
} from "@/components/forum/category-list";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <ForumShell search={search} onSearch={setSearch}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5 min-w-0">
          <HomeHubs />
          <CategoryList filter={search} />
          <LatestThreadsTable filter={search} />
        </div>
        <div className="min-w-0">
          <ForumSidebar />
        </div>
      </div>
    </ForumShell>
  );
}
