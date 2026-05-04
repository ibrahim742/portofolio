"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!cancelled && !response.ok) {
          router.replace("/admin/login");
          router.refresh();
        }
      } catch {
        if (!cancelled) {
          router.replace("/admin/login");
          router.refresh();
        }
      }
    }

    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        void verifySession();
      }
    }

    void verifySession();
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", verifySession);

    return () => {
      cancelled = true;
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", verifySession);
    };
  }, [router]);

  return null;
}

