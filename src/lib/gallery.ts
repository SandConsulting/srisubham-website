import fs from 'node:fs';
import path from 'node:path';
import { galleryGroups } from './site';

export function imagesFor(folder: string) {
  const dir = path.join(process.cwd(), 'public', 'gallery', folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/gallery/${folder}/${file}`);
}

export function gallerySections() {
  return galleryGroups.map((group) => ({
    title: group.title,
    images: imagesFor(group.folder),
  }));
}
