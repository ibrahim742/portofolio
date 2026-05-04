import { NextResponse } from "next/server";

import { ADMIN_NO_STORE_HEADERS } from "@/lib/auth-cache";
import { ADMIN_COOKIE } from "@/lib/auth-constants";
import { createSessionValue, isValidAdminLogin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function withNoStore(response: NextResponse) {
  Object.entries(ADMIN_NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function POST(request: Request) {
  if (process.env.ENABLE_PASSWORD_LOGIN !== "true") {
    return withNoStore(
      NextResponse.json(
        { error: "Password login dinonaktifkan. Gunakan Google Login." },
        { status: 410 },
      ),
    );
  }

  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (
    !body.username ||
    !body.password ||
    !isValidAdminLogin(body.username, body.password)
  ) {
    return withNoStore(
      NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 },
      ),
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionValue(body.username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return withNoStore(response);
}
