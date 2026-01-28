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
  title: "John Doe Portfolio",
  description: "A showcase of John Doe's design and development projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} antialiased bg-[#0A0A0A] min-w-[320px]`}
      >
        {children}
      </body>
    </html>
  );
}
