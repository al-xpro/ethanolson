export type SocialLink = {
  name: "Instagram" | "YouTube" | "LinkedIn" | "GitHub";
  href: string;
};

export const site = {
  name: "Ethan Olson",
  role: "Design Engineer",
  title: "Ethan Olson | Design Engineer",
  description:
    "Ethan Olson, design engineer: full-stack web products, from the first sketch to the database. Designed and developed by AlxPro.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ethanolson.alxpro.com",
  email: "hello@ethanolson.alxpro.com",
  creator: {
    name: "Alex Prostamo",
    brand: "AlxPro",
    url: "https://alxpro.com",
  },
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
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
