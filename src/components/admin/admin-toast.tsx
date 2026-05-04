"use client";

import { AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";

type ToastTone = "success" | "error" | "loading" | "info";

type AdminToastProps = {
  message: string;
};

function getTone(message: string): ToastTone {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("gagal") ||
    normalized.includes("error") ||
    normalized.includes("expired") ||
    normalized.includes("tidak valid")
  ) {
    return "error";
  }

  if (
    normalized.includes("mengambil") ||
    normalized.includes("menyimpan") ||
    normalized.includes("mengupload") ||
    normalized.includes("membuat") ||
    normalized.includes("menghapus") ||
    normalized.includes("mengupdate")
  ) {
    return "loading";
  }

  if (
    normalized.includes("berhasil") ||
    normalized.includes("tersimpan") ||
    normalized.includes("dimuat") ||
    normalized.includes("sukses")
  ) {
    return "success";
  }

  return "info";
}

const toneClass: Record<ToastTone, string> = {
  success: "admin-toast--success",
  error: "admin-toast--error",
  loading: "admin-toast--loading",
  info: "admin-toast--info",
};

const toneIcon = {
  success: CheckCircle2,
  error: AlertTriangle,
  loading: Loader2,
  info: Info,
};

export function AdminToast({ message }: AdminToastProps) {
  const tone = getTone(message);
  const Icon = toneIcon[tone];

  return (
    <div
      key={message}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={`admin-toast ${toneClass[tone]}`}
    >
      <span className="admin-toast__icon" aria-hidden="true">
        <Icon size={18} className={tone === "loading" ? "animate-spin" : ""} />
      </span>
      <span className="admin-toast__message">{message}</span>
    </div>
  );
}
