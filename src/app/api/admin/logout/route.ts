import { NextResponse } from "next/server";

import { ADMIN_NO_STORE_HEADERS } from "@/lib/auth-cache";
import { ADMIN_COOKIE } from "@/lib/auth-constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function withNoStore(response: NextResponse) {
  Object.entries(ADMIN_NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    maxAge: 0,
  });

  response.cookies.delete(ADMIN_COOKIE);

  return withNoStore(response);
}
