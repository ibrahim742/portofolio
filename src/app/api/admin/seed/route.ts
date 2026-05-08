import { ensureAdmin, handleApiError } from "@/lib/api";
import { jsonNoStore, revalidatePortfolioContent } from "@/lib/cache";
import { seedDefaultPortfolioContent } from "@/lib/portfolio-seed";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const result = await seedDefaultPortfolioContent(prisma);
    revalidatePortfolioContent();

    return jsonNoStore({ ok: true, result });
  } catch (error) {
    return handleApiError(error);
  }
}
