export interface TaxonomyEntry {
  slug: string;
  label: string;
  aliases: string[];
}

export function slugifyTaxonomy(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function buildTaxonomy(values: string[]): TaxonomyEntry[] {
  const bySlug = new Map<string, TaxonomyEntry>();

  values.forEach((raw) => {
    const label = raw.trim();
    const slug = slugifyTaxonomy(label);
    if (!label || !slug) return;

    const existing = bySlug.get(slug);
    if (!existing) {
      bySlug.set(slug, { slug, label, aliases: [label] });
      return;
    }

    if (!existing.aliases.includes(label)) {
      existing.aliases.push(label);
    }
  });

  return Array.from(bySlug.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export function findTaxonomyEntry(entries: TaxonomyEntry[], value: string): TaxonomyEntry | undefined {
  const candidate = value.trim();
  const candidateSlug = slugifyTaxonomy(candidate);
  return entries.find((entry) => entry.slug === candidateSlug);
}
