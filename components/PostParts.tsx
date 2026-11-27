// Shared building blocks for recipe, project and lifestyle pages.
import Image from "next/image";
import type { Product } from "@/lib/content";
import { Checklist } from "./Checklist";
import { Disclosure } from "./Disclosure";
import { EmailSignup } from "./EmailSignup";
import { FollowBlock } from "./FollowBlock";
import { OutboundLink } from "./OutboundLink";
import { InstagramIcon } from "./SocialIcons";
import { ProductCard } from "./ProductCard";
import { ShareBlock } from "./Share";
import { site } from "@/lib/site";

/** Escapes "<" so content can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function PostHeader({ eyebrow, title, image, children }: { eyebrow: string; title: string; image: string; children?: React.ReactNode }) {
  return (
    <header className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-[2.5rem] sm:text-6xl">{title}</h1>
      <div className="hero-print relative -mx-5 mt-6 aspect-[4/3] overflow-hidden bg-oat sm:mx-0 sm:rounded-md">
        <Image src={image} alt={title} fill priority sizes="(min-width: 672px) 672px, 100vw" className="object-cover" />
      </div>
      {children}
    </header>
  );
}

export function Facts({ facts }: { facts: { label: string; value: string }[] }) {
  if (!facts.length) return null;
  return (
    <dl className="mt-5 grid auto-cols-fr grid-flow-col divide-x divide-linen border-y border-ink/30 text-center">
      {facts.map((f) => (
        <div key={f.label} className="px-2 py-3.5">
          <dt className="eyebrow">{f.label}</dt>
          <dd className="mt-1 font-display text-[1.35rem] leading-tight">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function JumpButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="btn btn-primary no-print mt-5 w-full">
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </a>
  );
}

export function ChecklistCard({ id, heading, storageKey, items }: { id: string; heading: string; storageKey: string; items: string[] }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="print-plain mt-8 rounded-md border border-linen bg-white px-5 py-6">
      <h2 id={`${id}-heading`} className="text-[2rem]">{heading}</h2>
      <p className="no-print mt-1 text-[0.95rem] text-ink-soft">Tap to check off as you go.</p>
      <div className="mt-3">
        <Checklist storageKey={storageKey} items={items} />
      </div>
    </section>
  );
}

export function WhatIUsed({ products, placement, heading = "What I used" }: { products: Product[]; placement: string; heading?: string }) {
  if (!products.length) return null;
  return (
    <section aria-labelledby="used-heading" className="no-print mt-10">
      <h2 id="used-heading" className="text-[2rem]">{heading}</h2>
      <Disclosure className="mt-1" />
      <div className="mt-4 grid gap-3">
        {products.map((p) => (
          <ProductCard key={p.name} product={p} placement={placement} />
        ))}
      </div>
    </section>
  );
}

/** Links to the original Instagram post. `missing` adds a note that the write-up isn't on the site yet. */
export function WatchOnInstagram({ href, title, placement, missing }: { href?: string; title: string; placement: string; missing?: string }) {
  if (!href) return null;
  return (
    <div className="no-print mt-7 rounded-md border border-linen bg-oat px-5 py-6 text-center">
      {missing && <p className="mx-auto mb-4 max-w-md text-ink-soft">{missing}</p>}
      <OutboundLink href={href} label={`Watch: ${title}`} placement={placement} className="btn btn-primary w-full sm:w-auto">
        <InstagramIcon />
        Watch the video on Instagram
      </OutboundLink>
    </div>
  );
}

export function StepList({ steps }: { steps: string[] }) {
  if (!steps.length) return null;
  return (
    <section aria-labelledby="steps-heading" className="mt-10">
      <h2 id="steps-heading" className="text-[2rem]">Steps</h2>
      <ol className="mt-5 space-y-6">
        {steps.map((step, i) => (
          <li key={i} id={`step-${i + 1}`} className="flex gap-4">
            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink font-display text-xl">
              {i + 1}
            </span>
            <p className="pt-1">
              <span className="sr-only">Step {i + 1}: </span>
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

type Shareable = { path: string; title: string; image: string };

export function PostFooter({ followHeading, signupHeading, placement, share, children }: { followHeading: string; signupHeading?: string; placement: string; share: Shareable; children?: React.ReactNode }) {
  return (
    <div className="mt-12 space-y-6">
      <ShareBlock path={share.path} title={share.title} image={new URL(share.image, site.url).toString()} siteUrl={site.url} kind={placement} />
      <FollowBlock heading={followHeading} placement={`${placement}:follow`} />
      <EmailSignup placement={placement} heading={signupHeading} />
      {children}
    </div>
  );
}
