/**
 * Artnest BD — Task 1-a: AI image generation for the website.
 *
 * - Generates the 37 images defined in MANIFEST into public/images/** (products/, rooms/, themes/ subfolders).
 * - Idempotent: skips files that already exist and are larger than 20KB.
 * - Concurrency pool of 3 (max 3 generations in flight).
 * - Retries each failed image up to 3 attempts with a 2s backoff.
 * - Prints a summary table (filename -> OK/FAILED) at the end.
 * - Exits with code 1 if any images are still missing at the end.
 *
 * Run: cd /home/z/my-project && bun scripts/generate-images.mjs
 */
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

const MIN_BYTES = 20 * 1024; // 20KB
const CONCURRENCY = 3;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

const INTERIOR = 'warm neutral color palette, ivory beige sand and terracotta tones, soft natural window light, calm elegant atmosphere, editorial interior design photography, photorealistic, high quality, no people, no text, no watermark';
const PRODUCT = 'single product centered on a seamless warm ivory studio background, soft diffused lighting, subtle soft shadow, premium e-commerce product photography, photorealistic, high quality, no props, no text, no watermark';

const MANIFEST = [
  // ROOT
  { dir: '', file: 'hero.png', size: '1440x720', prompt: 'modern warm living room interior, beige linen sofa with textured cushions, terracotta ceramic vases with dried pampas grass on a wooden coffee table, framed abstract line art on the wall, soft golden window light, editorial interior design photography, photorealistic, high quality, no people, no text, no watermark' },
  { dir: '', file: 'cat-wall-decor.png', size: '1024x1024', prompt: 'styled interior wall with a small gallery of framed abstract art and a round wooden mirror above a slim wooden console table, ' + INTERIOR },
  { dir: '', file: 'cat-table-decor.png', size: '1024x1024', prompt: 'wooden coffee table styled with ceramic showpieces, a decorative tray, brass candle holders and a small stack of books, ' + INTERIOR },
  { dir: '', file: 'cat-vases-plants.png', size: '1024x1024', prompt: 'wooden shelf styled with ceramic vases holding dried pampas grass, small potted plants and a woven basket, ' + INTERIOR },
  { dir: '', file: 'cat-living-room.png', size: '1024x1024', prompt: 'warm neutral living room corner with a beige sofa, textured cushions, a tall floor plant and sheer curtains, ' + INTERIOR },
  { dir: '', file: 'cat-bedroom.png', size: '1024x1024', prompt: 'serene bedroom corner with neutral linen bedding, a wooden bedside table with a warm glowing lamp and a small vase, ' + INTERIOR },
  { dir: '', file: 'cat-desk-workspace.png', size: '1024x1024', prompt: 'minimal home workspace with a wooden desk, ceramic pen holder, small potted plant and one framed line art print, ' + INTERIOR },
  { dir: '', file: 'cat-lifestyle.png', size: '1024x1024', prompt: 'cozy home shelf vignette with lit candles, woven baskets, ceramic objects and warm evening light, ' + INTERIOR },
  { dir: '', file: 'banner-details.png', size: '1440x720', prompt: 'close-up of a styled wooden console table vignette with a ceramic vase of dried flowers, brass candle holders and a framed photo, shallow depth of field, ' + INTERIOR },
  { dir: '', file: 'banner-refresh.png', size: '1440x720', prompt: 'bright airy living room corner refreshed with lush green plants, terracotta vases and light neutral furniture, ' + INTERIOR },
  { dir: '', file: 'corner-before.png', size: '1152x864', prompt: 'empty plain corner of a room with warm beige walls and light wooden flooring, the corner is completely empty and bare, minimal, ' + INTERIOR },
  { dir: '', file: 'corner-after.png', size: '1152x864', prompt: 'the same warm beige room corner now beautifully styled with a small wooden side table, a terracotta ceramic vase with pampas grass, a potted plant, framed wall art above and warm light, ' + INTERIOR },
  // products/
  { dir: 'products', file: 'prod-01.png', size: '1024x1024', prompt: 'set of three framed abstract line art prints in thin natural wood frames, one-line face and botanical drawings on cream paper, standing in a row, ' + PRODUCT },
  { dir: 'products', file: 'prod-02.png', size: '1024x1024', prompt: 'boho macrame wall hanging made of handwoven cream cotton cords on a wooden dowel, ' + PRODUCT },
  { dir: 'products', file: 'prod-03.png', size: '1024x1024', prompt: 'round wall mirror with a natural oak wooden frame, reflecting a soft warm neutral room, ' + PRODUCT },
  { dir: 'products', file: 'prod-04.png', size: '1024x1024', prompt: 'abstract ceramic sculpture showpiece with a matte off-white glaze and organic curved geometric form, ' + PRODUCT },
  { dir: 'products', file: 'prod-05.png', size: '1024x1024', prompt: 'pair of antique brass candlestick holders with white taper candles, ' + PRODUCT },
  { dir: 'products', file: 'prod-06.png', size: '1024x1024', prompt: 'round walnut wooden decorative serving tray with carved handles, ' + PRODUCT },
  { dir: 'products', file: 'prod-07.png', size: '1024x1024', prompt: 'terracotta ceramic vase with a matte clay finish, rounded belly and narrow neck, ' + PRODUCT },
  { dir: 'products', file: 'prod-08.png', size: '1024x1024', prompt: 'clear ribbed glass vase with vertical fluted texture, ' + PRODUCT },
  { dir: 'products', file: 'prod-09.png', size: '1024x1024', prompt: 'lush artificial monstera plant in a matte beige ceramic pot, ' + PRODUCT },
  { dir: 'products', file: 'prod-10.png', size: '1024x1024', prompt: 'dried pampas grass arrangement in a round beige ceramic vase, fluffy cream plumes, ' + PRODUCT },
  { dir: 'products', file: 'prod-11.png', size: '1024x1024', prompt: 'two square textured cushion covers propped side by side, one beige boucle and one terracotta linen fabric, ' + PRODUCT },
  { dir: 'products', file: 'prod-12.png', size: '1024x1024', prompt: 'woven seagrass storage basket with sturdy handles and natural jute texture, ' + PRODUCT },
  { dir: 'products', file: 'prod-13.png', size: '1024x1024', prompt: 'table lamp with a warm linen drum shade and a turned wooden base, softly glowing, ' + PRODUCT },
  { dir: 'products', file: 'prod-14.png', size: '1024x1024', prompt: 'scented candle in a ribbed cream ceramic jar with a wooden lid, lit flame, ' + PRODUCT },
  { dir: 'products', file: 'prod-15.png', size: '1024x1024', prompt: 'wooden desk organizer with multiple compartments holding pens and a small notebook, ' + PRODUCT },
  { dir: 'products', file: 'prod-16.png', size: '1024x1024', prompt: 'small cylindrical ceramic pen holder cup with a speckled beige glaze, holding two pencils, ' + PRODUCT },
  { dir: 'products', file: 'prod-17.png', size: '1024x1024', prompt: 'set of five wooden photo frames in different sizes, some leaning and some stacked, natural wood tones, ' + PRODUCT },
  { dir: 'products', file: 'prod-18.png', size: '1024x1024', prompt: 'set of four round ceramic coasters with a small holder stand, speckled beige glaze, ' + PRODUCT },
  // rooms/
  { dir: 'rooms', file: 'room-dining.png', size: '1152x864', prompt: 'elegant dining area with a wooden table styled with ceramic tableware, a centerpiece vase and a rattan pendant light, ' + INTERIOR },
  { dir: 'rooms', file: 'room-entryway.png', size: '1152x864', prompt: 'welcoming home entryway with a round mirror, a wooden console table, a vase and a woven basket, ' + INTERIOR },
  { dir: 'rooms', file: 'room-balcony.png', size: '1152x864', prompt: 'cozy small balcony with two rattan chairs, potted plants, lanterns and warm string lights, ' + INTERIOR },
  // themes/
  { dir: 'themes', file: 'theme-minimal.png', size: '864x1152', prompt: 'ultra minimal interior styling, a single ceramic vase on a clean wooden console table with lots of negative space, ' + INTERIOR },
  { dir: 'themes', file: 'theme-cozy.png', size: '864x1152', prompt: 'cozy warm interior styling with knitted throws, lit candles and soft amber evening lighting, ' + INTERIOR },
  { dir: 'themes', file: 'theme-natural.png', size: '864x1152', prompt: 'natural interior styling with rattan furniture, a jute rug, potted plants and raw wood textures, ' + INTERIOR },
  { dir: 'themes', file: 'theme-elegant.png', size: '864x1152', prompt: 'elegant refined interior styling with a marble surface, brass candlesticks and a glass vase, ' + INTERIOR },
];

const key = (e) => (e.dir ? e.dir + '/' : '') + e.file;
const targetPath = (e) => path.join(IMAGES_DIR, e.dir, e.file);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The generation API requires width/height to be multiples of 32 within 512-2880px
// and <= 2^22 total pixels. '1440x720' violates the multiple-of-32 rule (720/32=22.5),
// so we map it to the closest valid 2:1 ratio size. All other manifest sizes are valid.
function normalizeSize(size) {
  if (size === '1440x720') return '1472x736'; // exact 2:1, 1472=32*46, 736=32*23
  return size;
}

function isDone(e) {
  try {
    const st = fs.statSync(targetPath(e));
    return st.isFile() && st.size > MIN_BYTES;
  } catch {
    return false;
  }
}

async function createZAI() {
  let lastErr;
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    try {
      return await ZAI.create();
    } catch (err) {
      lastErr = err;
      console.error(`ZAI.create() attempt ${i}/${MAX_ATTEMPTS} failed: ${err.message}`);
      if (i < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  throw lastErr;
}

async function generateOne(zai, entry) {
  const outPath = targetPath(entry);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const size = normalizeSize(entry.size);
      const res = await zai.images.generations.create({ prompt: entry.prompt, size });
      const b64 = res?.data?.[0]?.base64;
      if (!b64) throw new Error('no base64 payload in API response');
      const buf = Buffer.from(b64, 'base64');
      if (buf.length <= MIN_BYTES) throw new Error(`output suspiciously small (${buf.length} bytes)`);
      // write to tmp then rename => no partial files on interruption
      const tmp = outPath + '.tmp';
      fs.writeFileSync(tmp, buf);
      fs.renameSync(tmp, outPath);
      return { entry, ok: true, bytes: buf.length, attempts: attempt };
    } catch (err) {
      lastErr = err;
      console.error(`   [attempt ${attempt}/${MAX_ATTEMPTS}] ${key(entry)}: ${err.message}`);
      if (attempt < MAX_ATTEMPTS) {
        // rate-limited requests get a longer, gentler backoff than the 2s base
        const is429 = String(err?.message || '').includes('429');
        await sleep(is429 ? Math.max(RETRY_DELAY_MS, 10000) : RETRY_DELAY_MS);
      }
    }
  }
  return { entry, ok: false, error: lastErr?.message ?? 'unknown error' };
}

async function main() {
  console.log(`Artnest BD image generation — ${MANIFEST.length} manifest entries`);
  console.log(`Output dir: ${IMAGES_DIR}`);

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  for (const sub of ['products', 'rooms', 'themes']) {
    fs.mkdirSync(path.join(IMAGES_DIR, sub), { recursive: true });
  }

  const already = MANIFEST.filter(isDone);
  const pending = MANIFEST.filter((e) => !isDone(e));
  if (already.length) console.log(`Skipping ${already.length} already-generated image(s) (>20KB).`);
  if (!pending.length) {
    console.log('Nothing to generate — all manifest images already exist.');
  } else {
    console.log(`Generating ${pending.length} image(s) with concurrency ${CONCURRENCY}, up to ${MAX_ATTEMPTS} attempts each...`);
    const zai = await createZAI();

    const queue = [...pending];
    const results = [];
    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      while (queue.length) {
        const entry = queue.shift();
        if (!entry) break;
        console.log(`→ ${key(entry)} (${entry.size})`);
        const res = await generateOne(zai, entry);
        console.log(res.ok ? `✓ ${key(entry)} — ${(res.bytes / 1024).toFixed(0)} KB` : `✗ ${key(entry)}`);
        results.push(res);
      }
    });
    await Promise.all(workers);
  }

  // ---- Summary table ----
  console.log('\n================ SUMMARY ================');
  let okCount = 0;
  const missing = [];
  for (const e of MANIFEST) {
    const done = isDone(e);
    if (done) okCount++;
    else missing.push(key(e));
    console.log(`${done ? 'OK' : 'FAILED'}  ${key(e)}`);
  }
  console.log('=========================================');
  console.log(`Total: ${okCount}/${MANIFEST.length} images OK`);

  if (missing.length) {
    console.log(`Missing (${missing.length}): ${missing.join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log('All images generated successfully.');
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
