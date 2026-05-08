import { jsonNoStore } from "@/lib/cache";
import { getPortfolioContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const data = await getPortfolioContent();
  return jsonNoStore(data);
}
