export function parseImageList(value: string | readonly string[] | undefined) {
  const text =
    typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value.join("\n")
        : "";

  return text
    .split(/\n+|\|+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeImageList(images: readonly string[]) {
  return images.map((image) => image.trim()).filter(Boolean).join("\n");
}
