import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { jsonNoStore } from "@/lib/cache";

export async function ensureAdmin() {
  if (await requireAdminSession()) return null;
  return jsonNoStore({ error: "Unauthorized" }, { status: 401 });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonNoStore(
      { error: "Validation failed", issues: error.issues },
      { status: 422 },
    );
  }

  if (error instanceof SyntaxError) {
    return jsonNoStore({ error: "Invalid JSON body" }, { status: 400 });
  }

  console.error(error);
  return jsonNoStore({ error: "Internal server error" }, { status: 500 });
}
