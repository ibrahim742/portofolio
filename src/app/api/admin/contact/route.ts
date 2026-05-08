import { defaultPortfolioContent } from "@/data/portfolio";
import { ensureAdmin, handleApiError } from "@/lib/api";
import { jsonNoStore, revalidatePortfolioContent } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return unauthorized;

  try {
    const data = await prisma.contactContent.findUnique({
      where: { key: "main" },
    });
    return jsonNoStore(data ?? defaultPortfolioContent.contact);
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
    const data = contactSchema.parse(payload);
    const saved = await prisma.contactContent.upsert({
      where: { key: "main" },
      create: { key: "main", ...data },
      update: data,
    });
    revalidatePortfolioContent();

    return jsonNoStore(saved);
  } catch (error) {
    return handleApiError(error);
  }
}

export const PATCH = PUT;
