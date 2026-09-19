export function normaliseText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function normalisePlayerName(value: string): string {
  return normaliseText(value);
}

export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(normaliseText).filter(Boolean))];
}
