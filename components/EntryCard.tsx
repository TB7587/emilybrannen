import Image from "next/image";
import Link from "next/link";
import type { EntrySummary } from "@/lib/content";

export function EntryCard({ entry, label, priority = false }: { entry: EntrySummary; label: string; priority?: boolean }) {
  return (
    <Link href={entry.href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-oat">
        <Image
          src={entry.image}
          alt={entry.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-1 pb-2 pt-4 text-center">
        <p className="eyebrow">{label}</p>
        <h3 className="mt-2 text-[1.65rem] underline-offset-4 group-hover:underline">{entry.title}</h3>
        <p className="mt-1.5 text-[0.95rem] text-ink-soft">{entry.meta}</p>
      </div>
    </Link>
  );
}
