import { prisma } from "@/lib/prisma";
import { markAsDynamic } from "@/lib/cache";

export type BrandingContentData = {
  headerImage: string;
  faviconImage: string;
};

export const defaultBrandingContent: BrandingContentData = {
  headerImage: "",
  faviconImage: "",
};

export async function getBrandingContent(): Promise<BrandingContentData> {
  markAsDynamic();

  try {
    const branding = await prisma.brandingContent.findUnique({
      where: { key: "main" },
    });

    return branding ?? defaultBrandingContent;
  } catch (error) {
    console.warn(
      "Using default branding content because database is unavailable.",
      error,
    );
    return defaultBrandingContent;
  }
}
