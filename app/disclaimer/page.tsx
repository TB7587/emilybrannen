import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `The fine print for ${site.name}: recipes, projects, allergies, kids' crafts and health information.`,
  alternates: { canonical: "/disclaimer" },
};

// Plain-language site disclaimer. Edit the wording here; it is general information, not legal advice.
const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Recipes and projects",
    body: [
      "Everything here is what I make for my own family and home, shared for your personal use. I do my best to write things down accurately, but kitchens, ovens, ingredients and materials all differ, so your results may not match mine exactly.",
      "You make these recipes and projects at your own risk. Use your own judgment, and follow the instructions and safety warnings on any tool, appliance or product you use.",
    ],
  },
  {
    heading: "Allergies and food safety",
    body: [
      "I don't label recipes for allergens. Please read the ingredient list and the labels on what you buy, and swap or skip anything that isn't safe for you or the people you're feeding.",
      "Cook meat, poultry and eggs to safe temperatures and store leftovers properly. Honey is not safe for babies under one year old.",
      "I don't provide nutrition information. If a number ever appears, treat it as an estimate.",
    ],
  },
  {
    heading: "Crafts and kids",
    body: [
      "Some projects use hot glue, craft knives, scissors, paint, glitter, small parts or candles. Those steps are for adults. Please supervise children closely, keep small pieces away from little ones, and never leave a lit candle unattended.",
      "Homemade playdough and other craft materials are for playing with, not eating.",
    ],
  },
  {
    heading: "Not medical advice",
    body: [
      "I'm a mom sharing what works in our house, not a doctor, nurse or dietitian. Anything I share about wellness, home remedies, pregnancy or parenting is my own experience and is for general information only. It is not medical advice and isn't meant to diagnose, treat, cure or prevent anything.",
      "Please talk to your own doctor before trying a remedy or changing what you eat, especially if you are pregnant, nursing, taking medication or caring for a young child.",
    ],
  },
  {
    heading: "Brands, links and sponsorships",
    body: [
      "I mention brands and products I use. Unless a post says otherwise, I bought them myself and nobody paid me to talk about them. If a post is sponsored, or a product was sent to me for free, I'll say so in that post.",
      "Links to other websites are there to be helpful. I'm not responsible for what's on them.",
    ],
  },
  {
    heading: "Using my content",
    body: [
      `The photos, recipes and words on this site belong to ${site.name}. You're welcome to share a link to any post. Please don't copy a full recipe, post or photo elsewhere without asking first.`,
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-2xl pt-10">
      <div className="text-center">
        <p className="eyebrow">The fine print</p>
        <h1 className="mt-3 text-[2.6rem] sm:text-6xl">Disclaimer</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          The short version: I share what I make and do at home. Please use your own good judgment.
        </p>
      </div>

      <div className="mt-10 space-y-9">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-[1.8rem]">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3">{p}</p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-12 text-center">
        <Link href="/" className="btn btn-outline">Back to home</Link>
      </p>
    </article>
  );
}
