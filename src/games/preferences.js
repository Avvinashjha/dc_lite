const key = "dc_arcade_favorites";
export function favorites(storage) {
  try {
    storage ||= localStorage;
    const values = JSON.parse(storage.getItem(key) || "[]");
    return new Set(
      Array.isArray(values) ? values.filter((v) => typeof v === "string") : [],
    );
  } catch {
    return new Set();
  }
}
export function toggleFavorite(slug, storage) {
  const values = favorites(storage);
  if (values.has(slug)) values.delete(slug);
  else values.add(slug);
  try {
    (storage || localStorage).setItem(key, JSON.stringify([...values]));
  } catch {}
  return values;
}
