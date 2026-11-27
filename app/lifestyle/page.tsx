import type { Metadata } from "next";
import { SectionIndex } from "@/components/SectionIndex";
import { postSummaries, sections } from "@/lib/content";

export const metadata: Metadata = { title: "Lifestyle", description: sections.lifestyle.blurb, alternates: { canonical: "/lifestyle" } };

export default function LifestylePage() {
  return <SectionIndex section="lifestyle" entries={postSummaries()} />;
}
