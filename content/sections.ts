export type SectionHeader = {
  subTitle: string;
  title: string;
  text: string;
};

export type Picture = {
  src: string;
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
  { src: "/images/draw.jpg", alt: "", scale: 4, className: "w-[25vw] h-[25vh]" },
  { src: "/images/particles.jpg", alt: "", scale: 5, className: "top-[-30vh] left-[5vw] w-[35vw] h-[30vh]" },
  { src: "/images/interior.jpg", alt: "", scale: 6, className: "top-[-10vh] left-[-25vw] w-[20vw] h-[45vh]" },
  { src: "/images/metro.jpg", alt: "", scale: 7, className: "left-[27.5vw] w-[25vw] h-[25vh]" },
  { src: "/images/laptop.jpg", alt: "", scale: 8, className: "top-[27.5vh] left-[5vw] w-[20vw] h-[25vh]" },
  { src: "/images/pen.jpg", alt: "", scale: 9, className: "top-[27.5vh] left-[-22.5vw] w-[30vw] h-[25vh]" },
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
    visual: { src: "/images/first-service.png", alt: "" },
  },
  {
    title: "Interactive Front Ends",
    description:
      "Motion and interaction that serve the content. Scroll scenes, micro-interactions and real-time 3D, with reduced-motion fallbacks built in.",
    visual: { src: "/images/second-service.png", alt: "" },
  },
  {
    title: "Back Ends & APIs",
    description:
      "Server actions, APIs, databases and auth, built type-safe from the schema to the form, so every interface has something solid behind it.",
    visual: { src: "/images/third-service.png", alt: "" },
  },
  {
    title: "Performance & SEO",
    description:
      "Fast loads, clean metadata and structured data. Core Web Vitals are measured at launch and kept in budget after it.",
    visual: { src: "/images/fourth-service.jpg", alt: "" },
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

export const workImages: Picture[] = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `/projects/work-${n}.svg`, alt: `Placeholder wireframe for work ${n}` };
});

// Middle Parallax (decorative, so alt is empty)

export const middleParallax = {
  video: { src: "/videos/water-ripple.mp4", poster: "/videos/water-ripple-poster.jpg" },
  pictures: [
    { src: "/images/water-spray.jpg", alt: "" },
    { src: "/images/waving-water.jpg", alt: "" },
  ] satisfies Picture[],
  firstContent:
    "Every interaction is fluid like water, and every interface is a reflection of the user's needs.",
  secondContent:
    "Minimalism is not absence. It's precision: every detail exists for a reason and is intentional.",
};

// Outro Parallax

export const outroParallax = {
  text: "The world is a canvas, and I paint it with code.",
  desktop: { src: "/images/landscape-desktop.jpg", width: 2560, height: 1440 },
  mobile: { src: "/images/landscape-mobile.jpg", width: 1440, height: 2560 },
};

// Contact page

export const contactPage = {
  marquee: "Let's build it",
  emailLabel: "E-mail",
  replyLabel: "Replies",
  replyText:
    "Every message is read and answered personally. Concept site: messages reach the AlxPro studio.",
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
