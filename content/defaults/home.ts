import type { Home } from "../../lib/cms/model.ts";
import { local, localVideo } from "../../lib/cms/media.ts";

export const defaultHome: Home = {
  hero: {
    header: {
      subtitle: "Hi, I'm Ethan",
      title: "Design Engineer",
      text: "I design and build full-stack\nweb products, from the first\nsketch to the database.",
    },
  },
  zoom: {
    images: ["draw.jpg", "particles.jpg", "interior.jpg", "metro.jpg", "laptop.jpg", "pen.jpg"].map((file) =>
      local(`/images/${file}`)
    ),
  },
  intro: {
    video: localVideo("/videos/design.mp4"),
    poster: local("/videos/design-poster.jpg"),
  },
  about: {
    header: {
      subtitle: "Who I am",
      title: "About",
      text: "A designer who codes,\nand a developer who cares\nabout how things feel.",
    },
    image: local("/images/hero.jpg", "Ethan Olson, smiling, in a sunlit studio"),
    bio: "I'm Ethan, a design engineer with ten years between Figma and the terminal. I work with small teams that want one person to own a product from the first sketch to the database, and to care about every detail in between.",
    stats: [
      { value: "10", label: "years designing and building" },
      { value: "40+", label: "products shipped" },
      { value: "4", label: "disciplines, one person" },
    ],
    ctaLabel: "More about me",
  },
  services: {
    header: {
      subtitle: "What I Offer",
      title: "Services",
      text: "I take products from idea\nto production, from the\ninterface to the server.",
    },
    services: [
      {
        image: local("/images/first-service.webp"),
        title: "Product Design & Design Systems",
        description:
          "Interfaces that scale. Tokens, components and accessible patterns keep a growing product consistent, from the first screen to the hundredth.",
      },
      {
        image: local("/images/second-service.png"),
        title: "Interactive Front Ends",
        description:
          "Motion and interaction that serve the content. Scroll scenes, micro-interactions and real-time 3D, with reduced-motion fallbacks built in.",
      },
      {
        image: local("/images/third-service.webp"),
        title: "Back Ends & APIs",
        description:
          "Server actions, APIs, databases and auth, built type-safe from the schema to the form, so every interface has something solid behind it.",
      },
      {
        image: local("/images/fourth-service.webp"),
        title: "Performance & SEO",
        description:
          "Fast loads, clean metadata and structured data. Core Web Vitals are measured at launch and kept in budget after it.",
      },
    ],
    ctaLabel: "Explore the services",
  },
  works: {
    header: {
      subtitle: "Selected works",
      title: "Works",
      text: "Products I designed and built,\nfrom first sketch to production.\nFive of them, in detail, on the works page.",
    },
    ctaLabel: "See all works",
  },
  middle: {
    video: localVideo("/videos/water-ripple.mp4"),
    poster: local("/videos/water-ripple-poster.jpg"),
    images: [local("/images/water-spray.jpg"), local("/images/waving-water.jpg")],
    firstText: "Every interaction is fluid like water, and every interface is a reflection of the user's needs.",
    secondText: "Minimalism is not absence. It's precision: every detail exists for a reason and is intentional.",
  },
  testimonials: {
    header: {
      subtitle: "Kind words",
      title: "Testimonials",
      text: "What working with Ethan\nfeels like, in the words\nof the people he built for.",
    },
    testimonials: [
      {
        quote:
          "Ethan replaced four tools with one screen our dispatchers actually trust. The first week, nobody asked where a truck was.",
        name: "Dana Whitlock",
        role: "Head of Operations",
        company: "Quarrow Freight",
        work: "quarrow",
      },
      {
        quote:
          "He designed for the patient who struggles most, and everyone else got a better experience too. Our phones finally stopped ringing all day.",
        name: "Priya Halvorsen",
        role: "Patient Experience Lead",
        company: "Mirelle Clinics",
        work: "mirelle-health",
      },
      {
        quote:
          "Customers spend minutes turning our headphones around in 3D. It feels like holding them, and the returns dropped with it.",
        name: "Matteo Rinaldi",
        role: "Founder",
        company: "Tenebre",
        work: "tenebre-audio",
      },
      {
        quote:
          "Our editors build interactive stories on their own now. Ethan gave us a system, not a set of one-off pages.",
        name: "Ingrid Solberg",
        role: "Editor-in-Chief",
        company: "Fieldbook Journal",
        work: "fieldbook",
      },
    ],
    ctaTitle: "Your product could be next.",
    ctaLabel: "Start a project",
  },
  outro: {
    text: "The world is a canvas, and I paint it with code.",
    desktopImage: local("/images/landscape-desktop.jpg"),
    mobileImage: local("/images/landscape-mobile.jpg"),
  },
};
