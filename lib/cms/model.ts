import type { z } from "zod";
import { bloks, component, date, image, images, lines, number, option, section, text, textarea, video, workRef } from "./fields.ts";

// Everything a client edits in Storyblok, with its limits. Layout, animation and the 3D
// figure stay in code; the animated blocks are a library the client picks from and fills in.

// Shared ---------------------------------------------------------------------------------

export const header = component("section_header", "Section header", {
  subtitle: text("Subtitle", 2, 32, "The small line above the title."),
  title: text("Title", 2, 40),
  text: textarea("Text", 10, 160, "Short: each line break becomes a line of the animation."),
});

const cta = {
  ctaTitle: text("Closing line", 5, 60),
  ctaLabel: text("Button label", 3, 32),
};

// Site settings (one story) ----------------------------------------------------------------

export const settings = component(
  "site_settings",
  "Site settings",
  { navbarCta: text("Navbar button", 3, 24, "The button next to the menu, linking to the contact page.") },
  { root: true }
);

// Home -----------------------------------------------------------------------------------

export const hero = component("home_hero", "Hero", { header: section("Header", header) });

export const zoom = component("home_zoom", "Zoom parallax", {
  images: images("Images", 6, 6, 400, "Decorative: they grow from the center as the page scrolls."),
});

export const intro = component("home_intro", "Intro video", {
  video: video("Video", 3, "Plays muted, in a loop, behind the mask."),
  poster: image("Poster", 300, "Shown while the video loads."),
});

export const stat = component("stat", "Stat", {
  value: text("Value", 1, 6, "For example 10 or 40+."),
  label: text("Label", 3, 40),
});

export const aboutHome = component("home_about", "About", {
  header: section("Header", header),
  image: image("Portrait", 400),
  bio: textarea("Bio", 60, 320),
  stats: bloks("Stats", stat, 3, 3),
  ctaLabel: text("Button label", 3, 32),
});

export const serviceCard = component("service_card", "Service card", {
  image: image("Image", 400),
  title: text("Title", 3, 40),
  description: textarea("Description", 40, 200),
});

export const servicesHome = component("home_services", "Services", {
  header: section("Header", header),
  services: bloks("Services", serviceCard, 1, 6),
  ctaLabel: text("Button label", 3, 32),
});

export const worksHome = component("home_works", "Works", {
  header: section("Header", header),
  ctaLabel: text("Button label", 3, 32, "The gallery shows the works' screens: edit them in each work."),
});

export const middle = component("home_middle", "Middle parallax", {
  video: video("Video", 3),
  poster: image("Poster", 300),
  images: images("Images", 2, 2, 400),
  firstText: textarea("First text", 20, 140),
  secondText: textarea("Second text", 20, 140),
});

export const testimonial = component("testimonial", "Testimonial", {
  quote: textarea("Quote", 40, 240),
  name: text("Name", 3, 40),
  role: text("Role", 2, 40),
  company: text("Company", 2, 40),
  work: workRef("Work", "The project the card links to."),
});

export const testimonialsHome = component("home_testimonials", "Testimonials", {
  header: section("Header", header),
  testimonials: bloks("Cards", testimonial, 1, 6),
  ...cta,
});

export const outro = component("home_outro", "Outro parallax", {
  text: textarea("Text", 10, 80),
  desktopImage: image("Image (desktop)", 800, "Landscape, shown on screens wider than 768px."),
  mobileImage: image("Image (phone)", 800, "Portrait, shown on phones."),
});

export const home = component(
  "home",
  "Home",
  {
    hero: section("Hero", hero),
    zoom: section("Zoom parallax", zoom),
    intro: section("Intro video", intro),
    about: section("About", aboutHome),
    services: section("Services", servicesHome),
    works: section("Works", worksHome),
    middle: section("Middle parallax", middle),
    testimonials: section("Testimonials", testimonialsHome),
    outro: section("Outro", outro),
  },
  { root: true }
);

// About page -----------------------------------------------------------------------------

export const experience = component("experience", "Experience", {
  period: text("Period", 4, 20, "For example 2020 — 2023."),
  role: text("Role", 3, 50),
  company: text("Company", 2, 40),
  text: textarea("Text", 20, 200),
});

export const badge = component("badge", "Badge", { label: text("Label", 1, 30) });

export const skillGroup = component("skill_group", "Skill group", {
  title: text("Title", 2, 30),
  badges: bloks("Badges", badge, 1, 10),
});

export const card = component("card", "Card", {
  title: text("Title", 2, 40),
  text: textarea("Text", 20, 180),
});

export const aboutPage = component(
  "about_page",
  "About page",
  {
    header: section("Header", header),
    image: image("Portrait", 400),
    story: bloks("Story", component("paragraph", "Paragraph", { text: textarea("Text", 40, 400) }), 1, 5),
    experienceTitle: text("Experience title", 2, 30),
    experience: bloks("Experience", experience, 1, 8),
    skillsTitle: text("Skills title", 2, 30),
    skills: bloks("Skill groups", skillGroup, 1, 6),
    workTitle: text("“How I work” title", 2, 30),
    work: bloks("How I work", card, 2, 6),
    passionsTitle: text("Interests title", 2, 30),
    passions: bloks("Interests", card, 2, 6),
    ...cta,
  },
  { root: true }
);

// Services page --------------------------------------------------------------------------

export const processStep = component("process_step", "Process step", {
  title: text("Title", 2, 30),
  text: textarea("Text", 10, 140),
});

export const serviceStep = component("service_step", "Service", {
  title: text("Title", 3, 40),
  summary: text("Summary", 10, 90, "Shown in the timeline next to the steps."),
  intro: textarea("Intro", 40, 400),
  schema: option("Diagram", [
    { name: "Design system (tokens and components)", value: "system" },
    { name: "Motion (easing curve and timeline)", value: "motion" },
    { name: "Architecture (from form to database)", value: "architecture" },
    { name: "Performance (Core Web Vitals)", value: "vitals" },
  ] as const, "An animated diagram from the site's library."),
  deliverables: lines("What you get", 2, 6, 60),
  process: bloks("How I work", processStep, 2, 6),
  timeline: text("Typical timeline", 3, 20, "For example 3–8 weeks."),
  stack: bloks("Stack", badge, 1, 8),
});

export const servicesPage = component(
  "services_page",
  "Services page",
  {
    header: section("Header", header),
    services: bloks("Services", serviceStep, 2, 6),
    ...cta,
  },
  { root: true }
);

// Works ----------------------------------------------------------------------------------

export const result = component("result", "Result", {
  value: number("Number", 0, 100000, { decimals: true }),
  prefix: text("Before the number", 0, 3, "For example +."),
  suffix: text("After the number", 0, 6, "For example % or s."),
  label: text("Label", 3, 50),
});

export const galleryItem = component("gallery_item", "Gallery image", {
  image: image("Image", 300, "A screen or a detail of the project."),
  caption: text("Caption", 2, 30),
});

// The animated spotlight block: one per work, from a library of five
export const featureCompare = component("feature_compare", "Spotlight: before and after", {
  title: text("Title", 5, 50),
  before: lines("Before", 2, 6, 30, "Crossed out one by one."),
  after: text("After", 2, 30),
});
export const featureCollapse = component("feature_collapse", "Spotlight: fewer steps", {
  title: text("Title", 5, 50),
  from: number("Steps before", 3, 30),
  steps: lines("Steps now", 2, 6, 30),
});
export const swatch = component("swatch", "Swatch", {
  name: text("Name", 2, 24),
  tone: text("Tone", 7, 7, "A grey as a hex colour, for example #5c5c5c."),
});
export const featureSwatches = component("feature_swatches", "Spotlight: swatches", {
  title: text("Title", 5, 50),
  swatches: bloks("Swatches", swatch, 2, 8),
});
export const featureBlocks = component("feature_blocks", "Spotlight: building blocks", {
  title: text("Title", 5, 50),
  blocks: lines("Blocks", 3, 12, 20),
});
export const sequenceStep = component("sequence_step", "Sequence step", {
  time: text("When", 2, 16, "For example Minute 1."),
  label: text("What", 3, 40),
});
export const featureSequence = component("feature_sequence", "Spotlight: sequence", {
  title: text("Title", 5, 50),
  steps: bloks("Steps", sequenceStep, 2, 5),
});

export const featureKinds = [featureCompare, featureCollapse, featureSwatches, featureBlocks, featureSequence];

export const work = component(
  "work",
  "Work",
  {
    title: text("Title", 2, 30),
    category: text("Category", 3, 30),
    year: number("Year", 2000, 2100),
    client: text("Client", 2, 40),
    role: text("Role", 3, 60),
    duration: text("Duration", 3, 20),
    summary: textarea("Summary", 40, 200, "Used on the works page, in search results and when shared."),
    stack: bloks("Stack", badge, 1, 8),
    cover: image("Cover", 500, "Landscape, 16:10, about 1600 × 1000 px."),
    screens: images("Screens", 3, 3, 300, "Portrait, 9:16: they fill the home page gallery."),
    challenge: textarea("Challenge", 60, 400),
    solution: lines("Solution", 2, 6, 200),
    results: bloks("Results", result, 3, 3),
    feature: bloks("Spotlight", featureKinds, 1, 1, "Pick one animated block and fill it in."),
    gallery: bloks("Gallery", galleryItem, 3, 3, "Three images that drift past at different speeds."),
  },
  {
    root: true,
    tabs: {
      Overview: ["title", "category", "year", "client", "role", "duration", "summary", "stack"],
      Media: ["cover", "screens", "gallery"],
      Story: ["challenge", "solution", "results", "feature"],
    },
  }
);

export const worksPage = component("works_page", "Works page", { header: section("Header", header) }, { root: true });

// Contact and legal ----------------------------------------------------------------------

export const contactPage = component(
  "contact_page",
  "Contact page",
  {
    header: section("Header", header),
    marquee: text("Marquee", 3, 24, "The large words sliding across the top."),
    replyText: textarea("Replies text", 10, 140),
  },
  { root: true }
);

export const legalSection = component("legal_section", "Legal section", {
  heading: text("Heading", 3, 50),
  paragraphs: textarea("Paragraphs", 20, 1200, "Separate paragraphs with an empty line."),
  list: lines("List", 0, 10, 240, "Optional bullet points under the paragraphs."),
});

export const legalPage = component(
  "legal_page",
  "Legal page",
  {
    header: section("Header", header),
    updated: date("Last updated"),
    intro: textarea("Intro", 40, 400),
    sections: bloks("Sections", legalSection, 1, 20),
  },
  { root: true }
);

// Types ----------------------------------------------------------------------------------

export type Header = z.infer<typeof header.schema>;
export type Settings = z.infer<typeof settings.schema>;
export type Home = z.infer<typeof home.schema>;
export type AboutPage = z.infer<typeof aboutPage.schema>;
export type ServicesPage = z.infer<typeof servicesPage.schema>;
export type ServiceStep = z.infer<typeof serviceStep.schema>;
export type Work = z.infer<typeof work.schema>;
export type Feature = Work["feature"][number];
export type WorksPage = z.infer<typeof worksPage.schema>;
export type ContactPage = z.infer<typeof contactPage.schema>;
export type LegalPage = z.infer<typeof legalPage.schema>;
export type Testimonial = z.infer<typeof testimonial.schema>;
