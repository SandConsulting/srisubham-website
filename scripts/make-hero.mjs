import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const dir = path.join(process.cwd(), 'public', 'images');
const files = [
  'perai-shop.jpg',
  'penang-shop.jpg',
  'nibong-tebal.jpeg',
  'padang-serai-shop.jpg',
  'warehouse.jpg',
].map((name) => path.join(dir, name));

const fps = 24;
const seconds = 3.2;
const frames = Math.round(fps * seconds);
const fade = 0.45;
const filters = [];
files.forEach((_, index) => {
  filters.push(
    `[${index}:v]scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,zoompan=z='min(1+0.0014*on,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1280x720:fps=${fps},format=yuv420p[v${index}]`,
  );
});
let current = 'v0';
for (let index = 1; index < files.length; index++) {
  const offset = (index * (seconds - fade)).toFixed(2);
  const next = index === files.length - 1 ? 'out' : `x${index}`;
  filters.push(`[${current}][v${index}]xfade=transition=fade:duration=${fade}:offset=${offset}[${next}]`);
  current = next;
}

const args = ['-y'];
for (const file of files) args.push('-loop', '1', '-framerate', '1', '-t', '1', '-i', file);
args.push(
  '-filter_complex',
  filters.join(';'),
  '-map',
  '[out]',
  '-an',
  '-c:v',
  'libx264',
  '-preset',
  'veryfast',
  '-crf',
  '28',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  path.join(process.cwd(), 'public', 'hero.mp4'),
);

const child = spawn(ffmpeg, args, { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 1));
