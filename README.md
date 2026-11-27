# emilybrannen.com

Mobile-first recipe site. Next.js (App Router) + TypeScript + Tailwind. No database: every recipe is one MDX file.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Add a new recipe

1. Put the hero photo in `public/images/recipes/` (landscape 4:3, about 1600px wide; JPG is fine, the site resizes and converts it).
2. Copy any file in `content/recipes/` and rename it to match the new slug, e.g. `content/recipes/taco-soup.mdx`.
3. Fill in the top block (the "frontmatter"):

```mdx
---
title: Easy Taco Soup
slug: easy-taco-soup              # becomes /recipes/easy-taco-soup
date: 2026-12-01                  # newest date shows first on the home page
category: Dinner                  # a new category adds its own filter button
heroImage: /images/recipes/easy-taco-soup.jpg
prepTime: 10                      # minutes, number only
cookTime: 25                      # minutes, number only
servings: 6
keyword: easy taco soup           # the search phrase you want to rank for
description: One sentence for Google and link previews.   # optional, recommended
ingredients:
  - 1 lb ground beef
  - 1 packet taco seasoning
steps:
  - Brown the beef in a large pot.
  - Stir in everything else and simmer 20 minutes.
products:                         # 2 to 4 items for the "What I used" block
  - name: Enameled Dutch Oven
    image: /images/products/dutch-oven.jpg
    note: One short reason you love it.
    url: https://www.amazon.com/dp/XXXXXXXX?tag=yourtag-20   # affiliate link
  - name: Wooden Spoon Set
    image: /images/products/wooden-spoon-set.jpg
    note: Gentle on my pans.
    url: https://www.amazon.com/dp/XXXXXXXX?tag=yourtag-20
---

A sentence or two of intro goes here, under the dashes. **Bold** and links work.
```

4. Save, commit and push. Vercel rebuilds and the recipe is live. The home page grid, category filter, recipe page and Google recipe data (JSON-LD) are all generated from that one file.

Tips: if a line of text contains a colon, wrap it in quotes (`- "Tip: use salted butter"`). If a required field is missing the build fails with a message naming the file and field, so a broken page can't go live.

## Where things live

| To change | Edit |
| --- | --- |
| Site name, intro, social links, Amazon storefront, disclosure | `lib/site.ts` |
| Colors and fonts | top of `app/globals.css`, fonts in `app/layout.tsx` |
| Shop page products | `lib/shop.ts` |
| Photos | `public/images/` (replace a file, keep its name) |
| Logo, browser icon, share image | replace `scripts/logo-source.webp`, run `node scripts/make-brand.mjs` |
| Email provider hookup (TODO) | `app/api/subscribe/route.ts` |
| Click tracking | `lib/track.ts`, `app/api/track/route.ts` |

## Placeholders to replace before launch

- The Honey Butter Skillet Corn recipe text is a stand-in for the real corn recipe.
- All photos in `public/images/` (regenerate the placeholders with `node scripts/make-placeholders.mjs`).
- Every `amazon.com/dp/PLACEHOLDER…?tag=yourtag-20` URL, the storefront URL and the social links.

## Email signup

Both forms post to `/api/subscribe`, which validates the address and **only logs it** (`[subscribe] …`). Nothing is stored until a provider is connected; see the TODO in that file.

## Click tracking

When a visitor lands with UTM tags (e.g. `?utm_source=facebook&utm_medium=social&utm_campaign=corn`), they're remembered for the visit. Every outbound click (Amazon, storefront, social) is logged server-side as `[outbound_click] …` with the link, where it was clicked and those UTMs. View in the dev terminal or Vercel > Logs. Use `<OutboundLink>` for any new external link so it's tracked.

## Deploying

The repo is connected to Vercel: every push to `main` goes live at emilybrannen.com.
