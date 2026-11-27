import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Facts, JsonLd, JumpButton, PostFooter, PostHeader, WatchOnInstagram, WhatIUsed } from "@/components/PostParts";
import { RecipeCard } from "@/components/RecipeCard";
import { getAllRecipes, getRecipe } from "@/lib/content";
import { formatMinutes, isoDuration } from "@/lib/format";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Every recipe is pre-built as a static page; unknown slugs 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const recipe = getRecipe((await params).slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description,
    keywords: recipe.keyword,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: { type: "article", title: recipe.title, description: recipe.description, images: [recipe.heroImage] },
  };
}

export default async function RecipePage({ params }: Params) {
  const recipe = getRecipe((await params).slug);
  if (!recipe) notFound();
  const url = `${site.url}/recipes/${recipe.slug}`;
  const hasIngredients = recipe.ingredients.length > 0;
  const hasSteps = recipe.steps.length > 0;
  const total = recipe.prepTime != null && recipe.cookTime != null ? recipe.prepTime + recipe.cookTime : null;

  // Google only accepts Recipe data with both ingredients and instructions,
  // so recipes that are still video-only don't claim to be one.
  const jsonLd =
    hasIngredients && hasSteps
      ? {
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: recipe.title,
          description: recipe.description,
          image: [new URL(recipe.heroImage, site.url).toString()],
          author: { "@type": "Person", name: site.authorName },
          datePublished: recipe.date,
          recipeCategory: recipe.category,
          keywords: recipe.keyword,
          ...(recipe.prepTime != null && { prepTime: isoDuration(recipe.prepTime) }),
          ...(recipe.cookTime != null && { cookTime: isoDuration(recipe.cookTime) }),
          ...(total != null && { totalTime: isoDuration(total) }),
          ...(recipe.servings != null && { recipeYield: `${recipe.servings} servings` }),
          recipeIngredient: recipe.ingredients,
          recipeInstructions: recipe.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text, url: `${url}#step-${i + 1}` })),
          ...(recipe.instagram && { sameAs: recipe.instagram }),
          mainEntityOfPage: url,
        }
      : null;

  const facts = [
    ...(recipe.prepTime != null ? [{ label: "Prep", value: formatMinutes(recipe.prepTime) }] : []),
    ...(recipe.cookTime != null ? [{ label: "Cook", value: formatMinutes(recipe.cookTime) }] : []),
    ...(recipe.servings != null ? [{ label: "Serves", value: String(recipe.servings) }] : []),
  ];

  const missing = "The full recipe isn't written up here yet. For now, the video has it.";

  return (
    <article className="mx-auto max-w-2xl pt-8">
      {jsonLd && <JsonLd data={jsonLd} />}

      {/* 1. Title, hero photo, times. When there's a recipe card, only the card prints. */}
      <div className={hasIngredients ? "no-print" : undefined}>
        <PostHeader eyebrow={recipe.category} title={recipe.title} image={recipe.heroImage}>
          <Facts facts={facts} />
        </PostHeader>
      </div>

      {/* 2. Jump to recipe */}
      {hasIngredients && <JumpButton href="#recipe">Jump to recipe</JumpButton>}

      {recipe.body && (
        <div className="prose-intro no-print mt-7 text-[1.1rem]">
          <MDXRemote source={recipe.body} />
        </div>
      )}

      {/* 3. The recipe card: ingredients checklist, steps, print */}
      {hasIngredients ? (
        <RecipeCard recipe={recipe} />
      ) : (
        <WatchOnInstagram href={recipe.instagram} title={recipe.title} placement="recipe:watch" missing={missing} />
      )}

      {/* 4. What I used */}
      <WhatIUsed products={recipe.products} placement="recipe:what-i-used" />

      {/* 5. Follow, 6. Email signup */}
      <PostFooter
        followHeading="Follow for tomorrow's recipe"
        signupHeading="Get my recipes each week"
        placement="recipe"
        share={{ path: `/recipes/${recipe.slug}`, title: recipe.title, image: recipe.heroImage }}
      />
    </article>
  );
}
