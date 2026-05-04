export type ApiErrorResponse = {
  error?: string;
};

export async function readJsonResponse<T extends ApiErrorResponse>(
  response: Response,
): Promise<T> {
  const fallbackMessage = response.ok
    ? "Response API kosong atau bukan JSON valid."
    : `Request gagal dengan status ${response.status}.`;
  const text = await response.text();

  if (!text.trim()) {
    return { error: fallbackMessage } as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: fallbackMessage } as T;
  }
}
