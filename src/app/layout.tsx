import type { Metadata } from "next";

import { getBrandingContent } from "@/lib/branding";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ibrahim Setiawan | AI Web Developer",
  description:
    "Portfolio personal Ibrahim Setiawan, AI Web Developer, Networking Engineer, dan Cyber Security Enthusiast.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getBrandingContent();

  return (
    <html lang="id">
      <head>
        {branding.faviconImage ? (
          <link rel="icon" href={branding.faviconImage} />
        ) : null}
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
