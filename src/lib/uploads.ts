import fs from 'node:fs';
import path from 'node:path';

const types: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export function uploadsDir() {
  const dir = path.join(process.cwd(), 'data', 'uploads');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function saveImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = types[file.type];
  if (!ext) throw new Error('Use a JPG, PNG, WEBP, or GIF image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller.');
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  fs.writeFileSync(path.join(uploadsDir(), name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export function removeUpload(imagePath: string | null) {
  if (!imagePath?.startsWith('/uploads/')) return;
  const name = path.basename(imagePath);
  if (!/^[\w.-]+$/.test(name)) return;
  const full = path.join(uploadsDir(), name);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

export function readUpload(name: string) {
  if (!name || !/^[\w.-]+$/.test(name) || name.includes('..')) return null;
  const full = path.join(uploadsDir(), name);
  if (!fs.existsSync(full)) return null;
  return full;
}
