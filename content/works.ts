// Concept projects: the clients, people and figures are fictional, like Ethan Olson.

export type Work = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: number;
  role: string;
  duration: string;
  stack: string[];
  summary: string;
  challenge: string;
  solution: string[];
  results: { value: number; prefix?: string; suffix?: string; label: string }[];
  feature: WorkFeature;
};

// One simple, project-specific section per work
export type WorkFeature =
  | { kind: "compare"; title: string; before: string[]; after: string }
  | { kind: "collapse"; title: string; from: number; steps: string[] }
  | { kind: "swatches"; title: string; swatches: { name: string; tone: string }[] }
  | { kind: "blocks"; title: string; blocks: string[] }
  | { kind: "sequence"; title: string; steps: { time: string; label: string }[] };

export const works: Work[] = [
  {
    slug: "quarrow",
    title: "Quarrow",
    client: "Quarrow Freight",
    category: "Logistics dashboard",
    year: 2026,
    role: "Design and full-stack development",
    duration: "14 weeks",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Mapbox GL", "Tailwind CSS"],
    summary:
      "A live operations dashboard that shows every truck, delay and delivery window on one map.",
    challenge:
      "Dispatchers juggled four tools and a spreadsheet to answer one question: where is everything right now? Updates arrived minutes late, and nobody trusted the numbers.",
    solution: [
      "A single map view with live positions streamed from the fleet API, grouped by route and status.",
      "A design system with dense, accessible data tables, so dispatchers can scan 400 rows without losing their place.",
      "Server-side aggregation in PostgreSQL, so the dashboard loads in one round trip, even at peak hours.",
    ],
    results: [
      { value: 38, suffix: "%", label: "less time per dispatch decision" },
      { value: 4, label: "tools replaced by one" },
      { value: 1.2, suffix: " s", label: "dashboard load at peak" },
    ],
    feature: {
      kind: "compare",
      title: "From four tools to one",
      before: ["Fleet tracker", "Route planner", "Delivery spreadsheet", "Group chat"],
      after: "One live map",
    },
  },
  {
    slug: "mirelle-health",
    title: "Mirelle Health",
    client: "Mirelle Clinics",
    category: "Healthcare booking",
    year: 2025,
    role: "Product design and front-end development",
    duration: "10 weeks",
    stack: ["Next.js", "React", "TypeScript", "Zod", "Tailwind CSS", "Playwright"],
    summary:
      "A calm, accessible booking flow that gets patients from symptom to appointment in under a minute.",
    challenge:
      "The old booking form had eleven steps and lost half of its visitors on mobile. Older patients called the front desk instead, which kept the phone lines busy all day.",
    solution: [
      "Three steps instead of eleven, with plain language and one decision per screen.",
      "WCAG 2.2 AA from the start: large targets, visible focus, screen-reader tested flows.",
      "Shared Zod schemas between the form and the server, so errors are caught early and explained clearly.",
    ],
    results: [
      { value: 2.4, prefix: "×", label: "more online bookings" },
      { value: 52, suffix: "%", label: "fewer calls to the front desk" },
      { value: 100, label: "Lighthouse accessibility score" },
    ],
    feature: {
      kind: "collapse",
      title: "Eleven steps became three",
      from: 11,
      steps: ["Choose a service", "Pick a time", "Confirm"],
    },
  },
  {
    slug: "tenebre-audio",
    title: "Tenebre Audio",
    client: "Tenebre",
    category: "Headless e-commerce",
    year: 2025,
    role: "Design engineering and 3D",
    duration: "12 weeks",
    stack: ["Next.js", "React Three Fiber", "GSAP", "Shopify Storefront API", "Vercel"],
    summary:
      "A headless store for handmade headphones, where every model can be turned, opened and configured in 3D.",
    challenge:
      "Customers couldn't see the craftsmanship in flat product photos, and the template store felt like every other shop. Returns were high because finishes looked different in person.",
    solution: [
      "Real-time 3D models with accurate materials, loaded on demand so product pages stay fast.",
      "A configurator for wood, metal and cable finishes, with the price updating as you choose.",
      "A headless storefront on the Shopify Storefront API, with checkout kept on Shopify.",
    ],
    results: [
      { value: 31, suffix: "%", label: "higher conversion on product pages" },
      { value: 22, suffix: "%", label: "fewer returns for finish mismatch" },
      { value: 1.8, suffix: " s", label: "Largest Contentful Paint on mobile" },
    ],
    feature: {
      kind: "swatches",
      title: "Every finish, in 3D",
      swatches: [
        { name: "Smoked oak", tone: "#5c5c5c" },
        { name: "Walnut", tone: "#363636" },
        { name: "Brushed steel", tone: "#c4c4c4" },
        { name: "Black anodised", tone: "#141414" },
        { name: "Braided cable", tone: "#8c8c8c" },
      ],
    },
  },
  {
    slug: "fieldbook",
    title: "Fieldbook",
    client: "Fieldbook Journal",
    category: "Editorial platform",
    year: 2024,
    role: "Full-stack development",
    duration: "16 weeks",
    stack: ["Next.js", "Storyblok", "TypeScript", "GSAP", "Resend", "Vercel"],
    summary:
      "An editorial platform for long-form field reporting, with scroll-driven stories that editors build themselves.",
    challenge:
      "Every interactive story needed a developer, so the newsroom published two a year. Pages were slow, and the newsletter lived in a separate tool.",
    solution: [
      "A library of story blocks in Storyblok: maps, timelines and scroll scenes editors can combine without code.",
      "Static pages that rebuild in seconds when an editor publishes, so readers always get the fast version.",
      "Newsletter sign-up and delivery built in, with Resend sending each new story to subscribers.",
    ],
    results: [
      { value: 9, prefix: "×", label: "more interactive stories per year" },
      { value: 64, suffix: "%", label: "longer average reading time" },
      { value: 12, suffix: "k", label: "newsletter subscribers in six months" },
    ],
    feature: {
      kind: "blocks",
      title: "A library of story blocks",
      blocks: ["Map", "Timeline", "Scroll scene", "Pull quote", "Gallery", "Data chart", "Audio", "Footnotes"],
    },
  },
  {
    slug: "ardent-ledger",
    title: "Ardent Ledger",
    client: "Ardent",
    category: "Fintech onboarding",
    year: 2024,
    role: "Design and full-stack development",
    duration: "11 weeks",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Zod", "Vitest"],
    summary:
      "Onboarding and cash-flow analytics for small businesses, from first sign-up to the first insight in one sitting.",
    challenge:
      "New customers had to upload documents, wait for a call and connect their bank before seeing any value. Most never came back after day one.",
    solution: [
      "Progressive onboarding: connect a bank first, see a cash-flow forecast right away, and verify documents later.",
      "Charts designed for owners, not accountants: one question per view, with plain-language summaries.",
      "Payments and billing with Stripe, and every money calculation covered by unit tests.",
    ],
    results: [
      { value: 3.1, prefix: "×", label: "more accounts activated in week one" },
      { value: 7, suffix: " min", label: "from sign-up to first forecast" },
      { value: 0, label: "rounding errors in production" },
    ],
    feature: {
      kind: "sequence",
      title: "Value before paperwork",
      steps: [
        { time: "Minute 1", label: "Connect a bank" },
        { time: "Minute 3", label: "See the cash-flow forecast" },
        { time: "Day 2", label: "Verify documents" },
      ],
    },
  },
];

export const worksPage = {
  subTitle: "Selected works",
  title: "Works",
  text: `Five products I designed and built,
  from the first sketch to production.
  Each one, in detail.`,
};

export const workCover = (slug: string) => `/works/${slug}/cover.svg`;
export const workScreens = (slug: string) =>
  [1, 2, 3].map((n) => `/works/${slug}/screen-${n}.svg`);

export const workLabels = {
  back: "All works",
  client: "Client",
  duration: "Duration",
  role: "Role",
  stack: "Stack",
  challenge: "The challenge",
  solution: "What I built",
  results: "Results",
  next: "Next project",
  templates: "Templates",
};
