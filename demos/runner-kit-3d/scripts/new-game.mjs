#!/usr/bin/env node
/**
 * Scaffold game mới từ template điều khiển.
 *
 *   npm run new-game mygame
 *   npm run new-game mygame -- --template wing
 *   npm run new-game mygame -- --template moto --title "NEON DASH"
 *
 * Templates:
 *   ski       — lái mượt (input.steer), camera đuổi
 *   moto      — đổi làn (onSteerTap), camera đuổi
 *   ski-side  — nhảy một nút (onAction), màn ngang
 *   wing      — vỗ cánh liên tục (Flappy), màn ngang
 *   loop      — nhảy + lái nhẹ, màn ngang đô thị
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const GAMES = join(ROOT, 'games');

const TEMPLATES = {
  ski: {
    label: 'lái mượt · camera đuổi',
    src: 'ski',
    accent: '#4fa8ff',
    accent2: '#aee9ff',
    bg: '#0e1d33',
  },
  moto: {
    label: 'đổi làn · camera đuổi',
    src: 'moto',
    accent: '#ff2d78',
    accent2: '#33e6ff',
    bg: '#0a0616',
  },
  'ski-side': {
    label: 'nhảy một nút · màn ngang',
    src: 'ski-side',
    accent: '#ff9e5e',
    accent2: '#ffd6a8',
    bg: '#2a1f4d',
  },
  wing: {
    label: 'vỗ cánh Flappy · màn ngang',
    src: 'wing',
    accent: '#5ce1ff',
    accent2: '#b44dff',
    bg: '#0a1630',
  },
  loop: {
    label: 'nhảy + lái · màn ngang',
    src: 'loop',
    accent: '#ff6b2d',
    accent2: '#ffe14a',
    bg: '#1a0c18',
  },
};

function parseArgs(argv) {
  const args = { name: null, template: 'ski-side', title: null };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--template' || a === '-t') args.template = rest[++i];
    else if (a === '--title') args.title = rest[++i];
    else if (a === '--list' || a === '-l') args.list = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (!a.startsWith('-') && !args.name) args.name = a;
  }
  return args;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function titleCase(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function replaceAll(str, map) {
  let out = str;
  for (const [k, v] of Object.entries(map)) {
    out = out.split(k).join(v);
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);

  if (args.help || args.list || !args.name) {
    console.log(`
RUNNER KIT 3D — scaffold game mới

  npm run new-game <tên> [--template <id>] [--title "TÊN HIỂN THỊ"]

Templates:`);
    for (const [id, t] of Object.entries(TEMPLATES)) {
      console.log(`  ${id.padEnd(12)} ${t.label}  (copy từ games/${t.src}/)`);
    }
    console.log(`
Ví dụ:
  npm run new-game skate
  npm run new-game hover -- --template wing --title "HOVER WING"
`);
    if (!args.name && !args.help && !args.list) process.exit(1);
    return;
  }

  const tpl = TEMPLATES[args.template];
  if (!tpl) {
    console.error(`Template không hợp lệ: ${args.template}`);
    console.error(`Chọn một trong: ${Object.keys(TEMPLATES).join(', ')}`);
    process.exit(1);
  }

  const slug = slugify(args.name);
  if (!slug) {
    console.error('Tên game không hợp lệ.');
    process.exit(1);
  }

  const dest = join(GAMES, slug);
  if (existsSync(dest)) {
    console.error(`Đã tồn tại: games/${slug}/ — đổi tên hoặc xoá thư mục cũ.`);
    process.exit(1);
  }

  const srcDir = join(GAMES, tpl.src);
  if (!existsSync(srcDir)) {
    console.error(`Thiếu template gốc: games/${tpl.src}/`);
    process.exit(1);
  }

  mkdirSync(dest, { recursive: true });
  cpSync(srcDir, dest, { recursive: true });

  const displayTitle = args.title || titleCase(slug).toUpperCase();
  const titleParts = displayTitle.replace(/\s+/g, ' ').trim().split(' ');
  const titleHtml =
    titleParts.length >= 2
      ? `${titleParts[0]}<span>${titleParts.slice(1).join('')}</span>`
      : `${displayTitle}<span>RUN</span>`;

  const storage = slug.replace(/-/g, '');
  const map = {
    // generic replacements — best-effort theo template
  };

  // rewrite HTML theme + titles
  const htmlPath = join(dest, 'index.html');
  let html = readFileSync(htmlPath, 'utf8');
  html = html.replace(/<title>.*?<\/title>/, `<title>${displayTitle} — Runner Kit 3D</title>`);
  html = html.replace(
    /--accent:\s*#[0-9a-fA-F]+;/,
    `--accent: ${tpl.accent};`
  );
  html = html.replace(
    /--accent2:\s*#[0-9a-fA-F]+;/,
    `--accent2: ${tpl.accent2};`
  );
  html = html.replace(
    /--bg:\s*#[0-9a-fA-F]+;/,
    `--bg: ${tpl.bg};`
  );
  // title block in menu
  html = html.replace(
    /<h1 class="title">[\s\S]*?<\/h1>/,
    `<h1 class="title">${titleHtml}</h1>`
  );
  html = html.replace(
    /placeholder="[^"]*"/g,
    `placeholder="tên người chơi"`
  );
  // fonts: Be Vietnam Pro + Outfit (đủ dấu Việt) — gỡ Climate Crisis cũ
  html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Climate\+Crisis[^"]*" rel="stylesheet" \/>\s*/g,
    ''
  );
  const FONT_HREF =
    'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700;800&family=Outfit:wght@300;400;500;700&display=swap';
  if (!html.includes('Be+Vietnam+Pro')) {
    html = html.replace(
      /(<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>)/,
      `$1\n  <link href="${FONT_HREF}" rel="stylesheet" />`
    );
  }
  if (!html.includes('kit/fonts.css')) {
    html = html.replace(
      /(<link rel="stylesheet" href="\.\.\/\.\.\/kit\/style\.css" \/>)/,
      '<link rel="stylesheet" href="../../kit/fonts.css" />\n  $1'
    );
  }
  writeFileSync(htmlPath, html, 'utf8');

  // rewrite storage keys in game.js so leaderboards không đụng nhau
  const jsPath = join(dest, 'game.js');
  let js = readFileSync(jsPath, 'utf8');
  js = js.replace(/storageKey:\s*'[^']+'/g, `storageKey: '${storage}-scores'`);
  js = js.replace(/nameKey:\s*'[^']+'/g, `nameKey: '${storage}-name'`);
  js = js.replace(/bestKey:\s*'[^']+'/g, `bestKey: '${storage}-best'`);
  // header comment
  js = `// ── ${displayTitle} — scaffold từ template "${args.template}" ──\n` +
    `// Chạy: mở games/${slug}/ sau npm run dev\n` +
    `// Sửa CONFIG · nhân vật · Spawner place() · hooks — xem docs/LEARN.md\n` +
    js.replace(/^\/\/[^\n]*\n(?:\/\/[^\n]*\n){0,8}/, '');
  writeFileSync(jsPath, js, 'utf8');

  // gợi ý gắn vào hub
  console.log(`
✓ Đã tạo games/${slug}/
  template : ${args.template} (${tpl.label})
  title    : ${displayTitle}
  keys     : ${storage}-scores / ${storage}-best

Bước tiếp:
  1. npm run dev
  2. Mở http://localhost:4180/games/${slug}/
  3. Sửa CONFIG, mesh nhân vật, place() chướng ngại trong game.js
  4. (Tuỳ chọn) thêm card vào index.html của hub

Đọc docs/LEARN.md để hiểu từng hook và pattern.
`);

  // list files
  for (const f of readdirSync(dest)) {
    console.log(`  · games/${slug}/${f}`);
  }
}

main();
