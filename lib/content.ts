import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { formatMinutes } from "./format";

// Three kinds of content, each a folder of MDX files:
//   content/recipes    -> /recipes/[slug]
//   content/projects   -> /projects/[slug]
//   content/lifestyle  -> /lifestyle/[slug]

export type Product = { name: string; image: string; note: string; url: string };

type Base = {
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  category: string;
  heroImage: string;
  keyword: string;
  description?: string;
  /** Link to the Instagram post or reel this came from. Adds a "Watch on Instagram" button. */
  instagram?: string;
  products: Product[];
  /** MDX body. Recipes and projects: short intro. Lifestyle: the whole post. */
  body: string;
};

/**
 * One box in the "read left to right" recipe table. A plain string is an ingredient
 * ("4 cans | corn"); an object is an action on the things listed under `with`.
 */
export type MethodNode = string | { do: string; note?: string; with: MethodNode[] };

function methodLeaves(node: MethodNode): string[] {
  return typeof node === "string" ? [node] : node.with.flatMap(methodLeaves);
}

/** "4 cans | corn" -> "4 cans corn"; "to taste | salt" -> "salt, to taste". */
function leafToIngredient(leaf: string): string {
  const i = leaf.indexOf("|");
  if (i === -1) return leaf.trim();
  const amount = leaf.slice(0, i).trim();
  const name = leaf.slice(i + 1).trim();
  return /^(to taste|as needed)$/i.test(amount) ? `${name}, ${amount}` : `${amount} ${name}`;
}

export type Recipe = Base & {
  // Everything below is optional, so a recipe can go up with just a caption and video link
  // and be filled in later. The page only shows the parts that are there.
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  servings?: number;
  ingredientsHeading?: string; // e.g. "Alfredo sauce" when the list is for one part of the dish
  ingredients: string[];
  steps: string[];
  /** Optional: draws the recipe as a left-to-right table. Ingredients are read from it. */
  method?: MethodNode;
};

export type Project = Base & {
  time?: string; // e.g. "One afternoon"
  difficulty?: string; // e.g. "Beginner"
  cost?: string; // e.g. "About $60"
  materials: string[];
  steps: string[];
};

export type Post = Base;

export const sections = {
  recipes: { label: "Recipes", singular: "Recipe", blurb: "Family favorites, holiday sides, treats and drinks." },
  projects: { label: "Projects", singular: "Project", blurb: "Holiday crafts, DIY decor and things to make with kids." },
  lifestyle: { label: "Lifestyle", singular: "Lifestyle", blurb: "Toddler homeschool, travel and everyday family life." },
} as const;
export type Section = keyof typeof sections;

const COMMON = ["title", "slug", "date", "category", "heroImage", "keyword"];

function load<T extends Base>(section: Section): T[] {
  const dir = path.join(process.cwd(), "content", section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const where = `content/${section}/${file}`;
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      // Fail loudly at build time so a typo in frontmatter never ships a broken page.
      for (const key of COMMON) {
        if (data[key] === undefined || data[key] === null) {
          throw new Error(`${where} is missing "${key}" in its frontmatter`);
        }
      }
      const products: Product[] = data.products ?? [];
      if (products.length > 4) throw new Error(`${where}: "products" can have at most 4 items`);
      return {
        ...data,
        products,
        // With a `method` table, the ingredient list comes from it, so it is only typed once.
        ingredients: data.ingredients ?? (data.method ? methodLeaves(data.method).map(leafToIngredient) : []),
        materials: data.materials ?? [],
        steps: data.steps ?? [],
        // YAML turns unquoted dates into Date objects; normalize to a string.
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
        body: content.trim(),
      } as unknown as T;
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first
}

export const getAllRecipes = () => load<Recipe>("recipes");
export const getAllProjects = () => load<Project>("projects");
export const getAllPosts = () => load<Post>("lifestyle");

export const getRecipe = (slug: string) => getAllRecipes().find((r) => r.slug === slug);
export const getProject = (slug: string) => getAllProjects().find((p) => p.slug === slug);
export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug);

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** The small set of fields a card needs. Safe to pass to client components. */
export type EntrySummary = {
  section: Section;
  href: string;
  title: string;
  category: string;
  image: string;
  meta: string;
  date: string;
};

function summarize(section: Section, e: Base, meta: string): EntrySummary {
  return { section, href: `/${section}/${e.slug}`, title: e.title, category: e.category, image: e.heroImage, meta, date: e.date };
}

export const recipeSummaries = () =>
  getAllRecipes().map((r) =>
    summarize("recipes", r, r.prepTime != null && r.cookTime != null ? `Ready in ${formatMinutes(r.prepTime + r.cookTime)}` : formatDate(r.date)),
  );
export const projectSummaries = () =>
  getAllProjects().map((p) => summarize("projects", p, [p.time, p.difficulty].filter(Boolean).join(" · ") || formatDate(p.date)));
export const postSummaries = () => getAllPosts().map((p) => summarize("lifestyle", p, formatDate(p.date)));

/** Everything, newest first. */
export const allSummaries = () =>
  [...recipeSummaries(), ...projectSummaries(), ...postSummaries()].sort((a, b) => b.date.localeCompare(a.date));
