import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { JsonLd, PostFooter, PostHeader, PostNote, WatchOnInstagram, WhatIUsed } from "@/components/PostParts";
import { formatDate, getAllPosts, getPost } from "@/lib/content";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keyword,
    alternates: { canonical: `/lifestyle/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, images: [post.heroImage] },
  };
}

export default async function LifestylePostPage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = `${site.url}/lifestyle/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [new URL(post.heroImage, site.url).toString()],
    author: { "@type": "Person", name: site.authorName },
    datePublished: post.date,
    keywords: post.keyword,
    mainEntityOfPage: url,
  };

  return (
    <article className="mx-auto max-w-2xl pt-8">
      <JsonLd data={jsonLd} />

      <PostHeader eyebrow={post.category} title={post.title} image={post.heroImage}>
        <p className="mt-4 text-[0.95rem] text-ink-soft">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
      </PostHeader>

      <div className="prose-intro mt-7 text-[1.1rem]">
        <MDXRemote source={post.body} />
      </div>

      <PostNote note={post.note} />

      <WatchOnInstagram href={post.instagram} title={post.title} placement="lifestyle:watch" />

      <WhatIUsed products={post.products} placement="lifestyle:shop-this-post" heading="Shop this post" />

      <PostFooter
        followHeading="Follow along"
        placement="post"
        share={{ path: `/lifestyle/${post.slug}`, title: post.title, image: post.heroImage }}
      />
    </article>
  );
}
