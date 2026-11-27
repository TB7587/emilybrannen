import { site } from "@/lib/site";
import { OutboundLink } from "./OutboundLink";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./SocialIcons";

const socials = [
  { name: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { name: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { name: "TikTok", href: site.social.tiktok, Icon: TikTokIcon },
];

export function FollowBlock() {
  return (
    <section className="no-print rounded-3xl border-2 border-dashed border-butter bg-butter/20 px-6 py-8 text-center">
      <h2 className="text-[1.7rem] font-semibold">Follow for tomorrow's recipe</h2>
      <p className="mt-2 text-cocoa-soft">I post something new every day. Come cook along!</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {socials.map(({ name, href, Icon }) => (
          <OutboundLink key={name} href={href} label={name} placement="recipe:follow" className="btn btn-outline bg-cream">
            <Icon />
            {name}
          </OutboundLink>
        ))}
      </div>
    </section>
  );
}
