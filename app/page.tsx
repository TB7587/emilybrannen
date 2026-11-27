import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { EntryGrid } from "@/components/EntryGrid";
import { HeartRule } from "@/components/HeartRule";
import { sectionLabels } from "@/components/SectionIndex";
import { allSummaries, sections } from "@/lib/content";
import { site } from "@/lib/site";
import logo from "@/public/brand/logo.png";

export default function HomePage() {
  const latest = allSummaries().slice(0, 9);

  return (
    <>
      <section className="pt-6 text-center sm:pt-10">
        <Image
          src={logo}
          alt=""
          priority
          sizes="(min-width: 640px) 440px, 320px"
          className="mx-auto h-auto w-full max-w-[20rem] sm:max-w-[27.5rem]"
        />
        <h1 className="mx-auto mt-7 max-w-xl text-[2.3rem] sm:text-5xl">{site.headline}</h1>
      </section>

      <section className="mx-auto mt-9 max-w-2xl sm:flex sm:items-center sm:gap-9">
        <Image
          src={site.authorPhoto}
          alt={site.authorName}
          width={176}
          height={176}
          sizes="176px"
          className="mx-auto size-36 shrink-0 rounded-full border border-linen object-cover p-1 sm:mx-0 sm:size-44"
        />
        <div className="mt-6 text-center sm:mt-0 sm:text-left">
          <p className="eyebrow">Welcome, I'm {site.authorName.split(" ")[0]}</p>
          <p className="mt-3 text-ink-soft">{site.intro}</p>
        </div>
      </section>

      {/* The three things she shares, as big tap targets. */}
      <nav aria-label="Explore" className="mx-auto mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
        {(Object.keys(sections) as (keyof typeof sections)[]).map((key) => (
          <Link key={key} href={`/${key}`} className="group rounded-md border border-ink/30 px-5 py-5 text-center transition-colors hover:border-ink">
            <span className="block font-display text-[1.7rem] leading-none">{sections[key].label}</span>
            <span className="mt-2 block text-[0.92rem] leading-snug text-ink-soft">{sections[key].blurb}</span>
          </Link>
        ))}
      </nav>
      <div className="mx-auto mt-3 max-w-2xl">
        <Link href="/shop" className="btn btn-primary w-full">Shop my kitchen</Link>
      </div>

      <HeartRule className="mt-14" />

      <section id="latest" className="mt-12">
        <h2 className="text-center text-[2.1rem]">The latest</h2>
        <div className="mt-5">
          <EntryGrid entries={latest} filterBy="section" sectionLabels={sectionLabels.labels} singularLabels={sectionLabels.singular} />
        </div>
      </section>

      {site.newsletter && (
        <div className="mt-16">
          <EmailSignup placement="home" />
        </div>
      )}
    </>
  );
}
