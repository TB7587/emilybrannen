import { site } from "@/lib/site";
import { OutboundLink } from "./OutboundLink";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./SocialIcons";

const socials = [
  { name: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { name: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { name: "TikTok", href: site.social.tiktok, Icon: TikTokIcon },
];

export function FollowBlock({ heading, placement }: { heading: string; placement: string }) {
  return (
    <section className="no-print border-y border-ink/30 px-2 py-10 text-center">
      <h2 className="text-[2rem]">{heading}</h2>
      <p className="mt-2 text-ink-soft">I post something new every day. Come along!</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {socials.map(({ name, href, Icon }) => (
          <OutboundLink key={name} href={href} label={name} placement={placement} className="btn btn-outline">
            <Icon />
            {name}
          </OutboundLink>
        ))}
      </div>
    </section>
  );
}
