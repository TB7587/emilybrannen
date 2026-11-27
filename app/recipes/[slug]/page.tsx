import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Disclosure } from "@/components/Disclosure";
import { EmailSignup } from "@/components/EmailSignup";
import { FollowBlock } from "@/components/FollowBlock";
import { IngredientChecklist } from "@/components/IngredientChecklist";
import { PrintButton } from "@/components/PrintButton";
import { ProductCard } from "@/components/ProductCard";
import { formatMinutes, isoDuration } from "@/lib/format";
import { getAllRecipes, getRecipe } from "@/lib/recipes";
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
    recipeInstructions: recipe.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
      url: `${site.url}/recipes/${recipe.slug}#step-${i + 1}`,
    })),
    mainEntityOfPage: `${site.url}/recipes/${recipe.slug}`,
  };

  const facts = [
    { label: "Prep", value: formatMinutes(recipe.prepTime) },
    { label: "Cook", value: formatMinutes(recipe.cookTime) },
    { label: "Serves", value: String(recipe.servings) },
  ];

  return (
    <article className="mx-auto max-w-2xl pt-6">
      <script
        type="application/ld+json"
        // "<" is escaped so recipe text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1. Title, hero photo, times */}
      <header className="text-center">
        <p className="eyebrow">{recipe.category}</p>
        <h1 className="mt-3 text-[2.5rem] sm:text-6xl">{recipe.title}</h1>

        <div className="hero-print relative -mx-5 mt-6 aspect-[4/3] overflow-hidden bg-oat sm:mx-0 sm:rounded-md">
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            priority
            sizes="(min-width: 672px) 672px, 100vw"
            className="object-cover"
          />
        </div>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-linen border-y border-ink/30 text-center">
          {facts.map((f) => (
            <div key={f.label} className="px-2 py-3.5">
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-1 font-display text-2xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* 2. Jump to recipe */}
      <a href="#recipe" className="btn btn-primary no-print mt-5 w-full">
        Jump to recipe
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>

      {recipe.body && (
        <div className="prose-intro no-print mt-7 text-[1.1rem]">
          <MDXRemote source={recipe.body} />
        </div>
      )}

      {/* 3. Ingredients checklist */}
      <section id="recipe" aria-labelledby="ingredients-heading" className="print-plain mt-8 rounded-md border border-linen bg-white px-5 py-6">
        <h2 id="ingredients-heading" className="text-[2rem]">Ingredients</h2>
        <p className="no-print mt-1 text-[0.95rem] text-ink-soft">Tap to check off as you go.</p>
        <div className="mt-3">
          <IngredientChecklist slug={recipe.slug} ingredients={recipe.ingredients} />
        </div>
      </section>

      {/* 4. What I used */}
      <section aria-labelledby="used-heading" className="no-print mt-10">
        <h2 id="used-heading" className="text-[2rem]">What I used</h2>
        <Disclosure className="mt-1" />
        <div className="mt-4 grid gap-3">
          {recipe.products.map((p) => (
            <ProductCard key={p.name} product={p} placement="recipe:what-i-used" />
          ))}
        </div>
      </section>

      {/* 5. Numbered steps */}
      <section aria-labelledby="steps-heading" className="mt-10">
        <h2 id="steps-heading" className="text-[2rem]">Steps</h2>
        <ol className="mt-5 space-y-6">
          {recipe.steps.map((step, i) => (
            <li key={i} id={`step-${i + 1}`} className="flex gap-4">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink font-display text-xl"
              >
                {i + 1}
              </span>
              <p className="pt-1">
                <span className="sr-only">Step {i + 1}: </span>
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 6. Follow, 7. Email signup, 8. Print */}
      <div className="mt-12 space-y-6">
        <FollowBlock />
        <EmailSignup placement="recipe" />
        <PrintButton />
      </div>
    </article>
  );
}
