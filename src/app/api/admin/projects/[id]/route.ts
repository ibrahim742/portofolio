import { ensureAdmin, handleApiError } from "@/lib/api";
import { jsonNoStore, revalidatePortfolioContent } from "@/lib/cache";
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
  if (!data) return jsonNoStore({ error: "Not found" }, { status: 404 });

  return jsonNoStore(data);
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
    revalidatePortfolioContent();

    return jsonNoStore(saved);
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
  revalidatePortfolioContent();
  return jsonNoStore({ ok: true, deleted });
}
