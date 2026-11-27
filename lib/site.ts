// Everything brand-specific lives here. Change it once, it updates everywhere.
export const site = {
  name: "Emily Brannen",
  tagline: "Projects, recipes and everyday life from our home to yours",
  headline: "Projects, recipes and the simple life at home.",
  authorName: "Emily Brannen",
  intro:
    "I'm so glad you're here! This is where I share the projects we're building, the recipes my family asks for again and again, and the little everyday things that make a house feel like home.",
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
  disclosure: "As an Amazon Associate I earn from qualifying purchases.",
} as const;
