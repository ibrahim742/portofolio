function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "local-development-secret";
}

async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );

  return atob(padded);
}

export async function verifySessionValueEdge(value?: string) {
  if (!value) return false;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;

  const expected = await sign(encoded);
  if (signature.length !== expected.length || signature !== expected) {
    return false;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encoded)) as {
      expiresAt?: number;
    };

    return typeof payload.expiresAt === "number" && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

