import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";

import { ensureAdmin, handleApiError } from "@/lib/api";
import { jsonNoStore } from "@/lib/cache";
import { createSlug } from "@/lib/slug";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);
const allowedFolders = new Set(["projects", "profile", "branding"]);
const maxFileSize = 5 * 1024 * 1024;

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return (
    value instanceof Blob &&
    typeof (value as { name?: unknown }).name === "string"
  );
}

function shouldUseDataUrlStorage() {
  return process.env.UPLOAD_STORAGE === "data-url" || process.env.VERCEL === "1";
}

export async function POST(request: Request) {
  try {
    const unauthorized = await ensureAdmin();
    if (unauthorized) return unauthorized;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!isUploadedFile(file)) {
      return jsonNoStore(
        { error: "File tidak ditemukan." },
        { status: 422 },
      );
    }

    if (!allowedTypes.has(file.type)) {
      return jsonNoStore(
        { error: "Format gambar tidak didukung." },
        { status: 422 },
      );
    }

    if (file.size > maxFileSize) {
      return jsonNoStore(
        { error: "Ukuran gambar maksimal 5 MB." },
        { status: 422 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/png";

    if (shouldUseDataUrlStorage()) {
      return jsonNoStore({
        path: `data:${mimeType};base64,${bytes.toString("base64")}`,
      });
    }

    const folderValue = String(formData.get("folder") || "projects");
    const folder = allowedFolders.has(folderValue) ? folderValue : "projects";
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    const fileNameValue = file.name || folder;
    const extension = extname(fileNameValue) || ".png";
    const baseName =
      createSlug(fileNameValue.replace(/\.[^.]+$/, "")) || folder;
    const fileName = `${baseName}-${Date.now()}${extension}`;

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, fileName), bytes);

    return jsonNoStore({ path: `/uploads/${folder}/${fileName}` });
  } catch (error) {
    return handleApiError(error);
  }
}
