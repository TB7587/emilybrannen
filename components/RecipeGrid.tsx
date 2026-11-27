"use client";

import { useState } from "react";
import { RecipeCard, type RecipeSummary } from "./RecipeCard";

export function RecipeGrid({ recipes, categories }: { recipes: RecipeSummary[]; categories: string[] }) {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? recipes : recipes.filter((r) => r.category === active);

  return (
    <div>
      {/* Horizontally scrollable chips so a long category list never wraps awkwardly on a phone. */}
      <div
        role="group"
        aria-label="Filter recipes by category"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:justify-center"
      >
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`min-h-12 shrink-0 rounded-[3px] border px-5 text-[0.74rem] font-medium uppercase tracking-[0.18em] transition-colors ${
              active === c ? "border-ink bg-ink text-cream" : "border-ink/30 bg-transparent text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r, i) => (
          <li key={r.slug}>
            <RecipeCard recipe={r} priority={i === 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
