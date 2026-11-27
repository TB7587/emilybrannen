import { site } from "@/lib/site";

export function Disclosure({ className = "" }: { className?: string }) {
  return <p className={`text-sm italic text-ink-soft ${className}`}>{site.disclosure}</p>;
}
