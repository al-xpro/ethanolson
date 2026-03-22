import type { Metadata } from "next";
import { Playfair } from "next/font/google";
import "./globals.css";

const playfair = Playfair({
  weight: "400",
  style: "normal",
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethan Olson Portfolio",
  description: "A showcase of Etham Olson's design and development projects.",
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
