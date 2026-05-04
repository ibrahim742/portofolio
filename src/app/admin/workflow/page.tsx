import { AdminHeader } from "@/components/admin/admin-header";
import { CollectionManager } from "@/components/admin/collection-manager";
import { SectionEditor } from "@/components/admin/section-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function WorkflowAdminPage() {
  return (
    <>
      <AdminHeader />
      <SectionEditor
        title="Heading Workflow"
        endpoint="/api/admin/sections/workflow"
      />
      <CollectionManager
        title="CRUD Workflow"
        description="Kelola langkah alur kerja dari analisis sampai maintenance. Data published akan tampil berurutan."
        endpoint="/api/admin/workflow"
        itemLabel="workflow"
        emptyItem={{
          title: "",
          slug: "",
          icon: "search",
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
            placeholder: "search, drafting, settings...",
          },
          { name: "description", label: "Deskripsi", type: "textarea" },
          { name: "sortOrder", label: "Urutan", type: "number" },
          { name: "isPublished", label: "Published", type: "boolean" },
        ]}
      />
    </>
  );
}
