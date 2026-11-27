import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { RecipeGrid } from "@/components/RecipeGrid";
import { getAllRecipes, getCategories } from "@/lib/recipes";
import { site } from "@/lib/site";

export default function HomePage() {
  // Only send the card fields to the browser, not full recipes.
  const recipes = getAllRecipes().map(({ title, slug, category, heroImage, prepTime, cookTime }) => ({
    title, slug, category, heroImage, prepTime, cookTime,
  }));

  return (
    <>
      <section className="pt-8 sm:flex sm:items-center sm:gap-10 sm:pt-14">
        <div className="flex items-center gap-4 sm:block">
          <Image
            src={site.authorPhoto}
            alt={site.authorName}
            width={160}
            height={160}
            priority
            sizes="(min-width: 640px) 160px, 96px"
            className="size-24 shrink-0 rounded-full border-4 border-white object-cover shadow-[0_0_0_2px_var(--color-butter)] sm:size-40"
          />
          <p className="eyebrow sm:hidden">Welcome to my kitchen</p>
        </div>
        <div>
          <p className="eyebrow hidden sm:block">Welcome to my kitchen</p>
          <h1 className="mt-4 text-[2.15rem] font-semibold sm:mt-2 sm:text-5xl">
            Simple recipes your family will ask for <em className="text-terracotta">again.</em>
          </h1>
          <p className="mt-4 max-w-xl text-cocoa-soft">{site.intro}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#recipes" className="btn btn-primary">See the latest recipes</a>
            <Link href="/shop" className="btn btn-outline">Shop my kitchen</Link>
          </div>
        </div>
      </section>

      <section id="recipes" className="mt-14">
        <h2 className="text-[1.9rem] font-semibold">Latest recipes</h2>
        <div className="mt-4">
          <RecipeGrid recipes={recipes} categories={getCategories()} />
        </div>
      </section>

      <div className="mt-14">
        <EmailSignup placement="home" />
      </div>
    </>
  );
}
