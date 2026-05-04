"use client";

import {
  CheckCircle2,
  Database,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AdminToast } from "@/components/admin/admin-toast";
import { readJsonResponse } from "@/lib/client-api";

type SectionData = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  error?: string;
};

type SectionEditorProps = {
  title: string;
  endpoint: string;
};

const emptySection: SectionData = {
  eyebrow: "",
  title: "",
  description: "",
};

export function SectionEditor({ title, endpoint }: SectionEditorProps) {
  const [data, setData] = useState<SectionData>(emptySection);
  const [initialData, setInitialData] = useState<SectionData>(emptySection);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [status, setStatus] = useState("Mengambil heading section...");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const value = await readJsonResponse<SectionData>(response);
      console.log("data fetched after refresh", value);

      if (!response.ok || value.error) {
        setStatus(value.error || "Gagal mengambil heading section.");
        return;
      }

      const nextData = {
        id: value.id,
        eyebrow: value.eyebrow || "",
        title: value.title || "",
        description: value.description || "",
      };
      setData(nextData);
      setInitialData(nextData);
      setStatus(
        value.id
          ? "Heading section berhasil dimuat."
          : "Belum ada heading tersimpan. Data default ditampilkan.",
      );
    } catch {
      setStatus("Gagal mengambil heading section.");
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

  function setField(name: keyof SectionData, value: string) {
    setData((current) => ({ ...current, [name]: value }));
  }

  function cancelEdit() {
    setData(initialData);
    setStatus("Perubahan heading dibatalkan.");
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
    setStatus("Menyimpan heading section...");

    const payload: SectionData = {
      eyebrow: String(formData.get("eyebrow") || ""),
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
    };
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
      setStatus("Gagal menyimpan heading. Pastikan semua field terisi.");
      return;
    }

    const saved = await readJsonResponse<SectionData>(response);
    console.log("database result after update", saved);
    await loadData();
    setStatus("Heading section tersimpan dan siap tampil di halaman utama.");
  }

  return (
    <section className="admin-section-editor px-4 pt-[9.5rem] lg:px-4">
      <form
        action={submit}
        className="grid gap-4 rounded border border-[#d2d6de] bg-white p-4"
      >
        <div className="grid gap-3 border-b border-[#dee2e6] pb-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase text-[#007bff]">
              Section Heading
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#212529]">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6c757d]">
              Edit label kecil, judul, dan deskripsi yang tampil di halaman
              utama.
            </p>
          </div>
          {loading ? (
            <span className="inline-flex items-center gap-2 rounded border border-[#dee2e6] px-3 py-2 text-xs text-[#6c757d]">
              <Loader2 size={14} className="animate-spin" />
              Loading
            </span>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.45fr_1fr]">
          <label className="grid gap-2 text-sm font-medium text-[#212529]">
            Eyebrow
            <input
              name="eyebrow"
              value={data.eyebrow}
              onChange={(event) => setField("eyebrow", event.target.value)}
              className="rounded border border-[#ced4da] bg-white px-3 py-2 text-sm font-normal text-[#212529] outline-none transition"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#212529]">
            Judul Section
            <input
              name="title"
              value={data.title}
              onChange={(event) => setField("title", event.target.value)}
              className="rounded border border-[#ced4da] bg-white px-3 py-2 text-sm font-normal text-[#212529] outline-none transition"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-[#212529]">
          Deskripsi Section
          <textarea
            name="description"
            rows={3}
            value={data.description}
            onChange={(event) => setField("description", event.target.value)}
            className="rounded border border-[#ced4da] bg-white px-3 py-2 text-sm font-normal leading-6 text-[#212529] outline-none transition"
          />
        </label>

        <div className="flex flex-col gap-3 border-t border-[#dee2e6] pt-4 sm:flex-row sm:items-center">
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
            Simpan Heading
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
          <p className="inline-flex items-start gap-2 text-sm leading-6 text-[#6c757d]">
            <CheckCircle2
              size={15}
              className="mt-0.5 shrink-0 text-[#28a745]"
            />
            {status}
          </p>
        </div>
      </form>
      {status ? <AdminToast message={status} /> : null}
    </section>
  );
}
