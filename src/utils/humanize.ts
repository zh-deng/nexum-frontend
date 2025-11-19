export function humanizeEnumLabel(key: string) {
  if (!key) return "";
  return key
    .toLowerCase()
    .split("_")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
