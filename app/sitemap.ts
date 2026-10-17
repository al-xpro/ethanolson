import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { works } from "@/content/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/works", "/contact", "/privacy", "/terms"];
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
