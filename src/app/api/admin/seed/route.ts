import { NextResponse } from "next/server";

import { ensureAdmin, handleApiError } from "@/lib/api";
import { seedDefaultPortfolioContent } from "@/lib/portfolio-seed";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const result = await seedDefaultPortfolioContent(prisma);
    console.log("database result after update", result);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return handleApiError(error);
  }
}
