import type { StaticImageData } from "next/image";
import draw from "@/public/images/draw.jpg";
import particles from "@/public/images/particles.jpg";
import interior from "@/public/images/interior.jpg";
import metro from "@/public/images/metro.jpg";
import laptop from "@/public/images/laptop.jpg";
import pen from "@/public/images/pen.jpg";
import firstService from "@/public/images/first-service.webp";
import secondService from "@/public/images/second-service.png";
import thirdService from "@/public/images/third-service.webp";
import fourthService from "@/public/images/fourth-service.webp";
import waterSpray from "@/public/images/water-spray.jpg";
import wavingWater from "@/public/images/waving-water.jpg";
import landscapeDesktop from "@/public/images/landscape-desktop.jpg";
import landscapeMobile from "@/public/images/landscape-mobile.jpg";

// Images are imported, not referenced by path: Next.js then knows their real size (so
// every <img> gets explicit dimensions) and generates a blurred preview for loading.

export type SectionHeader = {
  subTitle: string;
  title: string;
  text: string;
};

export type Picture = {
  src: StaticImageData;
  alt: string;
};

// Hero

export const heroHeader: SectionHeader = {
  subTitle: "Hi, I'm Ethan",
  title: "Design Engineer",
  text: `I design and build full-stack
  web products, from the first
  sketch to the database.`,
};

// Zoom Parallax (decorative, so alt is empty)

export const zoomPictures: (Picture & { scale: number; className: string })[] = [
  { src: draw, alt: "", scale: 4, className: "w-[25vw] h-[25vh]" },
  { src: particles, alt: "", scale: 5, className: "top-[-30vh] left-[5vw] w-[35vw] h-[30vh]" },
  { src: interior, alt: "", scale: 6, className: "top-[-10vh] left-[-25vw] w-[20vw] h-[45vh]" },
  { src: metro, alt: "", scale: 7, className: "left-[27.5vw] w-[25vw] h-[25vh]" },
  { src: laptop, alt: "", scale: 8, className: "top-[27.5vh] left-[5vw] w-[20vw] h-[25vh]" },
  { src: pen, alt: "", scale: 9, className: "top-[27.5vh] left-[-22.5vw] w-[30vw] h-[25vh]" },
];

// Intro Parallax

export const introVideo = {
  src: "/videos/design.mp4",
  poster: "/videos/design-poster.jpg",
};

// Services section

export const servicesHeader: SectionHeader = {
  subTitle: "What I Offer",
  title: "Services",
  text: `I take products from idea
    to production, from the
    interface to the server.`,
};

export const servicesData: { title: string; description: string; visual: Picture }[] = [
  {
    title: "Product Design & Design Systems",
    description:
      "Interfaces that scale. Tokens, components and accessible patterns keep a growing product consistent, from the first screen to the hundredth.",
    visual: { src: firstService, alt: "" },
  },
  {
    title: "Interactive Front Ends",
    description:
      "Motion and interaction that serve the content. Scroll scenes, micro-interactions and real-time 3D, with reduced-motion fallbacks built in.",
    visual: { src: secondService, alt: "" },
  },
  {
    title: "Back Ends & APIs",
    description:
      "Server actions, APIs, databases and auth, built type-safe from the schema to the form, so every interface has something solid behind it.",
    visual: { src: thirdService, alt: "" },
  },
  {
    title: "Performance & SEO",
    description:
      "Fast loads, clean metadata and structured data. Core Web Vitals are measured at launch and kept in budget after it.",
    visual: { src: fourthService, alt: "" },
  },
];

// Works section

export const worksHeader: SectionHeader = {
  subTitle: "Selected works",
  title: "Works",
  text: `Products I designed and built,
  from first sketch to production.
  Five of them, in detail, on the works page.`,
};


// Middle Parallax (decorative, so alt is empty)

export const middleParallax = {
  video: { src: "/videos/water-ripple.mp4", poster: "/videos/water-ripple-poster.jpg" },
  pictures: [
    { src: waterSpray, alt: "" },
    { src: wavingWater, alt: "" },
  ] satisfies Picture[],
  firstContent:
    "Every interaction is fluid like water, and every interface is a reflection of the user's needs.",
  secondContent:
    "Minimalism is not absence. It's precision: every detail exists for a reason and is intentional.",
};

// Outro Parallax

export const outroParallax = {
  text: "The world is a canvas, and I paint it with code.",
  desktop: landscapeDesktop,
  mobile: landscapeMobile,
};

// Contact page

export const contactPage = {
  marquee: "Let's build it",
  emailLabel: "E-mail",
  replyLabel: "Replies",
  replyText:
    "Every message is read and answered personally.",
  socialLabel: "Social media",
};

export const contactHeader: SectionHeader = {
  subTitle: "Get in touch",
  title: "Contact",
  text: `Have a product in mind?
  Tell me about it, and let's
  build it together.`,
};

// 404 page

export const notFoundPage = {
  subTitle: "Error 404",
  title: "Lost in the grid",
  text: "This page doesn't exist, or it moved somewhere else.",
  primary: { href: "/", label: "Back home" },
  secondary: { href: "/works", label: "See the works" },
};
