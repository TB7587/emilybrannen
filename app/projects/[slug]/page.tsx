import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChecklistCard, Facts, JsonLd, JumpButton, PostFooter, PostHeader, PostNote, StepList, WatchOnInstagram, WhatIUsed } from "@/components/PostParts";
import { PrintButton } from "@/components/PrintButton";
import { getAllProjects, getProject } from "@/lib/content";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    keywords: project.keyword,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { type: "article", title: project.title, description: project.description, images: [project.heroImage] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const url = `${site.url}/projects/${project.slug}`;

  const hasMaterials = project.materials.length > 0;
  const hasSteps = project.steps.length > 0;

  // schema.org HowTo, only once the steps are written up.
  const jsonLd = hasSteps
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: project.title,
        description: project.description,
        image: [new URL(project.heroImage, site.url).toString()],
        author: { "@type": "Person", name: site.authorName },
        datePublished: project.date,
        keywords: project.keyword,
        supply: project.materials.map((name) => ({ "@type": "HowToSupply", name })),
        step: project.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text, url: `${url}#step-${i + 1}` })),
        mainEntityOfPage: url,
      }
    : null;

  const facts = [
    ...(project.time ? [{ label: "Time", value: project.time }] : []),
    ...(project.difficulty ? [{ label: "Skill", value: project.difficulty }] : []),
    ...(project.cost ? [{ label: "Cost", value: project.cost }] : []),
  ];

  const missing = hasSteps
    ? undefined
    : hasMaterials
      ? "The step-by-step is in the video."
      : "The full how-to isn't written up here yet. For now, the video has it.";

  return (
    <article className="mx-auto max-w-2xl pt-8">
      {jsonLd && <JsonLd data={jsonLd} />}

      <PostHeader eyebrow={project.category} title={project.title} image={project.heroImage}>
        <Facts facts={facts} />
      </PostHeader>

      {hasMaterials && <JumpButton href="#project">Jump to project</JumpButton>}

      {project.body && (
        <div className="prose-intro no-print mt-7 text-[1.1rem]">
          <MDXRemote source={project.body} />
        </div>
      )}

      <PostNote note={project.note} />

      {hasMaterials && (
        <ChecklistCard id="project" heading="All you need" storageKey={`materials:${project.slug}`} items={project.materials} />
      )}

      <WhatIUsed products={project.products} placement="project:what-i-used" />

      <StepList steps={project.steps} />

      <WatchOnInstagram href={project.instagram} title={project.title} placement="project:watch" missing={missing} />

      <PostFooter
        followHeading="Follow for the next project"
        placement="project"
        share={{ path: `/projects/${project.slug}`, title: project.title, image: project.heroImage }}
      >
        {hasMaterials && <PrintButton label="Print this project" />}
      </PostFooter>
    </article>
  );
}
