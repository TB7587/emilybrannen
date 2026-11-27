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
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]"
      >
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`min-h-12 shrink-0 rounded-full border-2 px-5 text-[0.95rem] font-extrabold transition-colors ${
              active === c ? "border-cocoa bg-cocoa text-cream" : "border-linen bg-white text-cocoa"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r, i) => (
          <li key={r.slug}>
            <RecipeCard recipe={r} priority={i === 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
