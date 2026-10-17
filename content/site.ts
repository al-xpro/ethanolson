export type SocialLink = {
  name: "Instagram" | "YouTube" | "LinkedIn" | "GitHub";
  href: string;
};

export const site = {
  name: "Ethan Olson",
  role: "Design Engineer",
  title: "Ethan Olson | Design Engineer",
  description:
    "Concept portfolio of Ethan Olson, a fictional design engineer. Designed and developed by AlxPro.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ethanolson.dev",
  email: "hello@ethanolson.dev",
  creator: {
    name: "Alex Prostamo",
    brand: "AlxPro",
    url: "https://alxpro.com",
  },
  navigation: [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/works", label: "Works" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
  // Links with an empty href are not rendered.
  socials: [
    { name: "Instagram", href: "" },
    { name: "YouTube", href: "" },
    { name: "LinkedIn", href: "" },
    { name: "GitHub", href: "" },
  ] satisfies SocialLink[],
};
