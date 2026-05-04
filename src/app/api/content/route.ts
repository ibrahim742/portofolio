import { NextResponse } from "next/server";

import { getPortfolioContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await getPortfolioContent();
  console.log("data fetched after refresh", data);
  return NextResponse.json(data);
}
