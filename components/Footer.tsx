import Link from "next/link";
import { site } from "@/lib/site";
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
      <div className="mx-auto max-w-5xl px-5 py-10 text-center">
        <p className="font-display text-2xl font-semibold">{site.name}</p>
        <p className="mt-1 text-cocoa-soft">{site.tagline}</p>

        <div className="mt-5 flex justify-center gap-3">
          {socials.map(({ name, href, Icon }) => (
            <OutboundLink
              key={name}
              href={href}
              label={name}
              placement="footer:social"
              className="flex size-12 items-center justify-center rounded-full bg-cream text-cocoa"
            >
              <Icon />
              <span className="sr-only">{name}</span>
            </OutboundLink>
          ))}
        </div>

        <nav aria-label="Footer" className="mt-5 flex justify-center gap-2 font-extrabold">
          <Link href="/" className="flex h-12 items-center px-3 underline">Recipes</Link>
          <Link href="/shop" className="flex h-12 items-center px-3 underline">Shop my kitchen</Link>
        </nav>

        <Disclosure className="mt-5" />
        <p className="mt-2 text-sm text-cocoa-soft">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
