import type { AboutPage } from "../../lib/cms/model.ts";
import { local } from "../../lib/cms/media.ts";

export const defaultAboutPage: AboutPage = {
  header: {
    subtitle: "Who I am",
    title: "About",
    text: "Ten years between design\nand code, and still curious\nabout both.",
  },
  image: local("/images/about.jpg", "Ethan Olson coding at his desk"),
  story: [
    {
      text: "I started as a graphic designer who wanted his layouts to move. The first time a page I'd designed actually scrolled, faded and responded under my fingers, I stopped handing designs over and started building them.",
    },
    {
      text: "Since then I've worked in studios, product teams and on my own, on everything from logistics dashboards to editorial platforms. The common thread: I'm happiest when the same person who draws the interface also designs the data behind it.",
    },
    {
      text: "Today I take on a few projects a year, end to end. I write the schema, draw the screens, tune the easing curves and measure the result, so nothing gets lost between design and development.",
    },
  ],
  experienceTitle: "Experience",
  experience: [
    {
      period: "2023 — Now",
      role: "Independent design engineer",
      company: "Self-employed",
      text: "End-to-end products for small teams: research, design systems, front ends, back ends and launch.",
    },
    {
      period: "2020 — 2023",
      role: "Senior product engineer",
      company: "Northlight Studio",
      text: "Led the front-end platform and design system for a studio of twelve, across 15 client products.",
    },
    {
      period: "2018 — 2020",
      role: "Front-end developer",
      company: "Parallel Labs",
      text: "Built interactive marketing sites and product tours, and introduced motion guidelines to the team.",
    },
    {
      period: "2016 — 2018",
      role: "Interaction designer",
      company: "Marrow & Co.",
      text: "Designed and prototyped mobile apps, and learned to ship my own prototypes in code.",
    },
  ],
  skillsTitle: "Skills",
  skills: [
    { title: "Design", badges: ["Figma", "Design systems", "Prototyping", "Typography", "Accessibility"] },
    { title: "Front end", badges: ["TypeScript", "React", "Next.js", "Tailwind CSS", "GSAP", "Three.js"] },
    { title: "Back end", badges: ["Node.js", "PostgreSQL", "Drizzle", "REST and webhooks", "Auth"] },
    { title: "Delivery", badges: ["Vercel", "GitHub Actions", "Playwright", "Vitest", "Core Web Vitals"] },
  ].map((group) => ({ title: group.title, badges: group.badges.map((label) => ({ label })) })),
  workTitle: "How I work",
  work: [
    { title: "Clear writing", text: "Specs, updates and handovers that anyone on the team can follow." },
    { title: "Calm ownership", text: "I own outcomes, not tickets, and say early when something is off." },
    { title: "Curiosity", text: "Every project teaches me a new domain, and I ask until I understand it." },
    { title: "Taste with reasons", text: "Every visual decision comes with the why behind it." },
  ],
  passionsTitle: "Away from the screen",
  passions: [
    { title: "Film photography", text: "A 1970s rangefinder and black-and-white rolls: the reason this site has no colour." },
    { title: "Modular synths", text: "Patching sound teaches the same lesson as interfaces: small parts, clear signals." },
    { title: "Trail running", text: "Long runs are where most of my architecture decisions get made." },
    { title: "Type specimens", text: "I collect printed type specimens, and still learn from every one." },
  ],
  ctaTitle: "Let's build something together.",
  ctaLabel: "Start a project",
};
