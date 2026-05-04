import { AdminHeader } from "@/components/admin/admin-header";
import { CollectionManager } from "@/components/admin/collection-manager";
import { SectionEditor } from "@/components/admin/section-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProjectsAdminPage() {
  return (
    <>
      <AdminHeader />
      <SectionEditor
        title="Heading Projects"
        endpoint="/api/admin/sections/projects"
      />
      <CollectionManager
        title="CRUD Projects"
        description="Kelola portfolio project. Di sini bisa lihat data yang sudah ada, tambah project baru, upload gambar lokal, atau pakai URL gambar eksternal."
        endpoint="/api/admin/projects"
        itemLabel="project"
        emptyItem={{
          title: "",
          slug: "",
          icon: "layers",
          category: "",
          image: "/projects/sistem-informasi-sekolah.svg",
          imageAlt: "",
          description: "",
          techStack: [],
          liveUrl: "",
          sourceUrl: "",
          sortOrder: 0,
          isPublished: true,
        }}
        fields={[
          { name: "title", label: "Judul" },
          { name: "slug", label: "Slug" },
          {
            name: "icon",
            label: "Icon lucide key",
            placeholder: "layers, monitor, activity...",
          },
          { name: "category", label: "Kategori" },
          { name: "image", label: "Gambar project", type: "image" },
          { name: "imageAlt", label: "Alt text gambar" },
          { name: "description", label: "Deskripsi", type: "textarea" },
          { name: "techStack", label: "Tech stack", type: "array" },
          { name: "liveUrl", label: "Link demo/live" },
          { name: "sourceUrl", label: "Link source/GitHub" },
          { name: "sortOrder", label: "Urutan", type: "number" },
          { name: "isPublished", label: "Published", type: "boolean" },
        ]}
      />
    </>
  );
}
