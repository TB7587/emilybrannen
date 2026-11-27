import Link from "next/link";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-linen bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex h-12 items-center font-display text-[1.35rem] font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Main" className="flex items-center text-[0.95rem] font-extrabold">
          <Link href="/#recipes" className="flex h-12 items-center px-3">
            Recipes
          </Link>
          <Link href="/shop" className="flex h-12 items-center rounded-full bg-oat px-4">
            Shop
          </Link>
        </nav>
      </div>
    </header>
  );
}
