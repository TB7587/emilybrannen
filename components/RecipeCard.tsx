import Image from "next/image";
import type { Recipe } from "@/lib/content";
import { formatMinutes } from "@/lib/format";
import { site } from "@/lib/site";
import { Checklist } from "./Checklist";
import { OutboundLink } from "./OutboundLink";
import { PrintButton } from "./PrintButton";
import { InstagramIcon } from "./SocialIcons";

/**
 * The whole recipe in one compact card: what "Jump to recipe" lands on and
 * the only thing that prints. Everything optional is simply left out.
 */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const total = recipe.prepTime != null && recipe.cookTime != null ? recipe.prepTime + recipe.cookTime : null;
  const facts = [
    ...(recipe.prepTime != null ? [{ label: "Prep", value: formatMinutes(recipe.prepTime) }] : []),
    ...(recipe.cookTime != null ? [{ label: "Cook", value: formatMinutes(recipe.cookTime) }] : []),
    ...(total != null ? [{ label: "Total", value: formatMinutes(total) }] : []),
    ...(recipe.servings != null ? [{ label: "Serves", value: String(recipe.servings) }] : []),
  ];

  return (
    <section
      id="recipe"
      aria-labelledby="recipe-card-title"
      className="recipe-card mt-8 overflow-hidden rounded-md border border-ink bg-white"
    >
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-linen px-5 pb-5 pt-6">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">{recipe.category}</p>
          <h2 id="recipe-card-title" className="mt-1.5 text-[1.9rem]">{recipe.title}</h2>
          {recipe.description && <p className="mt-2 text-[0.95rem] leading-snug text-ink-soft">{recipe.description}</p>}
        </div>
        <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-oat print:hidden">
          <Image src={recipe.heroImage} alt="" fill sizes="80px" className="object-cover" />
        </div>
      </div>

      {/* Quick facts */}
      {facts.length > 0 && (
        <dl className="grid auto-cols-fr grid-flow-col divide-x divide-linen border-b border-linen text-center">
          {facts.map((f) => (
            <div key={f.label} className="px-1 py-3">
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-0.5 font-display text-[1.25rem] leading-tight">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Actions */}
      <div className="no-print grid grid-cols-2 gap-2 border-b border-linen px-5 py-4">
        <PrintButton label="Print" />
        {recipe.instagram ? (
          <OutboundLink href={recipe.instagram} label={`Watch: ${recipe.title}`} placement="recipe:card-watch" className="btn btn-outline px-3">
            <InstagramIcon />
            Video
          </OutboundLink>
        ) : (
          <span />
        )}
      </div>

      {/* Ingredients */}
      <div className="px-5 pt-5">
        <h3 className="text-[1.5rem]">
          Ingredients
          {recipe.ingredientsHeading && <span className="text-ink-soft"> · {recipe.ingredientsHeading}</span>}
        </h3>
        <div className="mt-1">
          <Checklist storageKey={`ingredients:${recipe.slug}`} items={recipe.ingredients} />
        </div>
      </div>

      {/* Instructions */}
      <div className="px-5 pb-6 pt-6">
        <h3 className="text-[1.5rem]">Instructions</h3>
        {recipe.steps.length > 0 ? (
          <ol className="mt-3 space-y-4">
            {recipe.steps.map((step, i) => (
              <li key={i} id={`step-${i + 1}`} className="flex gap-3.5">
                <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ink font-display text-lg leading-none">
                  {i + 1}
                </span>
                <p className="pt-0.5">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-ink-soft">The step-by-step is in the video.</p>
        )}
      </div>

      {/* Sign-off, so a printed or screenshotted card still says where it came from */}
      <p className="border-t border-linen bg-oat px-5 py-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ink-soft print:bg-transparent">
        {site.authorName} · {site.url.replace(/^https?:\/\//, "")}
      </p>
    </section>
  );
}
