import type { NextConfig } from "next";

// What the pages may load, and from where. Inline scripts are allowed: Next.js streams its
// data in them, and nonces would make every page dynamic instead of prerendered.
// Development keeps the defaults (hot reload needs eval).
// Umami (when configured): its script's origin, and the gateway it reports to.
const umamiScript = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL
  ? new URL(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL).origin
  : "";
const umamiReport = umamiScript ? "https://gateway.umami.is" : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${umamiScript}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  // Storyblok's image service, and the textures the 3D figure builds in the browser
  "img-src 'self' data: blob: https://a.storyblok.com",
  "media-src 'self' https://a.storyblok.com",
  "font-src 'self'",
  `connect-src 'self' ${umamiReport}`.trim(),
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Only Storyblok's Visual Editor may show the site in a frame
  "frame-ancestors 'self' https://app.storyblok.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]
    : []),
  // For browsers without frame-ancestors; the others follow the policy above
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Media uploaded in Storyblok (resized by Storyblok's own image service, see CmsImage)
  images: { remotePatterns: [{ protocol: "https", hostname: "a.storyblok.com" }] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
