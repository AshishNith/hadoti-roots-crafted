import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { PageTransition } from "@/components/layout/PageTransition";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-[10rem] leading-none italic text-[color:var(--earth)]">404</h1>
        <h2 className="mt-2 font-display text-2xl">This field is fallow.</h2>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          The page you're looking for isn't planted here.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-[color:var(--earth)] px-6 py-3 text-sm uppercase tracking-[0.18em] text-white font-body"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl">Something didn't grow right.</h1>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{error.message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-sm bg-[color:var(--earth)] px-6 py-3 text-sm uppercase tracking-[0.18em] text-white"
          >
            Try again
          </button>
          <a href="/" className="rounded-sm border border-[color:var(--ink)] px-6 py-3 text-sm uppercase tracking-[0.18em]">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hadoti Farms — Farm-direct staples from Rajasthan" },
      { name: "description", content: "Pesticide-free dals, masalas, and custom ration boxes from the Hadoti region — Kota, Bundi, Jhalawar." },
      { name: "author", content: "Hadoti Farms" },
      { property: "og:title", content: "Hadoti Farms" },
      { property: "og:description", content: "Farm-direct, custom-blended Indian staples." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-store";
import { syncUser } from "@/lib/api-client";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const setUser = useAuth((s) => s.setUser);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const u = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        setUser(u);
        syncUser(u).catch((err) => console.error("Failed to sync user to MongoDB:", err));
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <CustomCursor />
      <PageTransition />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </QueryClientProvider>
  );
}
