import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ForumShell } from "@/components/forum/layout";
import { LatestThreadsTable } from "@/components/forum/category-list";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/yeni-mesajlar")({
  head: () =>
    seoHead({
      title: 'Yeni mesajlar',
      description: 'Forumda en son mesajlar ve güncel konular.',
      path: '/yeni-mesajlar',
    }),
  component: NewMessagesPage,
});

function NewMessagesPage() {
  const [search, setSearch] = useState("");

  return (
    <ForumShell search={search} onSearch={setSearch}>
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to="/" className="hover:text-primary">
          Ana sayfa
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-fg">Yeni mesajlar</span>
      </nav>
      <h1 className="mb-4 text-xl font-semibold tracking-tight">Yeni mesajlar</h1>
      <LatestThreadsTable
        filter={search}
        limit={40}
        title="Son güncellenen konular"
        showAllLink={false}
      />
    </ForumShell>
  );
}
