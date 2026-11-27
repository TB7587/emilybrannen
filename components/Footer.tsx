import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import logo from "@/public/brand/logo.png";
import { Disclosure } from "./Disclosure";
import { OutboundLink } from "./OutboundLink";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./SocialIcons";

const socials = [
  { name: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { name: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { name: "TikTok", href: site.social.tiktok, Icon: TikTokIcon },
];

export function Footer() {
  return (
    <footer className="no-print mt-20 border-t border-linen bg-oat">
      <div className="mx-auto max-w-5xl px-5 py-12 text-center">
        <Image src={logo} alt={site.name} sizes="240px" className="mx-auto h-auto w-60" />
        <p className="mt-4 font-display text-xl italic text-ink-soft">{site.tagline}</p>

        <div className="mt-6 flex justify-center gap-3">
          {socials.map(({ name, href, Icon }) => (
            <OutboundLink
              key={name}
              href={href}
              label={name}
              placement="footer:social"
              className="flex size-12 items-center justify-center rounded-full border border-ink/40 text-ink"
            >
              <Icon />
              <span className="sr-only">{name}</span>
            </OutboundLink>
          ))}
        </div>

        <nav aria-label="Footer" className="mt-5 flex flex-wrap justify-center text-[0.72rem] font-medium uppercase tracking-[0.18em]">
          <Link href="/recipes" className="flex h-12 items-center px-2.5">Recipes</Link>
          <Link href="/projects" className="flex h-12 items-center px-2.5">Projects</Link>
          <Link href="/lifestyle" className="flex h-12 items-center px-2.5">Lifestyle</Link>
          {site.shop && <Link href="/shop" className="flex h-12 items-center px-2.5">Shop</Link>}
        </nav>

        {site.shop && <Disclosure className="mt-5" />}
        <p className={`${site.shop ? "mt-2" : "mt-5"} text-sm text-ink-soft`}>
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
