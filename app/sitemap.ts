import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { loadWorks } from "@/lib/cms/load";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { works } = await loadWorks();
  const pages = ["", "/about", "/services", "/works", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...works.map((work) => ({
      url: `${site.url}/works/${work.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
