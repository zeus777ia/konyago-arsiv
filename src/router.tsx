import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: () => (
      <main className="grid min-h-dvh place-items-center bg-bg px-4 text-center">
        <div>
          <h1 className="text-lg font-semibold text-fg">Sayfa bulunamadı</h1>
          <p className="mt-1 text-sm text-muted">
            Bu konu veya kategori mevcut değil.
          </p>
          <a href="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Ana sayfaya dön
          </a>
        </div>
      </main>
    ),
    defaultPreload: "intent",
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
