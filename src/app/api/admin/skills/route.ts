import { NextResponse } from "next/server";

import { ensureAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { skillSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  const data = await prisma.skillCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
  console.log("data fetched after refresh", data);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    console.log("payload save", payload);
    const parsed = skillSchema.parse(payload);
    const slug = parsed.slug || createSlug(parsed.title);
    const saved = await prisma.skillCategory.upsert({
      where: { slug },
      create: { ...parsed, slug },
      update: { ...parsed, slug },
    });
    console.log("database result after update", saved);

    return NextResponse.json(saved);
  } catch (error) {
    return handleApiError(error);
  }
}
