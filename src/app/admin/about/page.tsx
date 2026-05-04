import { AdminHeader } from "@/components/admin/admin-header";
import { SingletonEditor } from "@/components/admin/singleton-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AboutAdminPage() {
  return (
    <>
      <AdminHeader />
      <SingletonEditor
        title="Edit About"
        description="Konten profil singkat yang menjelaskan fokus kerja, kemampuan, dan highlight utama."
        endpoint="/api/admin/about"
        fields={[
          { name: "eyebrow", label: "Eyebrow" },
          { name: "title", label: "Judul" },
          { name: "subtitle", label: "Subtitle" },
          { name: "description", label: "Deskripsi pendek", type: "textarea" },
          { name: "paragraphs", label: "Paragraf profil", type: "array" },
          { name: "highlights", label: "Highlights", type: "array" },
        ]}
      />
    </>
  );
}
