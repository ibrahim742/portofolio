"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navItems } from "@/data/portfolio";
import { heroContent } from "@/data/portfolio";
import type { BrandingContentData } from "@/lib/branding";
import type { HeroContentData } from "@/lib/content";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  content?: HeroContentData;
  branding?: BrandingContentData;
};

export function SiteHeader({
  content = heroContent,
  branding,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const profileImage = branding?.headerImage || "";
  const profileImageAlt = content.profileImageAlt || content.name;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-surface/[0.72] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="#home" className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-sm font-semibold text-cyan-200 shadow-glow">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt={profileImageAlt}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              "IS"
            )}
          </span>
          <span className="hidden text-sm font-semibold text-ink sm:inline">
            {content.name}
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="/api/admin/google/start?next=%2Fadmin"
          className="hidden rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/10 md:inline-flex"
        >
          Login Google
        </a>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-md border border-white/10 text-ink transition hover:bg-white/5 md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "grid border-t border-white/10 bg-surface/[0.96] transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav className="overflow-hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm text-muted transition hover:bg-white/5 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/api/admin/google/start?next=%2Fadmin"
              className="rounded-md px-2 py-3 text-sm text-cyan-100 transition hover:bg-white/5 hover:text-ink"
            >
              Login Google
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
