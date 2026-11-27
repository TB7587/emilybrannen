import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import wordmark from "@/public/brand/wordmark.png";

export function Header() {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-linen bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-5">
        <Link href="/" className="flex h-12 shrink-0 items-center" aria-label={`${site.name} home`}>
          <Image src={wordmark} alt={site.name} priority sizes="190px" className="h-[38px] w-auto" />
        </Link>
        <nav aria-label="Main" className="flex items-center text-[0.74rem] font-medium uppercase tracking-[0.18em]">
          <Link href="/#recipes" className="flex h-12 items-center px-2.5">
            Recipes
          </Link>
          <Link href="/shop" className="flex h-12 items-center px-2.5">
            Shop
          </Link>
        </nav>
      </div>
    </header>
  );
}
