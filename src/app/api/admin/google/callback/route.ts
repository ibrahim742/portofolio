import { NextResponse } from "next/server";

import { ADMIN_NO_STORE_HEADERS } from "@/lib/auth-cache";
import {
  ADMIN_COOKIE,
  GOOGLE_OAUTH_NEXT_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
} from "@/lib/auth-constants";
import { createSessionValue } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type GoogleTokenResponse = {
  id_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleTokenInfo = {
  aud?: string;
  email?: string;
  email_verified?: string | boolean;
  exp?: string;
  iss?: string;
};

function getAllowedEmails() {
  const emails = [
    process.env.ADMIN_GOOGLE_EMAIL,
    process.env.ADMIN_GOOGLE_EMAILS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return new Set(emails);
}

function redirectToLogin(request: Request, error: string) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("error", error);
  return withNoStore(NextResponse.redirect(loginUrl));
}

function withNoStore(response: NextResponse) {
  Object.entries(ADMIN_NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieHeader = request.headers.get("cookie") || "";
  const stateCookie = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${GOOGLE_OAUTH_STATE_COOKIE}=`))
    ?.split("=")[1];
  const nextCookie = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${GOOGLE_OAUTH_NEXT_COOKIE}=`))
    ?.split("=")[1];

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return redirectToLogin(request, "google-state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const allowedEmails = getAllowedEmails();

  if (!clientId || !clientSecret || allowedEmails.size === 0) {
    return redirectToLogin(request, "google-config");
  }

  const redirectUri = new URL(
    "/api/admin/google/callback",
    request.url,
  ).toString();
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  const token = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenResponse.ok || !token.id_token) {
    return redirectToLogin(request, "google-token");
  }

  const tokenInfoResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token.id_token)}`,
  );
  const tokenInfo = (await tokenInfoResponse.json()) as GoogleTokenInfo;
  const email = tokenInfo.email?.toLowerCase();
  const emailVerified =
    tokenInfo.email_verified === true || tokenInfo.email_verified === "true";
  const expiresAt = Number(tokenInfo.exp || 0) * 1000;

  if (
    !tokenInfoResponse.ok ||
    tokenInfo.aud !== clientId ||
    !email ||
    !emailVerified ||
    expiresAt <= Date.now() ||
    !allowedEmails.has(email)
  ) {
    return redirectToLogin(request, "google-denied");
  }

  const nextPath = nextCookie ? decodeURIComponent(nextCookie) : "/admin";
  const response = NextResponse.redirect(
    new URL(nextPath.startsWith("/admin") ? nextPath : "/admin", request.url),
  );

  response.cookies.set(ADMIN_COOKIE, createSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
  response.cookies.delete(GOOGLE_OAUTH_NEXT_COOKIE);

  return withNoStore(response);
}
