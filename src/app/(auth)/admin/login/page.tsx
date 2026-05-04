import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-4">

      {/* Wrapper */}
      <section className="grid w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-10 text-white">
          <h1 className="text-3xl font-bold">WELCOME</h1>

          <p className="mt-4 text-sm leading-6 text-white/80">
            Akses dashboard admin untuk mengelola portfolio secara profesional,
            aman, dan terstruktur.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-10 text-slate-800">

          <h2 className="text-center text-2xl font-semibold">
            Login Portfolio CMS
          </h2>

          <p className="mt-3 text-center text-sm text-slate-500">
            Masuk menggunakan akun Google admin
          </p>

          <div className="mt-8">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Hanya email yang terdaftar yang dapat mengakses dashboard.
          </p>

        </div>
      </section>
    </main>
  );
}