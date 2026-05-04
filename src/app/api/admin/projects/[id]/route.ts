import { NextResponse } from "next/server";

import { ensureAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { projectSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const data = await prisma.project.findUnique({ where: { id } });
  console.log("data fetched after refresh", data);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const payload = await request.json();
    console.log("payload save", payload);
    const parsed = projectSchema.parse(payload);
    const slug = parsed.slug || createSlug(parsed.title);
    const saved = await prisma.project.update({
      where: { id },
      data: { ...parsed, slug },
    });
    console.log("database result after update", saved);

    return NextResponse.json(saved);
  } catch (error) {
    return handleApiError(error);
  }
}

export const PATCH = PUT;

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const deleted = await prisma.project.delete({ where: { id } });
  console.log("database result after update", deleted);
  return NextResponse.json({ ok: true });
}
