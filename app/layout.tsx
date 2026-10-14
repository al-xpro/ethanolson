import type { Metadata } from "next";
import { Playfair } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const playfair = Playfair({
  style: "normal",
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  creator: site.creator.name,
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
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
        {children}
      </body>
    </html>
  );
}
