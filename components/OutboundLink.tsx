"use client";

import { trackOutboundClick } from "@/lib/track";

type Props = {
  href: string;
  /** What was clicked, e.g. the product name. Shows up in the log. */
  label: string;
  /** Where on the site it was clicked, e.g. "recipe:what-i-used". */
  placement: string;
  /** Amazon / affiliate links get rel="sponsored". */
  sponsored?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Use for every link that leaves the site so the click gets logged. */
export function OutboundLink({ href, label, placement, sponsored, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel={sponsored ? "sponsored nofollow noopener" : "noopener"}
      className={className}
      onClick={() => trackOutboundClick({ url: href, label, placement })}
    >
      {children}
    </a>
  );
}
