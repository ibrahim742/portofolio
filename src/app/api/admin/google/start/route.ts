import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { ADMIN_NO_STORE_HEADERS } from "@/lib/auth-cache";
import {
  GOOGLE_OAUTH_NEXT_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
} from "@/lib/auth-constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getNextPath(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/admin";

  return next.startsWith("/admin") ? next : "/admin";
}

function withNoStore(response: NextResponse) {
  Object.entries(ADMIN_NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "google-config");
    return withNoStore(NextResponse.redirect(loginUrl));
  }

  const state = randomBytes(24).toString("base64url");
  const redirectUri = new URL(
    "/api/admin/google/callback",
    request.url,
  ).toString();
  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  googleUrl.searchParams.set("client_id", clientId);
  googleUrl.searchParams.set("redirect_uri", redirectUri);
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("state", state);
  googleUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(googleUrl);
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 10,
  };

  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, cookieOptions);
  response.cookies.set(
    GOOGLE_OAUTH_NEXT_COOKIE,
    getNextPath(request),
    cookieOptions,
  );

  return withNoStore(response);
}
