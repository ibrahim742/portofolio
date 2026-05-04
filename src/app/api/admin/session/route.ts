import { NextResponse } from "next/server";

import { ADMIN_NO_STORE_HEADERS } from "@/lib/auth-cache";
import { ensureAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function withNoStore(response: NextResponse) {
  Object.entries(ADMIN_NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function GET() {
  const unauthorized = await ensureAdmin();
  if (unauthorized) return withNoStore(unauthorized);

  return withNoStore(NextResponse.json({ ok: true }));
}

