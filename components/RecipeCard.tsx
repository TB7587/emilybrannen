import Image from "next/image";
import Link from "next/link";
import { formatMinutes } from "@/lib/format";
import type { Recipe } from "@/lib/recipes";

export type RecipeSummary = Pick<Recipe, "title" | "slug" | "category" | "heroImage" | "prepTime" | "cookTime">;

export function RecipeCard({ recipe, priority = false }: { recipe: RecipeSummary; priority?: boolean }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-oat">
        <Image
          src={recipe.heroImage}
          alt={recipe.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
              </div>
      <div className="px-1 pb-2 pt-4 text-center">
        <p className="eyebrow">{recipe.category}</p>
        <h3 className="mt-2 text-[1.65rem] underline-offset-4 group-hover:underline">{recipe.title}</h3>
        <p className="mt-1.5 text-[0.95rem] text-ink-soft">
          Ready in {formatMinutes(recipe.prepTime + recipe.cookTime)}
        </p>
      </div>
    </Link>
  );
}
