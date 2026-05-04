import { AdminHeader } from "@/components/admin/admin-header";
import { SingletonEditor } from "@/components/admin/singleton-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function BrandingAdminPage() {
  return (
    <>
      <AdminHeader />
      <SingletonEditor
        title="Edit Branding"
        description="Kelola foto kecil di header website dan favicon browser."
        endpoint="/api/admin/branding"
        fields={[
          {
            name: "headerImage",
            label: "Foto header",
            type: "image",
            uploadFolder: "branding",
            placeholder: "/uploads/branding/header.png atau https://...",
            help: "Foto kecil di kiri nama pada header website. Field ini terpisah dari foto Hero.",
          },
          {
            name: "faviconImage",
            label: "Favicon",
            type: "image",
            uploadFolder: "branding",
            placeholder: "/uploads/branding/favicon.png atau /favicon.ico",
            help: "Icon kecil di tab browser. Field ini terpisah dari foto Header dan Hero.",
          },
        ]}
      />
    </>
  );
}
