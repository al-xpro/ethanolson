import type { Metadata } from "next";
import { Playfair } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/content/site";
import { llmsIndex } from "@/lib/llms";
import { loadSettings } from "@/lib/cms/load";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
// Lenis' own rules (auto height, stopped state, nested scroll areas): Safari needs them
import "lenis/dist/lenis.css";
import "./globals.css";

const playfair = Playfair({
  style: "normal",
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
  creator: site.creator.name,
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: { default: site.title, template: `%s | ${site.name}` },
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: { default: site.title, template: `%s | ${site.name}` },
    description: site.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ content: settings }, llms] = await Promise.all([loadSettings(), llmsIndex()]);
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} antialiased bg-[#111111] min-w-[320px] overflow-x-clip`}
      >
        {/* Without JavaScript, nothing waits for an entrance animation (see .intro-hidden) */}
        <noscript>
          <style>{".intro-hidden{visibility:visible!important}"}</style>
        </noscript>
        {/* Inline llms.txt (browsers ignore unknown script types): agents on any page get the
            map of the site, generated from content/, with a Markdown link for every page */}
        <script
          type="text/llms.txt"
          dangerouslySetInnerHTML={{ __html: llms.replace(/<\/script/gi, "<\\/script") }}
        />
        <a
          href="#main"
          className="fixed left-4 top-4 z-300 -translate-y-24 rounded-full bg-white px-6 py-3 text-sm uppercase tracking-widest text-black focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Navbar ctaLabel={settings.navbarCta} />
          <main id="main" className="relative w-full min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        {/* Cookieless page views (Vercel Web Analytics), served from this domain */}
        <Analytics />
      </body>
    </html>
  );
}
