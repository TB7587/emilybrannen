import type { Metadata } from "next";
import { SectionIndex } from "@/components/SectionIndex";
import { projectSummaries, sections } from "@/lib/content";

export const metadata: Metadata = { title: "Projects", description: sections.projects.blurb, alternates: { canonical: "/projects" } };

export default function ProjectsPage() {
  return <SectionIndex section="projects" entries={projectSummaries()} />;
}
