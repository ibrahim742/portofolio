import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

import { ADMIN_COOKIE } from "@/lib/auth-constants";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "local-development-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionValue(username: string) {
  const payload = JSON.stringify({
    username,
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  });
  const encoded = Buffer.from(payload, "utf8").toString("base64url");

  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) return false;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;

  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      expiresAt?: number;
    };

    return typeof payload.expiresAt === "number" && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function isValidAdminLogin(username: string, password: string) {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}
