"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Contact,
  Database,
  ExternalLink,
  FileText,
  Image,
  Home,
  Layers,
  LogOut,
  Menu,
  Settings,
  User,
  Wrench,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/branding", label: "Branding", icon: Image },
  { href: "/admin/hero", label: "Hero", icon: FileText },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Layers },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/admin/workflow", label: "Workflow", icon: Settings },
  { href: "/admin/contact", label: "Contact", icon: Contact },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  useEffect(() => {
    const shell = document.querySelector(".admin-shell");
    shell?.setAttribute("data-sidebar", desktopOpen ? "expanded" : "collapsed");

    return () => {
      shell?.removeAttribute("data-sidebar");
    };
  }, [desktopOpen]);

  const current = links
    .filter((link) =>
      link.href === "/admin"
        ? pathname === link.href
        : pathname.startsWith(link.href),
    )
    .at(-1);

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
    });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#343a40] text-[#c2c7d0] shadow-xl transition-all duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          desktopOpen ? "lg:w-64" : "lg:w-20",
          "w-[min(18rem,calc(100vw-3rem))] lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 text-white">
          <Link href="/admin" className="flex items-center gap-3 font-semibold">
            <span className="grid size-10 place-items-center rounded-md bg-[#007bff] text-sm font-bold text-white">
              IS
            </span>

            {desktopOpen && (
              <span className="whitespace-nowrap lg:block">
                Portfolio Admin
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="grid size-9 place-items-center rounded hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="grid gap-1 px-3 py-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/admin"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-[#007bff] text-white"
                    : "text-[#c2c7d0] hover:bg-white/10 hover:text-white",
                  !desktopOpen && "lg:justify-center",
                )}
              >
                <Icon size={18} />
                {desktopOpen && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-30 border-b border-[#dee2e6] bg-white shadow-sm transition-all duration-300",
          desktopOpen ? "lg:left-64" : "lg:left-20",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setDesktopOpen((value) => !value);
                } else {
                  setMobileOpen(true);
                }
              }}
              className="grid size-9 place-items-center rounded text-[#343a40] transition hover:bg-[#f4f6f9]"
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-2 text-sm text-[#6c757d] sm:flex">
              <Database size={16} />
              <span>Master Data</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/"
              target="_blank"
              aria-label="Lihat Website"
              title="Lihat Website"
              className="inline-flex items-center gap-2 rounded px-2 py-2 text-xs font-medium text-[#007bff] transition hover:bg-[#f4f6f9] sm:px-3"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Lihat Website</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              aria-label="Logout"
              title="Logout"
              className="inline-flex items-center gap-2 rounded px-2 py-2 text-xs font-medium text-[#007bff] transition hover:bg-[#f4f6f9] sm:px-3"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed left-0 right-0 top-14 z-20 border-b border-[#dee2e6] bg-[#f4f6f9] px-3 py-3 transition-all duration-300 sm:px-5 sm:py-4",
          desktopOpen ? "lg:left-64" : "lg:left-20",
        )}
      >
        <h1 className="truncate text-xl font-semibold text-[#212529] sm:text-2xl">
          {current?.label || "Dashboard"}
        </h1>
      </div>
    </>
  );
}
