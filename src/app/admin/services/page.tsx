import { AdminHeader } from "@/components/admin/admin-header";
import { CollectionManager } from "@/components/admin/collection-manager";
import { SectionEditor } from "@/components/admin/section-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ServicesAdminPage() {
  return (
    <>
      <AdminHeader />
      <SectionEditor
        title="Heading Services"
        endpoint="/api/admin/sections/services"
      />
      <CollectionManager
        title="CRUD Services"
        description="Kelola layanan yang ditawarkan. Data published akan tampil di section Services sesuai urutan."
        endpoint="/api/admin/services"
        itemLabel="service"
        emptyItem={{
          title: "",
          slug: "",
          icon: "globe",
          description: "",
          sortOrder: 0,
          isPublished: true,
        }}
        fields={[
          { name: "title", label: "Judul" },
          { name: "slug", label: "Slug" },
          {
            name: "icon",
            label: "Icon lucide key",
            placeholder: "globe, router, camera...",
          },
          { name: "description", label: "Deskripsi", type: "textarea" },
          { name: "sortOrder", label: "Urutan", type: "number" },
          { name: "isPublished", label: "Published", type: "boolean" },
        ]}
      />
    </>
  );
}
