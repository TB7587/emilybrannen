# emilybrannen.com

Mobile-first site for projects, recipes and lifestyle posts. Next.js (App Router) + TypeScript + Tailwind. No database: every post is one MDX file.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

The site has three kinds of posts. Each one is a single file in its folder:

| Section | Folder | Lives at |
| --- | --- | --- |
| Recipes | `content/recipes/` | `/recipes/your-slug` |
| Projects | `content/projects/` | `/projects/your-slug` |
| Lifestyle | `content/lifestyle/` | `/lifestyle/your-slug` |

To add any of them: put the photo in `public/images/<section>/` (landscape 4:3, about 1600px wide), copy an existing file in that folder, rename it to the new slug, fill in the top block, then commit and push. It goes live automatically and shows up on the home page, its section page and the sitemap.

## Add a new recipe

```mdx
---
title: Easy Taco Soup
slug: easy-taco-soup              # becomes /recipes/easy-taco-soup
date: 2026-12-01                  # newest date shows first
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
products:                         # optional, up to 4 items for the "What I used" block
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

## Add a new project

```mdx
---
title: Simple Cedar Raised Garden Bed
slug: cedar-raised-garden-bed     # becomes /projects/cedar-raised-garden-bed
date: 2026-12-01
category: Garden
heroImage: /images/projects/cedar-raised-garden-bed.jpg
time: One afternoon               # any short text
difficulty: Beginner              # any short text
cost: About $90                   # optional
keyword: diy cedar raised garden bed
description: One sentence for Google and link previews.
materials:
  - 6 cedar boards, 2x6 x 8 ft
steps:
  - Cut the boards to length.
products:                         # optional, up to 4
  - name: Cordless Drill
    image: /images/products/cordless-drill.jpg
    note: One short reason you love it.
    url: https://www.amazon.com/dp/XXXXXXXX?tag=yourtag-20
---

Short intro here.
```

## Add a lifestyle post

```mdx
---
title: Our Slow Sunday Morning
slug: slow-sunday-morning         # becomes /lifestyle/slow-sunday-morning
date: 2026-12-01
category: Family
heroImage: /images/lifestyle/slow-sunday-morning.jpg
keyword: slow sunday morning routine
description: One sentence for Google and link previews.
products: []                      # optional "Shop this post" block, up to 4
---

The whole post is written here. Use `## Heading` for section titles, `-` for
bullet lists, `>` for a pull quote, and **bold** or [links](https://example.com).
```

Only `title`, `slug`, `date`, `category`, `heroImage` and `keyword` are required. Everything else is optional and the page just leaves out what isn't there, so a post can go up with a caption and a video link and be filled in later:

- `instagram: https://www.instagram.com/emily.brannen/reel/XXXX/` adds a "Watch the video on Instagram" button.
- A recipe with no `ingredients` yet shows "The full recipe isn't written up here yet" above that button.
- `note: "..."` adds a small boxed note under the post text with a link to the disclaimer page (used for health or safety reminders).
- `ingredientsHeading: Alfredo sauce` labels a list that covers only part of the dish.
- No photo yet? Run `node scripts/make-placeholders.mjs` to make a simple title card at the `heroImage` path. It never overwrites a real photo.

### The "For Husbands" table

Add a `method` block to a recipe and the card also shows the whole recipe as one left-to-right table, titled "For Husbands". Each `do` is a box; the things listed under `with` are what it acts on (ingredients, or earlier boxes). Write ingredients as `amount | name`. When `method` is there you can leave out `ingredients`; the list is read from it. Keep `steps` for the normal instructions.

```yaml
method:
  do: Serve
  note: hot
  with:
    - do: Season
      note: to taste
      with:
        - do: Cook
          note: in a large pot over medium heat, stirring until combined
          with:
            - 4 cans | corn
            - 7 tbsp | butter
        - to taste | salt and pepper
```

Tips: if a line of text contains a colon, wrap it in quotes (`- "Tip: use salted butter"`). If a required field is missing the build fails with a message naming the file and field, so a broken page can't go live.

## Where things live

| To change | Edit |
| --- | --- |
| Site name, headline, intro, social links, Amazon storefront, disclosure | `lib/site.ts` |
| Colors and fonts | top of `app/globals.css`, fonts in `app/layout.tsx` |
| Shop page products | `lib/shop.ts` |
| Disclaimer page wording | `app/disclaimer/page.tsx` |
| Photos | `public/images/` (replace a file, keep its name) |
| Logo, browser icon, share image | replace `scripts/logo-source.webp`, run `node scripts/make-brand.mjs` |
| Email provider hookup (TODO) | `app/api/subscribe/route.ts` |
| Click tracking | `lib/track.ts`, `app/api/track/route.ts` |

## Placeholders to replace before launch

- Posts in `content/` come from her Instagram captions. Most still need the full recipe or steps, and all of them need a real photo in place of the title card.
- All photos in `public/images/` (regenerate the placeholders with `node scripts/make-placeholders.mjs`).
- Every `amazon.com/dp/PLACEHOLDER…?tag=yourtag-20` URL, the storefront URL and the social links.

## Shop

**Currently switched off.** The Shop link, the "Shop my kitchen" button, the `/shop` page and the Amazon line in the footer are hidden while `shop` is `false` in `lib/site.ts`. Set it to `true` to bring them back. Products listed on an individual post still show, with the Amazon disclosure beside them.

## Email signup

**Currently switched off.** The signup box is hidden everywhere while `newsletter` is `false` in `lib/site.ts`. Set it to `true` to bring it back.

Both forms post to `/api/subscribe`, which validates the address and **only logs it** (`[subscribe] …`). Nothing is stored until a provider is connected; see the TODO in that file.

## Click tracking

When a visitor lands with UTM tags (e.g. `?utm_source=facebook&utm_medium=social&utm_campaign=corn`), they're remembered for the visit. Every outbound click (Amazon, storefront, social) is logged server-side as `[outbound_click] …` with the link, where it was clicked and those UTMs. View in the dev terminal or Vercel > Logs. Use `<OutboundLink>` for any new external link so it's tracked.

## Deploying

The repo is connected to Vercel: every push to `main` goes live at emilybrannen.com.
