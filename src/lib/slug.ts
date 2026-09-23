export function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/&/g, ' and ')
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'item';
}

export function uniqueSlug(base: string, taken: (slug: string) => boolean) {
  let slug = base;
  let n = 2;
  while (taken(slug)) slug = `${base}-${n++}`;
  return slug;
}
