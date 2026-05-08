import { ensureAdmin, handleApiError } from "@/lib/api";
import { jsonNoStore, revalidatePortfolioContent } from "@/lib/cache";
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
  return jsonNoStore(data);
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
    revalidatePortfolioContent();

    return jsonNoStore(saved);
  } catch (error) {
    return handleApiError(error);
  }
}
