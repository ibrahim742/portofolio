import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { CSSProperties } from "react";

import { contact } from "@/data/portfolio";
import type { ContactContentData } from "@/lib/content";

type ContactSectionProps = {
  content?: ContactContentData;
};

export function ContactSection({ content = contact }: ContactSectionProps) {
  const socialItems = content.socialLinks.map((item) => {
    const [label, href] = item.split("|").map((value) => value.trim());
    return {
      label: label || "Social",
      value: href || item,
      href: href || item,
      icon: MessageCircle,
    };
  });

  const contactItems = [
    {
      label: "WhatsApp",
      value: content.whatsappLabel,
      href: content.whatsappHref,
      icon: Phone,
    },
    {
      label: "Email",
      value: content.emailLabel,
      href: content.emailHref,
      icon: Mail,
    },
    {
      label: "Lokasi",
      value: content.location,
      href: content.mapHref,
      icon: MapPin,
    },
    ...socialItems,
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
          {content.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
          {content.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
          {content.description}
        </p>
        <a
          href={content.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
        >
          <MessageCircle size={17} />
          Hubungi Saya
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {contactItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="contact-card-enter group flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-200/[0.35] hover:bg-white/[0.055]"
              style={{
                "--contact-card-delay": `${index * 0.07}s`,
              } as CSSProperties}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-cyan-300/10 text-cyan-200">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </span>
                <span className="mt-1 block truncate text-sm font-medium text-ink">
                  {item.value}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
