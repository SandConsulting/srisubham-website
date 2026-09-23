import fs from 'node:fs';
import type { APIRoute } from 'astro';
import { readUpload } from '../../lib/uploads';

const types: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

export const GET: APIRoute = ({ params }) => {
  const file = readUpload(params.name ?? '');
  if (!file) return new Response('Not found', { status: 404 });
  const ext = file.split('.').pop()?.toLowerCase() ?? '';
  return new Response(fs.readFileSync(file), {
    headers: {
      'Content-Type': types[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
