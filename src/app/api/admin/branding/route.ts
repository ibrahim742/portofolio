import { NextResponse } from "next/server";

import { ensureAdmin, handleApiError } from "@/lib/api";
import { defaultBrandingContent } from "@/lib/branding";
import { prisma } from "@/lib/prisma";
import { brandingSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  const data = await prisma.brandingContent.findUnique({
    where: { key: "main" },
  });
  console.log("data fetched after refresh", data);

  return NextResponse.json(data ?? defaultBrandingContent);
}

export async function PUT(request: Request) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    console.log("payload save", payload);
    const data = brandingSchema.parse(payload);
    const saved = await prisma.brandingContent.upsert({
      where: { key: "main" },
      create: { key: "main", ...data },
      update: data,
    });
    console.log("database result after update", saved);

    return NextResponse.json(saved);
  } catch (error) {
    return handleApiError(error);
  }
}

export const PATCH = PUT;
