import type { Metadata } from "next";
import { SectionIndex } from "@/components/SectionIndex";
import { recipeSummaries, sections } from "@/lib/content";

export const metadata: Metadata = { title: "Recipes", description: sections.recipes.blurb, alternates: { canonical: "/recipes" } };

export default function RecipesPage() {
  return <SectionIndex section="recipes" entries={recipeSummaries()} />;
}
