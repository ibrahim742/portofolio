import { NextResponse } from "next/server";

import { defaultPortfolioContent } from "@/data/portfolio";
import { ensureAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { heroSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const data = await prisma.heroContent.findUnique({
      where: { key: "main" },
    });
    console.log("data fetched after refresh", data);
    return NextResponse.json(data ?? defaultPortfolioContent.hero);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    console.log("payload save", payload);
    const data = heroSchema.parse(payload);
    const saved = await prisma.heroContent.upsert({
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
