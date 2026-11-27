// Generates the placeholder photos in /public/images.
// Run: node scripts/make-placeholders.mjs
// Replace any generated file with a real photo of the same name and you're done.
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile } from "node:fs/promises";
import matter from "gray-matter";
import path from "node:path";

const out = path.join(process.cwd(), "public", "images");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function svg({ w, h, from, to, accent, label, sub = "placeholder photo" }) {
  const r = Math.min(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.5}" cy="${h * 0.46}" r="${r * 0.3}" fill="#fffaf2" opacity="0.92"/>
  <circle cx="${w * 0.5}" cy="${h * 0.46}" r="${r * 0.22}" fill="${accent}" opacity="0.9"/>
  <circle cx="${w * 0.44}" cy="${h * 0.41}" r="${r * 0.05}" fill="#fffaf2" opacity="0.35"/>
  <text x="50%" y="${h * 0.88}" text-anchor="middle" font-family="Georgia, serif" font-size="${r * 0.062}" fill="#3a2a20">${esc(label)}</text>
  <text x="50%" y="${h * 0.94}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${r * 0.034}" fill="#3a2a20" opacity="0.65" letter-spacing="2">${esc(sub.toUpperCase())}</text>
</svg>`;
}

const images = [
  ["author.jpg", { w: 800, h: 800, from: "#f2ede4", to: "#ddd4c6", accent: "#cdbfae", label: "Your photo here", sub: "800 x 800" }],
  // Products, square
  ...[
    ["cast-iron-skillet", "Cast Iron Skillet", "#4a4541"],
    ["wooden-spoon-set", "Wooden Spoons", "#b98a5e"],
    ["honey-dispenser", "Honey Dispenser", "#e0a030"],
    ["sheet-pan", "Sheet Pan", "#a9aeb0"],
    ["meat-thermometer", "Thermometer", "#c2552d"],
    ["citrus-juicer", "Citrus Juicer", "#e6c84a"],
    ["loaf-pan", "Loaf Pan", "#8c8f92"],
    ["mixing-bowls", "Mixing Bowls", "#7d9a78"],
    ["cooling-rack", "Cooling Rack", "#9aa0a4"],
    ["dutch-oven", "Dutch Oven", "#b8442a"],
    ["chef-knife", "Chef's Knife", "#6f7477"],
    ["storage-containers", "Glass Containers", "#8fb3b0"],
    ["cordless-drill", "Cordless Drill", "#6f7477"],
    ["speed-square", "Speed Square", "#a9a59c"],
    ["brad-nailer", "Brad Nailer", "#8a8f86"],
    ["level", "4 ft Level", "#b5a48c"],
  ].map(([file, label, accent]) => [
    `products/${file}.jpg`,
    { w: 800, h: 800, from: "#faf7f2", to: "#ece4d7", accent, label, sub: "product photo" },
  ]),
];

// A simple title card for every post that doesn't have its photo yet.
// Real photos are never overwritten: drop one in with the same file name and it's used.
function wrap(title, max = 20) {
  const lines = [""];
  for (const word of title.split(" ")) {
    if ((lines.at(-1) + " " + word).trim().length > max) lines.push(word);
    else lines[lines.length - 1] = (lines.at(-1) + " " + word).trim();
  }
  return lines;
}
function titleCard(title) {
  const lines = wrap(title);
  const size = lines.length > 3 ? 104 : 124;
  const startY = 600 - ((lines.length - 1) * size * 1.12) / 2;
  const text = lines.map((l, i) => `<text x="800" y="${startY + i * size * 1.12}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" fill="#2a2623">${esc(l)}</text>`).join("");
  const ruleY = startY + (lines.length - 1) * size * 1.12 + 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <rect width="1600" height="1200" fill="#f2ede4"/>
  <rect x="44" y="44" width="1512" height="1112" fill="none" stroke="#2a2623" stroke-opacity="0.45" stroke-width="2"/>
  <rect x="60" y="60" width="1480" height="1080" fill="none" stroke="#2a2623" stroke-opacity="0.2" stroke-width="2"/>
  ${text}
  <g stroke="#2a2623" stroke-opacity="0.6" stroke-width="2.5" fill="none">
    <line x1="560" y1="${ruleY}" x2="760" y2="${ruleY}"/><line x1="840" y1="${ruleY}" x2="1040" y2="${ruleY}"/>
    <path transform="translate(778 ${ruleY - 20}) scale(1.85)" d="M12 20.5S2.5 14.6 2.5 7.8A4.8 4.8 0 0112 5.6a4.8 4.8 0 019.5 2.2c0 6.800-9.500 12.700-9.500 12.700z"/>
  </g>
</svg>`;
}
for (const section of ["recipes", "projects", "lifestyle"]) {
  const dir = path.join(process.cwd(), "content", section);
  for (const file of (await readdir(dir)).filter((f) => f.endsWith(".mdx"))) {
    const { data } = matter(await readFile(path.join(dir, file), "utf8"));
    const dest = path.join(process.cwd(), "public", data.heroImage);
    if (existsSync(dest)) continue;
    await mkdir(path.dirname(dest), { recursive: true });
    await sharp(Buffer.from(titleCard(data.title))).jpeg({ quality: 84, mozjpeg: true }).toFile(dest);
    console.log("wrote title card", data.heroImage);
  }
}

for (const [file, opts] of images) {
  const dest = path.join(out, file);
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(Buffer.from(svg(opts))).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  console.log("wrote", file);
}
