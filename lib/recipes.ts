import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Product = {
  name: string;
  image: string;
  note: string;
  url: string;
};

export type Recipe = {
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  category: string;
  heroImage: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: string[];
  steps: string[];
  products: Product[];
  keyword: string;
  description?: string;
  /** MDX body: the short intro shown above the recipe card. */
  body: string;
};

const RECIPES_DIR = path.join(process.cwd(), "content", "recipes");

const REQUIRED = [
  "title", "slug", "date", "category", "heroImage", "prepTime",
  "cookTime", "servings", "ingredients", "steps", "products", "keyword",
] as const;

function parseFile(file: string): Recipe {
  const raw = fs.readFileSync(path.join(RECIPES_DIR, file), "utf8");
  const { data, content } = matter(raw);

  // Fail loudly at build time so a typo in frontmatter never ships a broken page.
  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === null) {
      throw new Error(`content/recipes/${file} is missing "${key}" in its frontmatter`);
    }
  }
  if (data.products.length < 2 || data.products.length > 4) {
    throw new Error(`content/recipes/${file}: "products" needs 2 to 4 items`);
  }

  return {
    ...(data as Omit<Recipe, "body" | "date">),
    // YAML turns unquoted dates into Date objects; normalize to a string.
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
    body: content.trim(),
  };
}

/** All recipes, newest first. */
export function getAllRecipes(): Recipe[] {
  return fs
    .readdirSync(RECIPES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parseFile)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getRecipe(slug: string): Recipe | undefined {
  return getAllRecipes().find((r) => r.slug === slug);
}

export function getCategories(): string[] {
  return [...new Set(getAllRecipes().map((r) => r.category))].sort();
}
