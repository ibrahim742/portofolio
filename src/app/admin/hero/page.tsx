import { AdminHeader } from "@/components/admin/admin-header";
import { SingletonEditor } from "@/components/admin/singleton-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HeroAdminPage() {
  return (
    <>
      <AdminHeader />
      <SingletonEditor
        title="Edit Hero"
        description="Konten utama di section paling atas website: nama, headline, teks CTA, dan animasi typing."
        endpoint="/api/admin/hero"
        fields={[
          {
            name: "badge",
            label: "Badge kecil",
            placeholder: "Available for web...",
          },
          { name: "name", label: "Nama utama" },
          { name: "headline", label: "Headline profesi" },
          { name: "roles", label: "Typing Roles", type: "array" },
          { name: "description", label: "Deskripsi hero", type: "textarea" },
          {
            name: "profileImage",
            label: "Slide foto hero",
            type: "image-list",
            placeholder:
              "/uploads/profile/foto-1.png\n/uploads/profile/foto-2.png\nhttps://...",
            help: "Upload beberapa foto atau tulis satu path/URL per baris. Field ini hanya untuk slide foto Hero, bukan Header atau Favicon.",
          },
          { name: "profileImageAlt", label: "Alt text foto profil" },
          { name: "primaryCta", label: "Label CTA utama" },
          {
            name: "primaryCtaHref",
            label: "Link Download CV",
            placeholder: "/cv/ibrahim-setiawan-cv.pdf",
            help: "Isi path file CV dari folder public atau URL eksternal.",
          },
          { name: "secondaryCta", label: "Label CTA kedua" },
        ]}
      />
    </>
  );
}
