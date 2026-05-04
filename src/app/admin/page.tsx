import Link from "next/link";

import { AdminHeader } from "@/components/admin/admin-header";
import { prisma } from "@/lib/prisma";

const cards = [
  {
    href: "/admin/branding",
    key: "branding",
    title: "Branding",
    description: "Edit foto kecil di header website dan favicon browser.",
    kind: "single",
  },
  {
    href: "/admin/hero",
    key: "hero",
    title: "Hero",
    description: "Edit nama, headline, CTA, deskripsi, dan typing roles.",
    kind: "single",
  },
  {
    href: "/admin/about",
    key: "about",
    title: "About",
    description: "Edit profil, paragraf penjelasan, dan highlight utama.",
    kind: "single",
  },
  {
    href: "/admin/skills",
    key: "skills",
    title: "Skills",
    description:
      "Edit heading section, lalu lihat, tambah, edit, hapus kategori skill dan daftar item.",
    kind: "collection",
  },
  {
    href: "/admin/services",
    key: "services",
    title: "Services",
    description:
      "Edit heading section, lalu lihat, tambah, edit, hapus layanan yang ditawarkan.",
    kind: "collection",
  },
  {
    href: "/admin/projects",
    key: "projects",
    title: "Projects",
    description:
      "Edit heading section, lalu lihat, tambah, edit, hapus project dan gambar preview.",
    kind: "collection",
  },
  {
    href: "/admin/workflow",
    key: "workflow",
    title: "Workflow",
    description:
      "Edit heading section, lalu lihat, tambah, edit, hapus langkah alur kerja.",
    kind: "collection",
  },
  {
    href: "/admin/contact",
    key: "contact",
    title: "Contact",
    description: "Edit WhatsApp, email, lokasi, maps, dan teks CTA kontak.",
    kind: "single",
  },
];

async function getCounts() {
  try {
    const [
      branding,
      hero,
      about,
      contact,
      sections,
      skills,
      services,
      projects,
      workflow,
    ] = await Promise.all([
      prisma.brandingContent.count(),
      prisma.heroContent.count(),
      prisma.aboutContent.count(),
      prisma.contactContent.count(),
      prisma.sectionContent.count(),
      prisma.skillCategory.count(),
      prisma.service.count(),
      prisma.project.count(),
      prisma.workflowStep.count(),
    ]);

    return {
      branding,
      hero,
      about,
      contact,
      sections,
      skills,
      services,
      projects,
      workflow,
    };
  } catch {
    return {
      branding: 0,
      hero: 0,
      about: 0,
      contact: 0,
      sections: 0,
      skills: 0,
      services: 0,
      projects: 0,
      workflow: 0,
    };
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const counts = await getCounts();
  const getBadge = (card: (typeof cards)[number]) => {
    const value = counts[card.key as keyof typeof counts];

    if (card.kind === "single") return value > 0 ? "Ready" : "Empty";
    return `${value} item`;
  };

  return (
    <>
      <AdminHeader />
      <main>
        <section className="rounded border border-[#d2d6de] bg-white p-4">
          <p className="text-xs font-semibold uppercase text-[#007bff]">
            Overview
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[#212529]">
            Kelola Konten Portfolio
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6c757d]">
            Pilih salah satu menu di bawah. Halaman Skills, Services, Projects,
            dan Workflow memiliki editor heading di atas, daftar data di kiri,
            dan form tambah/edit di kanan. Jika slug sama, sistem otomatis
            update data lama agar tidak menumpuk duplikat di database.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded border border-[#dee2e6] bg-[#f8f9fa] p-5 transition hover:border-[#007bff] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#212529]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#6c757d]">
                      {card.description}
                    </p>
                  </div>
                  <span
                    className={
                      card.kind === "single"
                        ? "rounded bg-[#28a745] px-2.5 py-1 text-xs font-semibold text-white"
                        : "rounded bg-[#007bff] px-2.5 py-1 text-xs font-semibold text-white"
                    }
                  >
                    {getBadge(card)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded border border-[#bee5eb] bg-[#d1ecf1] p-4 text-sm leading-7 text-[#0c5460]">
            Alur pemakaian: buka menu konten, lihat daftar data yang sudah ada,
            klik <strong>Edit</strong> untuk mengubah, atau klik{" "}
            <strong>Tambah Baru</strong> untuk membuat konten baru. Untuk
            project, gambar bisa upload file lokal atau isi URL gambar
            eksternal.
          </div>
        </section>
      </main>
    </>
  );
}
