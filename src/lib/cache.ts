import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export function markAsDynamic() {
  noStore();
}

export function withNoStore<T extends NextResponse>(response: T): T {
  Object.entries(NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export function jsonNoStore<T>(body: T, init?: ResponseInit) {
  return withNoStore(NextResponse.json(body, init));
}

export function revalidatePortfolioContent() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/api/content");
}
