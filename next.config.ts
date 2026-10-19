import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Media uploaded in Storyblok (resized by Storyblok's own image service, see CmsImage)
  images: { remotePatterns: [{ protocol: "https", hostname: "a.storyblok.com" }] },
  // Markdown versions of the pages for agents (app/md, lib/llms.ts)
  async rewrites() {
    return [
      { source: "/index.md", destination: "/md" },
      { source: "/works/:slug.md", destination: "/md/works/:slug" },
      { source: "/:page.md", destination: "/md/:page" },
    ];
  },
};

export default nextConfig;
