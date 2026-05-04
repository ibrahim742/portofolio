import { AdminHeader } from "@/components/admin/admin-header";
import { SingletonEditor } from "@/components/admin/singleton-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ContactAdminPage() {
  return (
    <>
      <AdminHeader />
      <SingletonEditor
        title="Edit Contact"
        description="Konten section kontak, termasuk WhatsApp, email, lokasi, dan link maps."
        endpoint="/api/admin/contact"
        fields={[
          { name: "eyebrow", label: "Eyebrow" },
          { name: "title", label: "Judul" },
          { name: "description", label: "Deskripsi", type: "textarea" },
          { name: "whatsappLabel", label: "Label WhatsApp" },
          { name: "whatsappHref", label: "Link WhatsApp" },
          { name: "emailLabel", label: "Label Email" },
          { name: "emailHref", label: "Link Email" },
          { name: "location", label: "Lokasi" },
          { name: "mapHref", label: "Link Maps" },
          {
            name: "socialLinks",
            label: "Social Media",
            type: "array",
            help: "Tulis satu link per baris dengan format: Label | URL",
          },
        ]}
      />
    </>
  );
}
