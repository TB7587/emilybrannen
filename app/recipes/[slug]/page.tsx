import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChecklistCard, Facts, JsonLd, JumpButton, PostFooter, PostHeader, StepList, WhatIUsed } from "@/components/PostParts";
import { PrintButton } from "@/components/PrintButton";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: [new URL(recipe.heroImage, site.url).toString()],
    author: { "@type": "Person", name: site.authorName },
    datePublished: recipe.date,
    recipeCategory: recipe.category,
    keywords: recipe.keyword,
    prepTime: isoDuration(recipe.prepTime),
    cookTime: isoDuration(recipe.cookTime),
    totalTime: isoDuration(recipe.prepTime + recipe.cookTime),
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text, url: `${url}#step-${i + 1}` })),
    mainEntityOfPage: url,
  };

  return (
    <article className="mx-auto max-w-2xl pt-8">
      <JsonLd data={jsonLd} />

      {/* 1. Title, hero photo, times */}
      <PostHeader eyebrow={recipe.category} title={recipe.title} image={recipe.heroImage}>
        <Facts
          facts={[
            { label: "Prep", value: formatMinutes(recipe.prepTime) },
            { label: "Cook", value: formatMinutes(recipe.cookTime) },
            { label: "Serves", value: String(recipe.servings) },
          ]}
        />
      </PostHeader>

      {/* 2. Jump to recipe */}
      <JumpButton href="#recipe">Jump to recipe</JumpButton>

      {recipe.body && (
        <div className="prose-intro no-print mt-7 text-[1.1rem]">
          <MDXRemote source={recipe.body} />
        </div>
      )}

      {/* 3. Ingredients checklist */}
      <ChecklistCard id="recipe" heading="Ingredients" storageKey={`ingredients:${recipe.slug}`} items={recipe.ingredients} />

      {/* 4. What I used */}
      <WhatIUsed products={recipe.products} placement="recipe:what-i-used" />

      {/* 5. Numbered steps */}
      <StepList steps={recipe.steps} />

      {/* 6. Follow, 7. Email signup, 8. Print */}
      <PostFooter followHeading="Follow for tomorrow's recipe" signupHeading="Get my recipes each week" placement="recipe">
        <PrintButton />
      </PostFooter>
    </article>
  );
}
