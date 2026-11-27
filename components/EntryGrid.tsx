"use client";

import { useState } from "react";
import type { EntrySummary } from "@/lib/content";
import { EntryCard } from "./EntryCard";

type Props = {
  entries: EntrySummary[];
  /** "section" filters by Recipes / Projects / Lifestyle; "category" by each entry's category. */
  filterBy: "section" | "category";
  /** Display names for sections, e.g. { recipes: "Recipes" }. */
  sectionLabels: Record<string, string>;
  singularLabels: Record<string, string>;
};

export function EntryGrid({ entries, filterBy, sectionLabels, singularLabels }: Props) {
  const [active, setActive] = useState("all");
  const keyOf = (e: EntrySummary) => (filterBy === "section" ? e.section : e.category);
  const keys = [...new Set(entries.map(keyOf))];
  if (filterBy === "category") keys.sort();
  const nameOf = (k: string) => (filterBy === "section" ? sectionLabels[k] : k);
  const shown = active === "all" ? entries : entries.filter((e) => keyOf(e) === active);

  return (
    <div>
      {keys.length > 1 && (
        // Horizontally scrollable chips so a long list never wraps awkwardly on a phone.
        <div
          role="group"
          aria-label="Filter"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:justify-center"
        >
          {["all", ...keys].map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={active === k}
              onClick={() => setActive(k)}
              className={`min-h-12 shrink-0 rounded-[3px] border px-5 text-[0.74rem] font-medium uppercase tracking-[0.18em] transition-colors ${
                active === k ? "border-ink bg-ink text-cream" : "border-ink/30 bg-transparent text-ink"
              }`}
            >
              {k === "all" ? "All" : nameOf(k)}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((e, i) => (
          <li key={e.href}>
            {/* On mixed grids label the kind of post; on a section page label its category. */}
            <EntryCard entry={e} label={filterBy === "section" ? singularLabels[e.section] : e.category} priority={i === 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
