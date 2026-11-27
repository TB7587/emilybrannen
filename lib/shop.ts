import type { Product } from "./content";

// The Shop page. Add, remove or reorder products and categories here.
// TODO: replace the placeholder Amazon URLs with real affiliate links.
export const shopCategories: { name: string; blurb: string; products: Product[] }[] = [
  {
    name: "Everyday Cookware",
    blurb: "The pans that never leave my stovetop.",
    products: [
      { name: "12-inch Cast Iron Skillet", image: "/images/products/cast-iron-skillet.jpg", note: "Gets a golden sear on just about anything.", url: "https://www.amazon.com/dp/PLACEHOLDER01?tag=yourtag-20" },
      { name: "Enameled Dutch Oven", image: "/images/products/dutch-oven.jpg", note: "Soups, roasts and no-knead bread all winter.", url: "https://www.amazon.com/dp/PLACEHOLDER02?tag=yourtag-20" },
      { name: "Heavy Rimmed Sheet Pan", image: "/images/products/sheet-pan.jpg", note: "Doesn't warp, cleans up easy.", url: "https://www.amazon.com/dp/PLACEHOLDER03?tag=yourtag-20" },
    ],
  },
  {
    name: "Baking",
    blurb: "For banana bread Sundays.",
    products: [
      { name: "Nonstick Loaf Pan", image: "/images/products/loaf-pan.jpg", note: "Loaves slide right out, every time.", url: "https://www.amazon.com/dp/PLACEHOLDER04?tag=yourtag-20" },
      { name: "Nesting Mixing Bowls", image: "/images/products/mixing-bowls.jpg", note: "Grippy bottoms so they stay put.", url: "https://www.amazon.com/dp/PLACEHOLDER05?tag=yourtag-20" },
      { name: "Wire Cooling Rack", image: "/images/products/cooling-rack.jpg", note: "Fits inside my sheet pan too.", url: "https://www.amazon.com/dp/PLACEHOLDER06?tag=yourtag-20" },
    ],
  },
  {
    name: "Tools & Gadgets",
    blurb: "Small things that make cooking easier.",
    products: [
      { name: "Instant-Read Thermometer", image: "/images/products/meat-thermometer.jpg", note: "No more guessing if the chicken is done.", url: "https://www.amazon.com/dp/PLACEHOLDER07?tag=yourtag-20" },
      { name: "Wooden Spoon Set", image: "/images/products/wooden-spoon-set.jpg", note: "Gentle on my pans and they last for years.", url: "https://www.amazon.com/dp/PLACEHOLDER08?tag=yourtag-20" },
      { name: "8-inch Chef's Knife", image: "/images/products/chef-knife.jpg", note: "The one knife I reach for daily.", url: "https://www.amazon.com/dp/PLACEHOLDER09?tag=yourtag-20" },
      { name: "Handheld Citrus Juicer", image: "/images/products/citrus-juicer.jpg", note: "Every drop of juice, none of the seeds.", url: "https://www.amazon.com/dp/PLACEHOLDER10?tag=yourtag-20" },
    ],
  },
  {
    name: "Pantry & Storage",
    blurb: "Keeping leftovers (and me) organized.",
    products: [
      { name: "Glass Storage Containers", image: "/images/products/storage-containers.jpg", note: "Fridge to microwave to dishwasher.", url: "https://www.amazon.com/dp/PLACEHOLDER11?tag=yourtag-20" },
      { name: "No-Drip Honey Dispenser", image: "/images/products/honey-dispenser.jpg", note: "No sticky jar, no sticky counter.", url: "https://www.amazon.com/dp/PLACEHOLDER12?tag=yourtag-20" },
    ],
  },
];
