import type { MetadataRoute } from "next";
import { allSummaries } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/recipes", "/projects", "/lifestyle", "/disclaimer", ...(site.shop ? ["/shop"] : [])].map((p) => ({ url: `${site.url}${p}` })),
    ...allSummaries().map((e) => ({ url: `${site.url}${e.href}`, lastModified: e.date })),
  ];
}
