"use client";

import {
  CheckCircle2,
  Database,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AdminToast } from "@/components/admin/admin-toast";
import type { AdminField } from "@/components/admin/singleton-editor";
import { readJsonResponse } from "@/lib/client-api";

type FieldType = AdminField["type"] | "number" | "boolean" | "image";

type CollectionField = Omit<AdminField, "type"> & {
  type?: FieldType;
};

type RecordValue = string | number | boolean | string[] | undefined;
type AdminRecord = Record<string, RecordValue> & {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  sortOrder?: number;
  isPublished?: boolean;
};

type ApiErrorResponse = {
  error?: string;
  issues?: unknown;
};

type CollectionManagerProps = {
  title: string;
  description: string;
  endpoint: string;
  itemLabel: string;
  fields: CollectionField[];
  emptyItem: AdminRecord;
};

export function CollectionManager({
  title,
  description,
  endpoint,
  itemLabel,
  fields,
  emptyItem,
}: CollectionManagerProps) {
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [form, setForm] = useState<AdminRecord>(emptyItem);
  const [status, setStatus] = useState("Mengambil data...");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");

  const isEditing = Boolean(form.id);
  const currentTitle = String(form.title || "");
  const imageValue = typeof form.image === "string" ? form.image : "";

  const publishedCount = useMemo(
    () => items.filter((item) => item.isPublished).length,
    [items],
  );
  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) =>
      [item.title, item.slug, item.description]
        .map((value) => String(value || "").toLowerCase())
        .some((value) => value.includes(keyword)),
    );
  }, [items, search]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const data = (await response.json()) as AdminRecord[] | ApiErrorResponse;
      console.log("data fetched after refresh", data);

      if (!response.ok || !Array.isArray(data)) {
        const message = Array.isArray(data) ? "" : data.error;
        setItems([]);
        setStatus(
          response.status === 401
            ? "Session admin tidak valid atau sudah expired. Silakan login ulang."
            : message ||
                "Gagal mengambil data. Response API tidak sesuai format daftar.",
        );
        return;
      }

      setItems(data);
      setStatus(data.length ? "Data berhasil dimuat." : "Belum ada data.");
    } catch {
      setItems([]);
      setStatus("Gagal mengambil data. Periksa database atau session login.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    console.log("form state", form);
  }, [form]);

  function resetForm() {
    setForm(emptyItem);
    setStatus(`Mode tambah ${itemLabel} baru.`);
  }

  function editItem(item: AdminRecord) {
    setForm(item);
    setStatus(`Sedang mengedit: ${String(item.title || item.slug)}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setField(name: string, value: RecordValue) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadImage(file: File) {
    setStatus("Mengupload gambar...");
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
    const data = await readJsonResponse<{ path?: string; error?: string }>(
      response,
    );

    if (data.path) setField("image", data.path);
    setStatus(
      data.path
        ? "Gambar berhasil diupload dan path sudah masuk ke form."
        : data.error || "Upload gagal.",
    );
  }

  async function submit(formData: FormData) {
    setSaving(true);
    setStatus(isEditing ? "Mengupdate data..." : "Menyimpan data baru...");

    const payload = Object.fromEntries(
      fields.map((field) => {
        const value = String(formData.get(field.name) || "");

        if (field.type === "array") {
          return [
            field.name,
            value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          ];
        }

        if (field.type === "number") {
          return [field.name, Number(value || 0)];
        }

        if (field.type === "boolean") {
          return [field.name, formData.get(field.name) === "on"];
        }

        return [field.name, value];
      }),
    );
    console.log("payload save", payload);

    const target = form.id ? `${endpoint}/${form.id}` : endpoint;
    const method = form.id ? "PUT" : "POST";
    const response = await fetch(target, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    console.log("api response", response);

    setSaving(false);

    if (!response.ok) {
      setStatus(
        "Gagal menyimpan. Pastikan field wajib terisi dan slug tidak bentrok.",
      );
      return;
    }

    const saved = await readJsonResponse<AdminRecord & ApiErrorResponse>(
      response,
    );
    console.log("database result after update", saved);
    setForm(emptyItem);
    await loadItems();
    setStatus(
      isEditing
        ? "Data berhasil diupdate."
        : "Data berhasil ditambahkan. Jika slug sama, data lama otomatis direplace.",
    );
  }

  async function remove(item: AdminRecord) {
    if (!item.id) return;
    const name = String(item.title || item.slug || item.id);
    const confirmed = window.confirm(
      `Hapus ${name}? Data ini akan hilang dari database.`,
    );
    if (!confirmed) return;

    setStatus(`Menghapus ${name}...`);
    const response = await fetch(`${endpoint}/${item.id}`, {
      method: "DELETE",
      cache: "no-store",
    });
    setStatus(response.ok ? "Data berhasil dihapus." : "Gagal menghapus data.");
    if (response.ok) await loadItems();
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
    await loadItems();
  }

  function renderField(field: CollectionField) {
    const value = form[field.name];
    const textValue = Array.isArray(value)
      ? value.join("\n")
      : String(value ?? "");

    if (field.type === "boolean") {
      return (
        <label
          key={field.name}
          className="flex items-start gap-3 rounded-md border border-white/10 bg-slate-950/30 p-3 text-sm font-medium text-ink"
        >
          <input
            type="checkbox"
            name={field.name}
            checked={Boolean(value)}
            onChange={(event) => setField(field.name, event.target.checked)}
            className="mt-1"
          />
          <span>
            {field.label}
            <span className="block text-xs font-normal leading-5 text-muted">
              Matikan jika konten belum ingin tampil di halaman utama.
            </span>
          </span>
        </label>
      );
    }

    if (field.type === "image") {
      return (
        <div key={field.name} className="grid gap-3">
          <label
            className="grid gap-2 text-sm font-medium text-ink"
            htmlFor={field.name}
          >
            {field.label}
            <input
              id={field.name}
              name={field.name}
              value={textValue}
              onChange={(event) => setField(field.name, event.target.value)}
              placeholder={
                field.placeholder ||
                "/uploads/projects/file.png atau https://..."
              }
              className="rounded-md border border-white/10 bg-slate-950/35 px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-cyan-300/50"
            />
            <span className="text-xs font-normal leading-5 text-muted">
              Bisa isi URL gambar eksternal, path dari folder public, atau
              upload file lokal.
            </span>
          </label>
          <div className="grid gap-3 rounded-md border border-white/10 bg-slate-950/30 p-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-white/10 bg-white/[0.035]">
              {imageValue ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageValue}
                  alt={String(form.imageAlt || "Preview project")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted">
                  <ImageIcon size={28} />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadImage(file);
              }}
              className="text-xs text-muted"
            />
          </div>
        </div>
      );
    }

    return (
      <label
        key={field.name}
        className="grid gap-2 text-sm font-medium text-ink"
      >
        {field.label}
        {field.type === "textarea" || field.type === "array" ? (
          <textarea
            name={field.name}
            rows={field.type === "array" ? 4 : 5}
            value={textValue}
            placeholder={field.placeholder}
            onChange={(event) => setField(field.name, event.target.value)}
            className="rounded-md border border-white/10 bg-slate-950/35 px-3 py-2 text-sm font-normal leading-6 text-ink outline-none transition focus:border-cyan-300/50"
          />
        ) : (
          <input
            name={field.name}
            type={field.type === "number" ? "number" : "text"}
            value={textValue}
            placeholder={field.placeholder}
            onChange={(event) => setField(field.name, event.target.value)}
            className="rounded-md border border-white/10 bg-slate-950/35 px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-cyan-300/50"
          />
        )}
        <span className="text-xs font-normal leading-5 text-muted">
          {field.help ||
            (field.name === "slug"
              ? "Opsional. Kosongkan agar slug dibuat otomatis dari judul. Jika slug sudah ada, create akan mereplace data lama."
              : field.type === "array"
                ? "Tulis satu item per baris."
                : "Isi field ini sesuai konten yang akan tampil di website.")}
        </span>
      </label>
    );
  }

  return (
    <main>
      <section className="rounded border border-[#d2d6de] bg-white">
        <div className="grid gap-5 border-b border-[#dee2e6] p-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase text-[#007bff]">
              CRUD Content
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#212529]">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6c757d]">
              {description}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded border border-[#dee2e6] bg-[#f8f9fa] px-4 py-3">
              <p className="text-lg font-semibold text-[#212529]">
                {items.length}
              </p>
              <p className="text-xs text-[#6c757d]">Total</p>
            </div>
            <div className="rounded border border-[#dee2e6] bg-[#f8f9fa] px-4 py-3">
              <p className="text-lg font-semibold text-[#28a745]">
                {publishedCount}
              </p>
              <p className="text-xs text-[#6c757d]">Published</p>
            </div>
            <div className="rounded border border-[#dee2e6] bg-[#f8f9fa] px-4 py-3">
              <p className="text-lg font-semibold text-[#6c757d]">
                {items.length - publishedCount}
              </p>
              <p className="text-xs text-[#6c757d]">Draft</p>
            </div>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0">
            <div className="flex flex-col gap-3 border-b border-[#dee2e6] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#212529]">
                  Data yang sudah ada
                </h3>
                <p className="mt-1 text-sm text-[#6c757d]">
                  Klik Edit untuk mengubah data. Klik Delete untuk menghapus
                  data dari database.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded bg-[#007bff] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0069d9]"
                >
                  <Plus size={16} />
                  Tambah Data
                </button>
                <button
                  type="button"
                  onClick={() => void loadItems()}
                  className="inline-flex items-center justify-center gap-2 rounded bg-[#17a2b8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#138496]"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm text-[#212529]">
                  Show
                  <select className="rounded border border-[#ced4da] px-2 py-1 text-sm">
                    <option>{Math.max(filteredItems.length, 10)}</option>
                  </select>
                  entries
                </label>
                <label className="flex items-center gap-2 text-sm text-[#212529]">
                  Search:
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="rounded border border-[#ced4da] px-3 py-1.5 text-sm"
                  />
                </label>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 rounded border border-[#dee2e6] bg-[#f8f9fa] p-4 text-sm text-[#6c757d]">
                  <Loader2 size={16} className="animate-spin" />
                  Mengambil daftar data...
                </div>
              ) : null}

              {!loading && items.length === 0 ? (
                <div className="rounded border border-dashed border-[#ced4da] bg-[#f8f9fa] p-6 text-sm leading-7 text-[#6c757d]">
                  <p>
                    Belum ada data. Gunakan form di kanan untuk menambahkan{" "}
                    {itemLabel} pertama.
                  </p>
                  <button
                    type="button"
                    onClick={() => void seedDefaults()}
                    disabled={seeding}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded bg-[#007bff] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0069d9] disabled:opacity-60"
                  >
                    {seeding ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Database size={16} />
                    )}
                    Buat Data Awal
                  </button>
                </div>
              ) : null}

              {!loading && items.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] border border-[#dee2e6] text-left text-sm">
                      <thead className="bg-white text-[#212529]">
                        <tr>
                          <th className="border border-[#dee2e6] px-3 py-2 font-semibold">
                            Judul
                          </th>
                          <th className="border border-[#dee2e6] px-3 py-2 font-semibold">
                            Slug
                          </th>
                          <th className="border border-[#dee2e6] px-3 py-2 font-semibold">
                            Deskripsi
                          </th>
                          <th className="border border-[#dee2e6] px-3 py-2 font-semibold">
                            Urutan
                          </th>
                          <th className="border border-[#dee2e6] px-3 py-2 font-semibold">
                            Status
                          </th>
                          <th className="border border-[#dee2e6] px-3 py-2 font-semibold">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr
                            key={String(item.id)}
                            className="odd:bg-[#f2f2f2] even:bg-white"
                          >
                            <td className="border border-[#dee2e6] px-3 py-2 font-medium text-[#212529]">
                              {String(item.title || item.slug)}
                            </td>
                            <td className="break-all border border-[#dee2e6] px-3 py-2 text-[#212529]">
                              {String(item.slug || "-")}
                            </td>
                            <td className="max-w-sm border border-[#dee2e6] px-3 py-2 text-[#212529]">
                              <span className="line-clamp-2">
                                {String(item.description || "-")}
                              </span>
                            </td>
                            <td className="border border-[#dee2e6] px-3 py-2 text-[#212529]">
                              {String(item.sortOrder ?? 0)}
                            </td>
                            <td className="border border-[#dee2e6] px-3 py-2">
                              <span
                                className={
                                  item.isPublished
                                    ? "rounded bg-[#28a745] px-2 py-1 text-xs font-medium text-white"
                                    : "rounded bg-[#6c757d] px-2 py-1 text-xs font-medium text-white"
                                }
                              >
                                {item.isPublished ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="border border-[#dee2e6] px-3 py-2">
                              <div className="flex flex-nowrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => editItem(item)}
                                  aria-label={`Edit ${String(item.title || item.slug)}`}
                                  title="Edit"
                                  className="grid size-8 place-items-center rounded bg-[#ffc107] text-[#212529] transition hover:bg-[#e0a800]"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void remove(item)}
                                  aria-label={`Hapus ${String(item.title || item.slug)}`}
                                  title="Hapus"
                                  className="grid size-8 place-items-center rounded bg-[#dc3545] text-white transition hover:bg-[#c82333]"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-[#212529] sm:flex-row sm:items-center sm:justify-between">
                    <p>
                      Showing {filteredItems.length ? 1 : 0} to{" "}
                      {filteredItems.length} of {items.length} entries
                    </p>
                    <div className="flex items-center gap-1">
                      <button className="rounded border border-[#dee2e6] px-3 py-2 text-[#6c757d]">
                        Previous
                      </button>
                      <button className="rounded bg-[#007bff] px-3 py-2 text-white">
                        1
                      </button>
                      <button className="rounded border border-[#dee2e6] px-3 py-2 text-[#6c757d]">
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </section>

          <aside className="border-t border-[#dee2e6] lg:sticky lg:top-36 lg:self-start lg:border-l lg:border-t-0">
            <form action={submit} className="grid gap-4 bg-white p-4">
              <div className="border-b border-[#dee2e6] pb-4">
                <p className="text-xs font-semibold uppercase text-[#007bff]">
                  {isEditing ? "Edit Data" : "Tambah Data"}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#212529]">
                  {isEditing
                    ? currentTitle || `Edit ${itemLabel}`
                    : `Tambah ${itemLabel} baru`}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#6c757d]">
                  {isEditing
                    ? "Perubahan akan mengupdate data yang dipilih."
                    : "Data baru akan dibuat. Jika slug sama dengan data lama, sistem otomatis mereplace data tersebut."}
                </p>
              </div>

              {fields.map((field) => renderField(field))}

              <div className="grid gap-3 border-t border-[#dee2e6] pt-4">
                <div className="flex flex-wrap gap-2">
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
                    {isEditing ? "Update Data" : "Simpan Data Baru"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#6c757d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5a6268]"
                  >
                    <RotateCcw size={16} />
                    Batal
                  </button>
                </div>
                <p className="inline-flex items-start gap-2 text-sm leading-6 text-[#6c757d]">
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-[#28a745]"
                  />
                  {status}
                </p>
              </div>
            </form>
          </aside>
        </div>
      </section>
      {status ? <AdminToast message={status} /> : null}
    </main>
  );
}
