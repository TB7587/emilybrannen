import { site } from "@/lib/site";

export function Disclosure({ className = "" }: { className?: string }) {
  return <p className={`text-sm italic text-cocoa-soft ${className}`}>{site.disclosure}</p>;
}
