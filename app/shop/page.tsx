import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclosure } from "@/components/Disclosure";
import { OutboundLink } from "@/components/OutboundLink";
import { ProductCard } from "@/components/ProductCard";
import { shopCategories } from "@/lib/shop";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop My Kitchen",
  description: "The pans, tools and pantry favorites I actually use every day.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  if (!site.shop) notFound();
  return (
    <div className="pt-10">
      <div className="text-center">
      <p className="eyebrow">My favorites</p>
      <h1 className="mt-3 text-[2.5rem] sm:text-6xl">Shop my kitchen</h1>
      <p className="mx-auto mt-3 max-w-xl text-ink-soft">
        These are the things I reach for every single day. If it's on this page, it has earned its spot in my kitchen.
      </p>
      </div>

      <div className="mt-7 rounded-md border border-linen bg-oat px-5 py-7 text-center">
        <OutboundLink
          href={site.amazonStorefront}
          label="Amazon storefront"
          placement="shop:storefront-top"
          sponsored
          className="btn btn-primary w-full sm:w-auto"
        >
          Visit my Amazon storefront
        </OutboundLink>
        <Disclosure className="mt-3" />
      </div>

      {shopCategories.map((cat) => (
        <section key={cat.name} className="mt-12" aria-labelledby={`cat-${cat.name}`}>
          <h2 id={`cat-${cat.name}`} className="text-[2rem]">{cat.name}</h2>
          <p className="mt-1 text-ink-soft">{cat.blurb}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {cat.products.map((p) => (
              <ProductCard key={p.name} product={p} placement={`shop:${cat.name}`} />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 text-center">
        <p className="font-display text-[1.7rem]">Looking for something else?</p>
        <OutboundLink
          href={site.amazonStorefront}
          label="Amazon storefront"
          placement="shop:storefront-bottom"
          sponsored
          className="btn btn-outline mt-4 w-full sm:w-auto"
        >
          See everything on Amazon
        </OutboundLink>
        <Disclosure className="mt-3" />
      </div>
    </div>
  );
}
