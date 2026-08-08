import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("konyago-pwa-hide") === "1") setHidden(true);
    } catch {
      /* ignore */
    }
    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  if (hidden || !deferred) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs shadow-card">
      <p className="text-muted">
        Ana ekrana ekleyerek mobil erişimi hızlandırabilirsiniz (PWA).
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            try {
              localStorage.setItem("konyago-pwa-hide", "1");
            } catch {
              /* ignore */
            }
            setHidden(true);
          }}
        >
          Gizle
        </Button>
        <Button
          size="sm"
          onClick={async () => {
            await deferred.prompt();
            setDeferred(null);
          }}
        >
          <Download className="size-3.5" />
          Yükle
        </Button>
      </div>
    </div>
  );
}
