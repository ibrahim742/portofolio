"use client";

import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const error = searchParams.get("error");
  const googleLoginHref = `/api/admin/google/start?next=${encodeURIComponent(next)}`;

  function getErrorMessage() {
    if (error === "google-config") {
      return "Konfigurasi Google Login belum lengkap di .env.";
    }

    if (error === "google-denied") {
      return "Akun Google ini tidak terdaftar sebagai admin.";
    }

    if (error === "google-state" || error === "google-token") {
      return "Login Google gagal. Silakan coba lagi.";
    }

    return "";
  }

  const errorMessage = getErrorMessage();

  return (
    <div className="mx-auto w-full max-w-sm text-center">

      {/* BUTTON */}
      <a
        href={googleLoginHref}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-blue-600">
          G
        </span>
        Login dengan Google
      </a>

      {/* ERROR DI BAWAH */}
      {errorMessage && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      {/* INFO */}
      <p className="mt-6 text-sm leading-6 text-slate-600">
        Hanya akun Google yang email-nya terdaftar di konfigurasi admin yang bisa masuk.
      </p>

      <p className="mt-3 text-xs text-slate-500">
        Hanya email yang terdaftar yang dapat mengakses dashboard.
      </p>

    </div>
  );
}