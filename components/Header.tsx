import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import wordmark from "@/public/brand/wordmark.png";

const nav = [
  { href: "/recipes", label: "Recipes" },
  { href: "/projects", label: "Projects" },
  { href: "/lifestyle", label: "Lifestyle" },
  { href: "/shop", label: "Shop" },
];

export function Header() {
  return (
    <>
      <div className="no-print flex justify-center bg-cream px-5 pt-3">
        <Link href="/" className="flex h-12 items-center" aria-label={`${site.name} home`}>
          <Image src={wordmark} alt={site.name} priority sizes="210px" className="h-[42px] w-auto" />
        </Link>
      </div>
      {/* Only the slim nav row sticks, so it never eats much of a phone screen. */}
      <nav
        aria-label="Main"
        className="no-print sticky top-0 z-20 border-b border-linen bg-cream/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-md items-center justify-between px-3 text-[0.72rem] font-medium uppercase tracking-[0.16em]">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="flex h-12 items-center px-2.5">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
