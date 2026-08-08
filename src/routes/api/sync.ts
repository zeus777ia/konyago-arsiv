import { createFileRoute } from "@tanstack/react-router";
import { handleSync } from "@/lib/sync/server";

const handle = ({ request }: { request: Request }) => handleSync(request);

export const Route = createFileRoute("/api/sync")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      OPTIONS: handle,
    },
  },
});
