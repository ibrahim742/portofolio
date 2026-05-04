import { AdminHeader } from "@/components/admin/admin-header";
import { CollectionManager } from "@/components/admin/collection-manager";
import { SectionEditor } from "@/components/admin/section-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SkillsAdminPage() {
  return (
    <>
      <AdminHeader />
      <SectionEditor
        title="Heading Skills"
        endpoint="/api/admin/sections/skills"
      />
      <CollectionManager
        title="CRUD Skills"
        description="Kelola kategori skill yang tampil di section Skills. Setiap kategori punya judul, icon, daftar item, urutan, dan status publish."
        endpoint="/api/admin/skills"
        itemLabel="skill"
        emptyItem={{
          title: "",
          slug: "",
          icon: "code",
          items: [],
          sortOrder: 0,
          isPublished: true,
        }}
        fields={[
          { name: "title", label: "Judul" },
          { name: "slug", label: "Slug" },
          {
            name: "icon",
            label: "Icon lucide key",
            placeholder: "code, bot, router, shield...",
          },
          { name: "items", label: "Daftar skill/item", type: "array" },
          { name: "sortOrder", label: "Urutan", type: "number" },
          { name: "isPublished", label: "Published", type: "boolean" },
        ]}
      />
    </>
  );
}
