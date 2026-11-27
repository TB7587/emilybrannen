import { EmailSignup } from "./EmailSignup";
import { EntryGrid } from "./EntryGrid";
import { type EntrySummary, type Section, sections } from "@/lib/content";

const labels = Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.label]));
const singular = Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.singular]));
export const sectionLabels = { labels, singular };

/** The listing page for Recipes, Projects or Lifestyle. */
export function SectionIndex({ section, entries }: { section: Section; entries: EntrySummary[] }) {
  const s = sections[section];
  return (
    <div className="pt-10">
      <div className="text-center">
        <p className="eyebrow">From my home to yours</p>
        <h1 className="mt-3 text-[2.6rem] sm:text-6xl">{s.label}</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">{s.blurb}</p>
      </div>
      <div className="mt-8">
        {entries.length ? (
          <EntryGrid entries={entries} filterBy="category" sectionLabels={labels} singularLabels={singular} />
        ) : (
          <p className="py-10 text-center text-ink-soft">New {s.label.toLowerCase()} are on the way. Check back soon!</p>
        )}
      </div>
      <div className="mt-16">
        <EmailSignup placement={section} />
      </div>
    </div>
  );
}
