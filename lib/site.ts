// Everything brand-specific lives here. Change it once, it updates everywhere.
export const site = {
  name: "Emily Brannen",
  tagline: "Holidays, recipes, crafts and toddler homeschool from Texas",
  headline: "Holidays, recipes, crafts and life at home in Texas.",
  authorName: "Emily Brannen",
  intro:
    "Holidays • Recipes • Crafts • Toddler Homeschool • DIY Enthusiast • Texas",
  authorPhoto: "/images/author.jpg",
  // Used for canonical URLs, JSON-LD and share images.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://emilybrannen.com",
  // TODO: replace with her real profiles and storefront.
  social: {
    instagram: "https://www.instagram.com/emily.brannen/",
    facebook: "https://www.facebook.com/yourpage",
    tiktok: "https://www.tiktok.com/@yourhandle",
  },
  amazonStorefront: "https://www.amazon.com/shop/yourhandle",
  // "Shop my kitchen" is switched off for now: no Shop link, button or page, and no Amazon
  // line in the footer. Set to true to bring it all back.
  shop: false,
  // The weekly email signup is switched off for now. Set to true to bring it back everywhere.
  newsletter: false,
  disclosure: "As an Amazon Associate I earn from qualifying purchases.",
} as const;
