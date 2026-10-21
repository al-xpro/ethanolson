import type { Metadata } from "next";
import { Playfair } from "next/font/google";
import { site } from "@/content/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
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
  alternates: { canonical: "/" },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} antialiased bg-[#111111] min-w-[320px] overflow-x-hidden`}
      >
        <a
          href="#main"
          className="fixed left-4 top-4 z-300 -translate-y-24 rounded-full bg-white px-6 py-3 text-sm uppercase tracking-widest text-black focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Navbar />
          <main id="main" className="relative w-full min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
