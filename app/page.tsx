import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { HeartRule } from "@/components/HeartRule";
import { RecipeGrid } from "@/components/RecipeGrid";
import { getAllRecipes, getCategories } from "@/lib/recipes";
import { site } from "@/lib/site";
import logo from "@/public/brand/logo.png";

export default function HomePage() {
  // Only send the card fields to the browser, not full recipes.
  const recipes = getAllRecipes().map(({ title, slug, category, heroImage, prepTime, cookTime }) => ({
    title, slug, category, heroImage, prepTime, cookTime,
  }));

  return (
    <>
      <section className="pt-8 text-center sm:pt-12">
        <Image
          src={logo}
          alt={site.name}
          priority
          sizes="(min-width: 640px) 440px, 320px"
          className="mx-auto h-auto w-full max-w-[20rem] sm:max-w-[27.5rem]"
        />
        <h1 className="mx-auto mt-7 max-w-xl text-[2.3rem] sm:text-5xl">
          Simple recipes your family will ask for <em>again.</em>
        </h1>
      </section>

      <section className="mx-auto mt-9 max-w-2xl sm:flex sm:items-center sm:gap-9">
        <Image
          src={site.authorPhoto}
          alt={site.authorName}
          width={176}
          height={176}
          sizes="176px"
          className="mx-auto size-36 shrink-0 rounded-full border border-linen object-cover p-1 sm:mx-0 sm:size-44"
        />
        <div className="mt-6 text-center sm:mt-0 sm:text-left">
          <p className="eyebrow">Welcome to my kitchen</p>
          <p className="mt-3 text-ink-soft">{site.intro}</p>
        </div>
      </section>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
        <a href="#recipes" className="btn btn-primary">See the latest recipes</a>
        <Link href="/shop" className="btn btn-outline">Shop my kitchen</Link>
      </div>

      <HeartRule className="mt-14" />

      <section id="recipes" className="mt-12">
        <h2 className="text-center text-[2.1rem]">Latest recipes</h2>
        <div className="mt-5">
          <RecipeGrid recipes={recipes} categories={getCategories()} />
        </div>
      </section>

      <div className="mt-16">
        <EmailSignup placement="home" />
      </div>
    </>
  );
}
