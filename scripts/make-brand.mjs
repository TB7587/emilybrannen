// Turns the logo artwork (black on white) into the site's brand assets.
// Run: node scripts/make-brand.mjs   (source: scripts/logo-source.webp)
import sharp from "sharp";

const SRC = "scripts/logo-source.webp";
const INK = { r: 42, g: 38, b: 35 }; // matches --color-ink
const CREAM = "#faf7f2";

// White background -> transparent, so the logo sits on any warm background.
async function inkOnTransparent(region) {
  let img = sharp(SRC);
  if (region) img = img.extract(region);
  const { data, info } = await img.greyscale().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i++) {
    out[i * 4] = INK.r; out[i * 4 + 1] = INK.g; out[i * 4 + 2] = INK.b;
    // Darker pixel = more opaque; near-white paper (>= 235) becomes fully clear.
    out[i * 4 + 3] = Math.round(Math.max(0, Math.min(1, (235 - data[i]) / 200)) * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

const meta = await sharp(SRC).metadata();
console.log("source", meta.width, meta.height);

// Full logo (farm scene + wordmark + heart rule)
await (await inkOnTransparent()).trim().png({ compressionLevel: 9, palette: true }).toFile("public/brand/logo.png");
// Wordmark only, for the header
await (await inkOnTransparent({ left: 100, top: 545, width: 1350, height: 265 })).trim().png({ compressionLevel: 9, palette: true }).toFile("public/brand/wordmark.png");
// Round badge for the browser tab / home-screen icon: farm scene + heart rule inside a ring.
{
  const S = 512;
  const scene = await (await inkOnTransparent({ left: 290, top: 140, width: 1030, height: 418 })).trim().resize({ width: 372 }).png().toBuffer();
  const heart = await (await inkOnTransparent({ left: 590, top: 795, width: 350, height: 85 })).trim().resize({ width: 170 }).png().toBuffer();
  const sm = await sharp(scene).metadata();
  const ring = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${CREAM}"/><circle cx="${S / 2}" cy="${S / 2}" r="244" fill="#fff" stroke="rgb(${INK.r},${INK.g},${INK.b})" stroke-width="9"/></svg>`);
  const top = 142;
  await sharp(ring).composite([
    { input: scene, left: Math.round((S - 372) / 2), top },
    { input: heart, left: Math.round((S - 170) / 2), top: top + sm.height + 22 },
  ]).png({ palette: true }).toFile("app/icon.png");
  await sharp("app/icon.png").resize(180, 180).png().toFile("app/apple-icon.png");
}
// Link-preview image
const logoForOg = await sharp("public/brand/logo.png").resize({ height: 500 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: CREAM } }).composite([{ input: logoForOg }]).jpeg({ quality: 85 }).toFile("public/images/og.jpg");

for (const f of ["public/brand/logo.png", "public/brand/wordmark.png"]) {
  const m = await sharp(f).metadata();
  console.log(f, m.width, m.height);
}
