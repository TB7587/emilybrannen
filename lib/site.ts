// Everything brand-specific lives here. Change it once, it updates everywhere.
export const site = {
  name: "Emily Brannen",
  tagline: "Easy family recipes from my kitchen to yours",
  authorName: "Emily Brannen",
  intro:
    "Hi, I'm so glad you're here! I share the simple, cozy recipes my own family asks for again and again. Nothing fussy, just good food you can get on the table tonight.",
  authorPhoto: "/images/author.jpg",
  // Used for canonical URLs, JSON-LD and share images.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://emilybrannen.com",
  // TODO: replace with her real profiles and storefront.
  social: {
    instagram: "https://www.instagram.com/yourhandle",
    facebook: "https://www.facebook.com/yourpage",
    tiktok: "https://www.tiktok.com/@yourhandle",
  },
  amazonStorefront: "https://www.amazon.com/shop/yourhandle",
  disclosure: "As an Amazon Associate I earn from qualifying purchases.",
} as const;
