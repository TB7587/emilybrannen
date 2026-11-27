"use client";

import { useEffect, useState } from "react";
import { trackOutboundClick } from "@/lib/track";

type Props = {
  /** Page path, e.g. "/recipes/easy-creamed-corn". */
  path: string;
  title: string;
  /** Full URL of the photo, used by Pinterest. */
  image: string;
  siteUrl: string;
  /** "recipe", "project" or "post": used in the wording and in tracking. */
  kind: string;
};

const ico = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": true } as const;
const line = { ...ico, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ShareIcon = () => (<svg {...line}><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>);
const TextIcon = () => (<svg {...line}><path d="M21 11.500a8.400 8.400 0 01-12.300 7.400L3 21l2.100-5.700A8.400 8.400 0 1121 11.500z" /></svg>);
const MailIcon = () => (<svg {...line}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>);
const LinkIcon = () => (<svg {...line}><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.500 1.500M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.500-1.500" /></svg>);
const FacebookIcon = () => (<svg {...ico} fill="currentColor"><path d="M22 12a10 10 0 10-11.600 9.900v-7H7.900V12h2.500V9.800c0-2.500 1.500-3.900 3.800-3.900 1.100 0 2.200.2 2.200.2v2.500h-1.200c-1.200 0-1.600.8-1.600 1.600V12h2.800l-.4 2.900h-2.300v7A10 10 0 0022 12z" /></svg>);
const PinterestIcon = () => (<svg {...ico} fill="currentColor"><path d="M12 2a10 10 0 00-3.600 19.300c-.1-.8-.2-2 0-2.900l1.200-5s-.3-.6-.3-1.500c0-1.400.8-2.400 1.800-2.400.9 0 1.300.6 1.300 1.400 0 .900-.5 2.100-.8 3.300-.2 1 .5 1.800 1.500 1.800 1.800 0 3.100-1.900 3.100-4.600 0-2.400-1.700-4.100-4.200-4.100a4.300 4.300 0 00-4.500 4.300c0 .900.300 1.800.7 2.300.1.100.1.200.1.300l-.3 1.100c0 .200-.2.200-.4.100-1.200-.6-2-2.400-2-3.800 0-3.100 2.300-6 6.600-6 3.400 0 6.100 2.500 6.100 5.700 0 3.400-2.200 6.200-5.200 6.200-1 0-2-.5-2.300-1.100l-.6 2.400c-.2.900-.8 2-1.200 2.600A10 10 0 1012 2z" /></svg>);

/** Each share link carries its own UTM tags, so you can see which channel brings people back. */
function useShare({ path, title, image, siteUrl, kind }: Props) {
  const link = (medium: string) => `${siteUrl}${path}?utm_source=share&utm_medium=${medium}&utm_campaign=${kind}`;
  const log = (channel: string) => trackOutboundClick({ url: link(channel), label: `Share: ${title}`, placement: `${kind}:share:${channel}` });
  const message = `${title} from Emily Brannen`;
  const enc = encodeURIComponent;
  return {
    link,
    log,
    message,
    hrefs: {
      text: `sms:?&body=${enc(`${message} ${link("text")}`)}`,
      email: `mailto:?subject=${enc(message)}&body=${enc(`I thought you'd like this:\n\n${title}\n${link("email")}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(link("facebook"))}`,
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${enc(link("pinterest"))}&media=${enc(image)}&description=${enc(message)}`,
    },
  };
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** One button: opens the phone's own share sheet, or copies the link where there isn't one. */
export function ShareButton(props: Props & { className?: string; label?: string }) {
  const { link, log, message } = useShare(props);
  const [copied, setCopied] = useState(false);

  async function onClick() {
    if (navigator.share) {
      log("native");
      try {
        await navigator.share({ title: props.title, text: message, url: link("native") });
      } catch {
        // Closed the share sheet: nothing to do.
      }
      return;
    }
    log("copy");
    if (await copy(link("copy"))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button type="button" onClick={onClick} className={props.className ?? "btn btn-outline"}>
      <ShareIcon />
      <span aria-live="polite">{copied ? "Copied" : (props.label ?? "Share")}</span>
    </button>
  );
}

/** The full set of ways to send it on. */
export function ShareBlock(props: Props) {
  const { link, log, hrefs } = useShare(props);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator.share === "function"), []);

  const item = "btn btn-outline px-3";

  return (
    <section className="no-print border-y border-ink/30 px-2 py-10 text-center" aria-labelledby="share-heading">
      <h2 id="share-heading" className="text-[2rem]">Send this {props.kind} to a friend</h2>
      <p className="mt-2 text-ink-soft">Know someone who would love it? Pass it along.</p>

      {canShare && (
        <div className="mx-auto mt-5 max-w-md">
          <ShareButton {...props} className="btn btn-primary w-full" label="Share" />
        </div>
      )}

      <div className="mx-auto mt-3 grid max-w-md grid-cols-2 gap-2">
        <a href={hrefs.text} onClick={() => log("text")} className={item}><TextIcon />Text</a>
        <a href={hrefs.email} onClick={() => log("email")} className={item}><MailIcon />Email</a>
        <a href={hrefs.facebook} target="_blank" rel="noopener" onClick={() => log("facebook")} className={item}><FacebookIcon />Facebook</a>
        <a href={hrefs.pinterest} target="_blank" rel="noopener" onClick={() => log("pinterest")} className={item}><PinterestIcon />Pinterest</a>
        <button
          type="button"
          className={`${item} col-span-2`}
          onClick={async () => {
            log("copy");
            if (await copy(link("copy"))) {
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }
          }}
        >
          <LinkIcon />
          <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
        </button>
      </div>
    </section>
  );
}
