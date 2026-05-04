import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_NO_STORE_HEADERS } from "@/lib/auth-cache";
import { ADMIN_COOKIE } from "@/lib/auth-constants";
import { verifySessionValueEdge } from "@/lib/auth-edge";

function applyNoStore(response: NextResponse) {
  Object.entries(ADMIN_NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  const isLogout = pathname === "/api/admin/logout";
  const isGoogleAuth = pathname.startsWith("/api/admin/google/");

  if (isLogin || isLogout || isGoogleAuth) {
    return applyNoStore(NextResponse.next());
  }

  if (isAdminPage || isAdminApi) {
    const hasSession = await verifySessionValueEdge(
      request.cookies.get(ADMIN_COOKIE)?.value,
    );

    if (hasSession) return applyNoStore(NextResponse.next());

    if (isAdminApi) {
      return applyNoStore(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return applyNoStore(NextResponse.redirect(loginUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
