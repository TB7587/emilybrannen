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
  products: Product[];
  /** MDX body. Recipes and projects: short intro. Lifestyle: the whole post. */
  body: string;
};

export type Recipe = Base & {
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: string[];
  steps: string[];
};

export type Project = Base & {
  time: string; // e.g. "One afternoon"
  difficulty: string; // e.g. "Beginner"
  cost?: string; // e.g. "About $60"
  materials: string[];
  steps: string[];
};

export type Post = Base;

export const sections = {
  recipes: { label: "Recipes", singular: "Recipe", blurb: "Simple, cozy food my family asks for again and again." },
  projects: { label: "Projects", singular: "Project", blurb: "DIY, garden and home projects you can actually finish." },
  lifestyle: { label: "Lifestyle", singular: "Lifestyle", blurb: "Home, family and the little routines that make our days." },
} as const;
export type Section = keyof typeof sections;

const COMMON = ["title", "slug", "date", "category", "heroImage", "keyword"];
const REQUIRED: Record<Section, string[]> = {
  recipes: [...COMMON, "prepTime", "cookTime", "servings", "ingredients", "steps", "products"],
  projects: [...COMMON, "time", "difficulty", "materials", "steps"],
  lifestyle: COMMON,
};

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
      for (const key of REQUIRED[section]) {
        if (data[key] === undefined || data[key] === null) {
          throw new Error(`${where} is missing "${key}" in its frontmatter`);
        }
      }
      const products: Product[] = data.products ?? [];
      if (products.length > 4 || (section === "recipes" && products.length < 2)) {
        throw new Error(`${where}: "products" needs ${section === "recipes" ? "2 to 4" : "at most 4"} items`);
      }
      return {
        ...data,
        products,
        // YAML turns unquoted dates into Date objects; normalize to a string.
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
        body: content.trim(),
      } as T;
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
  getAllRecipes().map((r) => summarize("recipes", r, `Ready in ${formatMinutes(r.prepTime + r.cookTime)}`));
export const projectSummaries = () =>
  getAllProjects().map((p) => summarize("projects", p, `${p.time} · ${p.difficulty}`));
export const postSummaries = () => getAllPosts().map((p) => summarize("lifestyle", p, formatDate(p.date)));

/** Everything, newest first. */
export const allSummaries = () =>
  [...recipeSummaries(), ...projectSummaries(), ...postSummaries()].sort((a, b) => b.date.localeCompare(a.date));
