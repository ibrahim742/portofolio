import { defaultPortfolioContent } from "@/data/portfolio";
import { ensureAdmin, handleApiError } from "@/lib/api";
import { jsonNoStore, revalidatePortfolioContent } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { sectionSchema } from "@/lib/validations";

const sectionKeys = ["skills", "services", "projects", "workflow"] as const;

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SectionKey = (typeof sectionKeys)[number];

type RouteContext = {
  params: Promise<{ key: string }>;
};

function parseSectionKey(key: string): SectionKey | null {
  return sectionKeys.includes(key as SectionKey) ? (key as SectionKey) : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  const { key: rawKey } = await context.params;
  const key = parseSectionKey(rawKey);
  if (!key) return jsonNoStore({ error: "Not found" }, { status: 404 });

  const data = await prisma.sectionContent.findUnique({ where: { key } });
  return jsonNoStore(data ?? defaultPortfolioContent.sections[key]);
}

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { key: rawKey } = await context.params;
    const key = parseSectionKey(rawKey);
    if (!key) return jsonNoStore({ error: "Not found" }, { status: 404 });

    const payload = await request.json();
    console.log("payload save", payload);
    const data = sectionSchema.parse(payload);
    const saved = await prisma.sectionContent.upsert({
      where: { key },
      create: { key, ...data },
      update: data,
    });
    revalidatePortfolioContent();

    return jsonNoStore(saved);
  } catch (error) {
    return handleApiError(error);
  }
}

export const PATCH = PUT;
