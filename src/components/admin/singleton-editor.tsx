"use client";

import {
  CheckCircle2,
  Database,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AdminToast } from "@/components/admin/admin-toast";
import { readJsonResponse } from "@/lib/client-api";

type FieldType = "text" | "textarea" | "array" | "image" | "image-list";

export type AdminField = {
  name: string;
  label: string;
  type?: FieldType;
  help?: string;
  placeholder?: string;
  uploadFolder?: "profile" | "projects" | "branding";
};

type AdminValue = string | string[] | undefined;
type AdminData = Record<string, AdminValue> & {
  id?: string;
  error?: string;
};

type SingletonEditorProps = {
  title: string;
  description: string;
  endpoint: string;
  fields: AdminField[];
};

export function SingletonEditor({
  title,
  description,
  endpoint,
  fields,
}: SingletonEditorProps) {
  const [data, setData] = useState<AdminData>({});
  const [initialData, setInitialData] = useState<AdminData>({});
  const [status, setStatus] = useState("Mengambil data...");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const value = (await response.json()) as AdminData;
      console.log("data fetched after refresh", value);

      if (!response.ok || value.error) {
        setStatus(
          response.status === 401
            ? "Session admin tidak valid atau sudah expired. Silakan login ulang."
            : value.error || "Gagal mengambil data.",
        );
        return;
      }

      setData(value);
      setInitialData(value);
      setStatus(
        value.id
          ? "Data saat ini sudah dimuat."
          : "Belum ada data tersimpan. Data default ditampilkan.",
      );
    } catch {
      setStatus("Gagal mengambil data. Periksa koneksi database.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    console.log("form state", data);
  }, [data]);

  function setField(name: string, value: AdminValue) {
    setData((current) => ({ ...current, [name]: value }));
  }

  function getImageList(value: AdminValue) {
    return String(Array.isArray(value) ? value.join("\n") : value || "")
      .split(/[\n,|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function setImageList(fieldName: string, images: string[]) {
    setField(fieldName, images.filter(Boolean).join("\n"));
  }

  function updateImagePath(fieldName: string, index: number, value: string) {
    const images = getImageList(data[fieldName]);
    images[index] = value;
    setImageList(fieldName, images);
  }

  function removeImagePath(fieldName: string, index: number) {
    const images = getImageList(data[fieldName]);
    setImageList(
      fieldName,
      images.filter((_, imageIndex) => imageIndex !== index),
    );
    setStatus(
      "Gambar dihapus dari daftar. Klik Simpan Perubahan untuk menyimpan.",
    );
  }

  async function uploadImage(
    fieldName: string,
    file: File,
    mode: "replace" | "append" = "replace",
    folder = "profile",
  ) {
    setStatus("Mengupload gambar...");
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
    const value = await readJsonResponse<{ path?: string; error?: string }>(
      response,
    );
    console.log("api response", response);

    if (!response.ok || !value.path) {
      setStatus(value.error || "Upload gambar gagal.");
      return;
    }

    if (mode === "append") {
      setImageList(fieldName, [...getImageList(data[fieldName]), value.path]);
      setStatus(
        "Gambar berhasil ditambahkan. Klik Simpan Perubahan untuk menyimpan slide.",
      );
      return;
    }

    setField(fieldName, value.path);
    setStatus("Gambar berhasil diupload dan path sudah masuk ke form.");
  }

  function cancelEdit() {
    setData(initialData);
    setStatus("Perubahan form dibatalkan.");
  }

  async function seedDefaults() {
    const confirmed = window.confirm(
      "Buat data awal portfolio dari default frontend saat ini?",
    );
    if (!confirmed) return;

    setSeeding(true);
    setStatus("Membuat data awal...");
    const response = await fetch("/api/admin/seed", {
      method: "POST",
      cache: "no-store",
    });
    console.log("api response", response);
    setSeeding(false);

    if (!response.ok) {
      setStatus("Gagal membuat data awal.");
      return;
    }

    setStatus("Data awal berhasil dibuat.");
    await loadData();
  }

  async function submit(formData: FormData) {
    setSaving(true);
    setStatus("Menyimpan perubahan...");

    const payload = Object.fromEntries(
      fields.map((field) => {
        const value = String(formData.get(field.name) || "");
        return [
          field.name,
          field.type === "array"
            ? value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            : value,
        ];
      }),
    );
    console.log("payload save", payload);

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    console.log("api response", response);

    setSaving(false);
    if (!response.ok) {
      setStatus("Gagal menyimpan data. Pastikan semua field wajib terisi.");
      return;
    }

    const saved = (await response.json()) as AdminData;
    console.log("database result after update", saved);
    await loadData();
    setStatus(
      "Perubahan tersimpan. Refresh halaman utama untuk melihat hasil terbaru.",
    );
  }

  return (
    <main>
      <section className="rounded border border-[#d2d6de] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#dee2e6] p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#007bff]">
              Single Content
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#212529]">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6c757d]">
              {description}
            </p>
          </div>
          <div className="rounded bg-[#17a2b8] px-3 py-2 text-xs font-medium text-white">
            Mode: edit data utama
          </div>
        </div>

        <form action={submit} className="grid gap-5 p-4">
          {loading ? (
            <div className="flex items-center gap-2 rounded border border-[#dee2e6] bg-[#f8f9fa] p-4 text-sm text-[#6c757d]">
              <Loader2 size={16} className="animate-spin" />
              Mengambil data dari database...
            </div>
          ) : null}

          {fields.map((field) => {
            const value = data[field.name];
            const textValue = Array.isArray(value)
              ? value.join("\n")
              : String(value || "");

            if (field.type === "image-list") {
              const images = getImageList(value);

              return (
                <div key={field.name} className="grid gap-3">
                  <label className="grid gap-2 text-sm font-medium text-[#212529]">
                    <span>{field.label}</span>
                    <textarea
                      name={field.name}
                      rows={Math.max(images.length, 3)}
                      value={textValue}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setField(field.name, event.target.value)
                      }
                      className="rounded border border-[#ced4da] bg-white px-3 py-2 text-sm font-normal leading-6 text-[#212529] outline-none transition"
                    />
                    <span className="text-xs font-normal leading-5 text-[#6c757d]">
                      {field.help ||
                        "Upload beberapa gambar atau tulis satu path/URL per baris."}
                    </span>
                  </label>

                  <div className="rounded border border-[#dee2e6] bg-[#f8f9fa] p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#212529]">
                          Daftar slide gambar
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#6c757d]">
                          Semua gambar di daftar ini hanya dipakai sebagai slide
                          hero.
                        </p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded bg-[#007bff] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0069d9]">
                        <Plus size={16} />
                        Upload Gambar
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(event) => {
                            const files = Array.from(event.target.files || []);
                            files.forEach(
                              (file) =>
                                void uploadImage(
                                  field.name,
                                  file,
                                  "append",
                                  field.uploadFolder || "profile",
                                ),
                            );
                            event.currentTarget.value = "";
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {images.length ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {images.map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="grid gap-3 rounded border border-[#dee2e6] bg-white p-3"
                          >
                            <div className="aspect-[4/3] overflow-hidden rounded border border-[#dee2e6] bg-[#f8f9fa]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={image}
                                alt={`${String(data.profileImageAlt || "Preview foto profil")} ${index + 1}`}
                                className="h-full w-full object-cover object-top"
                              />
                            </div>
                            <label className="grid gap-1 text-xs font-medium text-[#212529]">
                              Path gambar {index + 1}
                              <input
                                value={image}
                                onChange={(event) =>
                                  updateImagePath(
                                    field.name,
                                    index,
                                    event.target.value,
                                  )
                                }
                                className="rounded border border-[#ced4da] bg-white px-3 py-2 text-xs font-normal text-[#212529] outline-none transition"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeImagePath(field.name, index)}
                              className="inline-flex items-center justify-center gap-2 rounded bg-[#dc3545] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#c82333]"
                            >
                              <Trash2 size={14} />
                              Hapus Gambar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 grid place-items-center rounded border border-dashed border-[#ced4da] bg-white p-6 text-sm text-[#6c757d]">
                        <ImageIcon size={28} className="mb-2" />
                        Belum ada gambar slide.
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (field.type === "image") {
              return (
                <div key={field.name} className="grid gap-3">
                  <label className="grid gap-2 text-sm font-medium text-[#212529]">
                    <span>{field.label}</span>
                    <input
                      name={field.name}
                      value={textValue}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setField(field.name, event.target.value)
                      }
                      className="rounded border border-[#ced4da] bg-white px-3 py-2 text-sm font-normal text-[#212529] outline-none transition"
                    />
                    <span className="text-xs font-normal leading-5 text-[#6c757d]">
                      {field.help || "Upload gambar atau isi path/URL gambar."}
                    </span>
                  </label>
                  <div className="grid gap-3 rounded border border-[#dee2e6] bg-[#f8f9fa] p-3 sm:grid-cols-[96px_1fr] sm:items-center">
                    <div className="grid size-24 place-items-center overflow-hidden rounded border border-[#dee2e6] bg-white">
                      {textValue ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={textValue}
                          alt={String(
                            data.profileImageAlt || "Preview foto profil",
                          )}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={28} className="text-[#6c757d]" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void uploadImage(
                            field.name,
                            file,
                            "replace",
                            field.uploadFolder || "profile",
                          );
                        }
                      }}
                      className="text-sm text-[#6c757d]"
                    />
                  </div>
                </div>
              );
            }

            return (
              <label
                key={field.name}
                className="grid gap-2 text-sm font-medium text-[#212529]"
              >
                <span>{field.label}</span>
                {field.type === "textarea" || field.type === "array" ? (
                  <textarea
                    name={field.name}
                    rows={field.type === "array" ? 4 : 5}
                    value={textValue}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setField(field.name, event.target.value)
                    }
                    className="rounded border border-[#ced4da] bg-white px-3 py-2 text-sm font-normal leading-6 text-[#212529] outline-none transition"
                  />
                ) : (
                  <input
                    name={field.name}
                    value={textValue}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setField(field.name, event.target.value)
                    }
                    className="rounded border border-[#ced4da] bg-white px-3 py-2 text-sm font-normal text-[#212529] outline-none transition"
                  />
                )}
                <span className="text-xs font-normal leading-5 text-[#6c757d]">
                  {field.help ||
                    (field.type === "array"
                      ? "Tulis satu item per baris."
                      : "Perubahan disimpan ke database portfolio.")}
                </span>
              </label>
            );
          })}

          <div className="flex flex-col gap-3 border-t border-[#dee2e6] pt-5 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded bg-[#007bff] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0069d9] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center justify-center gap-2 rounded bg-[#6c757d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5a6268]"
            >
              <RotateCcw size={16} />
              Batal
            </button>
            <button
              type="button"
              onClick={() => void loadData()}
              className="inline-flex items-center justify-center gap-2 rounded bg-[#17a2b8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#138496]"
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
            {!initialData.id ? (
              <button
                type="button"
                onClick={() => void seedDefaults()}
                disabled={seeding}
                className="inline-flex items-center justify-center gap-2 rounded border border-[#007bff] px-4 py-2.5 text-sm font-medium text-[#007bff] transition hover:bg-[#e9f5ff] disabled:opacity-60"
              >
                {seeding ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Database size={16} />
                )}
                Buat Data Awal
              </button>
            ) : null}
            <p className="inline-flex items-center gap-2 text-sm text-[#6c757d]">
              <CheckCircle2 size={15} className="text-[#28a745]" />
              {status}
            </p>
          </div>
        </form>
      </section>
      {status ? <AdminToast message={status} /> : null}
    </main>
  );
}
