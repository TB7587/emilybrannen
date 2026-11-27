import Image from "next/image";
import type { Product } from "@/lib/recipes";
import { OutboundLink } from "./OutboundLink";

export function ProductCard({ product, placement }: { product: Product; placement: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-linen bg-white p-3.5">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-oat">
        <Image src={product.image} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-sans text-base font-extrabold leading-snug">{product.name}</h3>
        <p className="mt-0.5 text-[0.95rem] leading-snug text-cocoa-soft">{product.note}</p>
        <OutboundLink
          href={product.url}
          label={product.name}
          placement={placement}
          sponsored
          className="btn btn-primary mt-3 min-h-12 self-start px-5 text-[0.95rem]"
        >
          Shop on Amazon
          <span className="sr-only"> (opens in a new tab)</span>
        </OutboundLink>
      </div>
    </div>
  );
}
