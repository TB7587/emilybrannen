// Generates the placeholder photos in /public/images.
// Run: node scripts/make-placeholders.mjs
// Replace any generated file with a real photo of the same name and you're done.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
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
  // Recipe heroes, 4:3
  ["recipes/honey-butter-skillet-corn.jpg", { w: 1600, h: 1200, from: "#f2ede4", to: "#e2d5bf", accent: "#d9b56a", label: "Honey Butter Skillet Corn" }],
  ["recipes/lemon-garlic-chicken-potatoes.jpg", { w: 1600, h: 1200, from: "#f2ede4", to: "#dccbb6", accent: "#b9825a", label: "Lemon Garlic Chicken & Potatoes" }],
  ["recipes/brown-sugar-banana-bread.jpg", { w: 1600, h: 1200, from: "#f2ede4", to: "#d6c4ad", accent: "#8f6a4a", label: "Brown Sugar Banana Bread" }],
  // Portrait
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
  ].map(([file, label, accent]) => [
    `products/${file}.jpg`,
    { w: 800, h: 800, from: "#faf7f2", to: "#ece4d7", accent, label, sub: "product photo" },
  ]),
];

for (const [file, opts] of images) {
  const dest = path.join(out, file);
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(Buffer.from(svg(opts))).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  console.log("wrote", file);
}
