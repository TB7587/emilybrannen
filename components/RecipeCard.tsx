import Image from "next/image";
import Link from "next/link";
import { formatMinutes } from "@/lib/format";
import type { Recipe } from "@/lib/recipes";

export type RecipeSummary = Pick<Recipe, "title" | "slug" | "category" | "heroImage" | "prepTime" | "cookTime">;

export function RecipeCard({ recipe, priority = false }: { recipe: RecipeSummary; priority?: boolean }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group block overflow-hidden rounded-3xl border border-linen bg-white shadow-[0_2px_0_var(--color-linen)]"
    >
      <div className="relative aspect-[4/3] bg-oat">
        <Image
          src={recipe.heroImage}
          alt={recipe.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-sage">
          {recipe.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-[1.35rem] font-semibold">{recipe.title}</h3>
        <p className="mt-1.5 text-[0.95rem] font-bold text-cocoa-soft">
          Ready in {formatMinutes(recipe.prepTime + recipe.cookTime)}
        </p>
      </div>
    </Link>
  );
}
