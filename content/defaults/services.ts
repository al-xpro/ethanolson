import type { ServicesPage } from "../../lib/cms/model.ts";

export const defaultServicesPage: ServicesPage = {
  "header": {
    "subtitle": "What I offer",
    "title": "Services",
    "text": "Four ways I help teams ship,\nfrom the first interface\nto the last server request."
  },
  "services": [
    {
      "title": "Product Design & Design Systems",
      "summary": "Interfaces that scale, from the first screen to the hundredth.",
      "intro": "I design products in the browser as much as in Figma, so what you approve is what ships. Tokens, components and accessible patterns keep a growing product consistent, and give your team a shared language.",
      "schema": "system",
      "deliverables": [
        "User flows and wireframes",
        "High-fidelity interface design",
        "A design system in Figma and in code",
        "Accessibility review (WCAG 2.2 AA)"
      ],
      "process": [
        {
          "title": "Discover",
          "text": "Interviews, analytics and a review of what exists today."
        },
        {
          "title": "Shape",
          "text": "Flows and wireframes, tested early with real users."
        },
        {
          "title": "Design",
          "text": "High-fidelity screens built on reusable tokens and components."
        },
        {
          "title": "Hand over",
          "text": "A documented system your team can extend without me."
        }
      ],
      "timeline": "3–8 weeks",
      "stack": [
        {
          "label": "Figma"
        },
        {
          "label": "Storybook"
        },
        {
          "label": "Tailwind CSS"
        },
        {
          "label": "Design tokens"
        }
      ]
    },
    {
      "title": "Interactive Front Ends",
      "summary": "Motion and interaction that serve the content.",
      "intro": "Scroll scenes, micro-interactions and real-time 3D that make a product memorable without making it slow. Every effect has a reduced-motion fallback, and every page is measured against Core Web Vitals.",
      "schema": "motion",
      "deliverables": [
        "Marketing sites and product front ends",
        "Scroll-driven storytelling with GSAP",
        "Real-time 3D with React Three Fiber",
        "Reduced-motion and keyboard support"
      ],
      "process": [
        {
          "title": "Storyboard",
          "text": "The motion is planned like a film: what moves, when, and why."
        },
        {
          "title": "Prototype",
          "text": "The key scenes are built first, on real devices."
        },
        {
          "title": "Build",
          "text": "Components with motion budgets, tested on low-end phones."
        },
        {
          "title": "Polish",
          "text": "Easing, timing and accessibility, pass after pass."
        }
      ],
      "timeline": "4–10 weeks",
      "stack": [
        {
          "label": "Next.js"
        },
        {
          "label": "React"
        },
        {
          "label": "GSAP"
        },
        {
          "label": "Three.js"
        },
        {
          "label": "React Three Fiber"
        }
      ]
    },
    {
      "title": "Back Ends & APIs",
      "summary": "Something solid behind every interface.",
      "intro": "Server actions, APIs, databases and authentication, typed from the schema to the form. I build back ends that are boring in the best way: predictable, tested and easy to change.",
      "schema": "architecture",
      "deliverables": [
        "Data models and database migrations",
        "APIs, server actions and webhooks",
        "Authentication and roles",
        "CMS, payment and e-mail integrations"
      ],
      "process": [
        {
          "title": "Model",
          "text": "The data first: what you store, who can see it, how it changes."
        },
        {
          "title": "Contract",
          "text": "Shared schemas, so the front end and the back end can't drift apart."
        },
        {
          "title": "Build",
          "text": "Small, tested pieces, deployed behind preview environments."
        },
        {
          "title": "Operate",
          "text": "Logs, alerts and docs, so the system stays understood."
        }
      ],
      "timeline": "4–12 weeks",
      "stack": [
        {
          "label": "Node.js"
        },
        {
          "label": "PostgreSQL"
        },
        {
          "label": "Drizzle"
        },
        {
          "label": "Zod"
        },
        {
          "label": "Storyblok"
        },
        {
          "label": "Stripe"
        }
      ]
    },
    {
      "title": "Performance & SEO",
      "summary": "Fast loads, clean metadata, and numbers that stay in budget.",
      "intro": "Speed is a feature, and search is a channel. I audit what's slow or invisible, fix it, and set up the measurements that keep it fixed after launch.",
      "schema": "vitals",
      "deliverables": [
        "Core Web Vitals audit and fixes",
        "Technical SEO and structured data",
        "Image, font and script optimization",
        "Real-user monitoring and budgets"
      ],
      "process": [
        {
          "title": "Measure",
          "text": "Lab tests and real-user data, on the pages that matter."
        },
        {
          "title": "Prioritize",
          "text": "The fixes ranked by impact and effort."
        },
        {
          "title": "Fix",
          "text": "Changes shipped one by one, each measured before and after."
        },
        {
          "title": "Guard",
          "text": "Budgets in CI, so regressions are caught before they ship."
        }
      ],
      "timeline": "2–6 weeks",
      "stack": [
        {
          "label": "Lighthouse"
        },
        {
          "label": "PageSpeed Insights"
        },
        {
          "label": "Schema.org"
        },
        {
          "label": "Next.js"
        }
      ]
    }
  ],
  "ctaTitle": "Not sure which one you need?",
  "ctaLabel": "Tell me about your project"
};
