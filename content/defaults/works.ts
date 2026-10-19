import type { WorkEntry } from "../../lib/cms/types.ts";
import { local } from "../../lib/cms/media.ts";

// The five works shipped with the site: the fallback when Storyblok isn't reachable, and
// what scripts/storyblok-setup.ts uploads.
export const defaultWorks: WorkEntry[] = [
  {
    "slug": "quarrow",
    "title": "Quarrow",
    "category": "Logistics dashboard",
    "year": 2026,
    "client": "Quarrow Freight",
    "role": "Design and full-stack development",
    "duration": "14 weeks",
    "summary": "A live operations dashboard that shows every truck, delay and delivery window on one map.",
    "stack": [
      {
        "label": "Next.js"
      },
      {
        "label": "TypeScript"
      },
      {
        "label": "PostgreSQL"
      },
      {
        "label": "Drizzle"
      },
      {
        "label": "Mapbox GL"
      },
      {
        "label": "Tailwind CSS"
      }
    ],
    "cover": local("/works/quarrow/cover.svg", "Quarrow, cover"),
    "screens": [
      local("/works/quarrow/screen-1.svg"),
      local("/works/quarrow/screen-2.svg"),
      local("/works/quarrow/screen-3.svg")
    ],
    "challenge": "Dispatchers juggled four tools and a spreadsheet to answer one question: where is everything right now? Updates arrived minutes late, and nobody trusted the numbers.",
    "solution": [
      "A single map view with live positions streamed from the fleet API, grouped by route and status.",
      "A design system with dense, accessible data tables, so dispatchers can scan 400 rows without losing their place.",
      "Server-side aggregation in PostgreSQL, so the dashboard loads in one round trip, even at peak hours."
    ],
    "results": [
      {
        "value": 38,
        "prefix": "",
        "suffix": "%",
        "label": "less time per dispatch decision"
      },
      {
        "value": 4,
        "prefix": "",
        "suffix": "",
        "label": "tools replaced by one"
      },
      {
        "value": 1.2,
        "prefix": "",
        "suffix": "s",
        "label": "dashboard load at peak"
      }
    ],
    "feature": [
      {
        "component": "feature_compare",
        "title": "From four tools to one",
        "before": [
          "Fleet tracker",
          "Route planner",
          "Delivery spreadsheet",
          "Group chat"
        ],
        "after": "One live map"
      }
    ],
    "gallery": [
      {
        "image": local("/works/quarrow/template-1.webp", "Live map"),
        "caption": "Live map"
      },
      {
        "image": local("/works/quarrow/template-2.webp", "Dispatch"),
        "caption": "Dispatch"
      },
      {
        "image": local("/works/quarrow/template-3.webp", "Delay alert"),
        "caption": "Delay alert"
      }
    ]
  },
  {
    "slug": "mirelle-health",
    "title": "Mirelle Health",
    "category": "Healthcare booking",
    "year": 2025,
    "client": "Mirelle Clinics",
    "role": "Product design and front-end development",
    "duration": "10 weeks",
    "summary": "A calm, accessible booking flow that gets patients from symptom to appointment in under a minute.",
    "stack": [
      {
        "label": "Next.js"
      },
      {
        "label": "React"
      },
      {
        "label": "TypeScript"
      },
      {
        "label": "Zod"
      },
      {
        "label": "Tailwind CSS"
      },
      {
        "label": "Playwright"
      }
    ],
    "cover": local("/works/mirelle-health/cover.svg", "Mirelle Health, cover"),
    "screens": [
      local("/works/mirelle-health/screen-1.svg"),
      local("/works/mirelle-health/screen-2.svg"),
      local("/works/mirelle-health/screen-3.svg")
    ],
    "challenge": "The old booking form had eleven steps and lost half of its visitors on mobile. Older patients called the front desk instead, which kept the phone lines busy all day.",
    "solution": [
      "Three steps instead of eleven, with plain language and one decision per screen.",
      "WCAG 2.2 AA from the start: large targets, visible focus, screen-reader tested flows.",
      "Shared Zod schemas between the form and the server, so errors are caught early and explained clearly."
    ],
    "results": [
      {
        "value": 2.4,
        "prefix": "×",
        "suffix": "",
        "label": "more online bookings"
      },
      {
        "value": 52,
        "prefix": "",
        "suffix": "%",
        "label": "fewer calls to the front desk"
      },
      {
        "value": 100,
        "prefix": "",
        "suffix": "",
        "label": "Lighthouse accessibility score"
      }
    ],
    "feature": [
      {
        "component": "feature_collapse",
        "title": "Eleven steps became three",
        "from": 11,
        "steps": [
          "Choose a service",
          "Pick a time",
          "Confirm"
        ]
      }
    ],
    "gallery": [
      {
        "image": local("/works/mirelle-health/template-1.webp", "Choose a service"),
        "caption": "Choose a service"
      },
      {
        "image": local("/works/mirelle-health/template-2.webp", "Pick a time"),
        "caption": "Pick a time"
      },
      {
        "image": local("/works/mirelle-health/template-3.webp", "Confirmed"),
        "caption": "Confirmed"
      }
    ]
  },
  {
    "slug": "tenebre-audio",
    "title": "Tenebre Audio",
    "category": "Headless e-commerce",
    "year": 2025,
    "client": "Tenebre",
    "role": "Design engineering and 3D",
    "duration": "12 weeks",
    "summary": "A headless store for handmade headphones, where every model can be turned, opened and configured in 3D.",
    "stack": [
      {
        "label": "Next.js"
      },
      {
        "label": "React Three Fiber"
      },
      {
        "label": "GSAP"
      },
      {
        "label": "Shopify Storefront API"
      },
      {
        "label": "Vercel"
      }
    ],
    "cover": local("/works/tenebre-audio/cover.svg", "Tenebre Audio, cover"),
    "screens": [
      local("/works/tenebre-audio/screen-1.svg"),
      local("/works/tenebre-audio/screen-2.svg"),
      local("/works/tenebre-audio/screen-3.svg")
    ],
    "challenge": "Customers couldn't see the craftsmanship in flat product photos, and the template store felt like every other shop. Returns were high because finishes looked different in person.",
    "solution": [
      "Real-time 3D models with accurate materials, loaded on demand so product pages stay fast.",
      "A configurator for wood, metal and cable finishes, with the price updating as you choose.",
      "A headless storefront on the Shopify Storefront API, with checkout kept on Shopify."
    ],
    "results": [
      {
        "value": 31,
        "prefix": "",
        "suffix": "%",
        "label": "higher conversion on product pages"
      },
      {
        "value": 22,
        "prefix": "",
        "suffix": "%",
        "label": "fewer returns for finish mismatch"
      },
      {
        "value": 1.8,
        "prefix": "",
        "suffix": "s",
        "label": "Largest Contentful Paint on mobile"
      }
    ],
    "feature": [
      {
        "component": "feature_swatches",
        "title": "Every finish, in 3D",
        "swatches": [
          {
            "name": "Smoked oak",
            "tone": "#5c5c5c"
          },
          {
            "name": "Walnut",
            "tone": "#363636"
          },
          {
            "name": "Brushed steel",
            "tone": "#c4c4c4"
          },
          {
            "name": "Black anodised",
            "tone": "#141414"
          },
          {
            "name": "Braided cable",
            "tone": "#8c8c8c"
          }
        ]
      }
    ],
    "gallery": [
      {
        "image": local("/works/tenebre-audio/template-1.webp", "Viewer"),
        "caption": "Viewer"
      },
      {
        "image": local("/works/tenebre-audio/template-2.webp", "Finish"),
        "caption": "Finish"
      },
      {
        "image": local("/works/tenebre-audio/template-3.webp", "Cart"),
        "caption": "Cart"
      }
    ]
  },
  {
    "slug": "fieldbook",
    "title": "Fieldbook",
    "category": "Editorial platform",
    "year": 2024,
    "client": "Fieldbook Journal",
    "role": "Full-stack development",
    "duration": "16 weeks",
    "summary": "An editorial platform for long-form field reporting, with scroll-driven stories that editors build themselves.",
    "stack": [
      {
        "label": "Next.js"
      },
      {
        "label": "Storyblok"
      },
      {
        "label": "TypeScript"
      },
      {
        "label": "GSAP"
      },
      {
        "label": "Resend"
      },
      {
        "label": "Vercel"
      }
    ],
    "cover": local("/works/fieldbook/cover.svg", "Fieldbook, cover"),
    "screens": [
      local("/works/fieldbook/screen-1.svg"),
      local("/works/fieldbook/screen-2.svg"),
      local("/works/fieldbook/screen-3.svg")
    ],
    "challenge": "Every interactive story needed a developer, so the newsroom published two a year. Pages were slow, and the newsletter lived in a separate tool.",
    "solution": [
      "A library of story blocks in Storyblok: maps, timelines and scroll scenes editors can combine without code.",
      "Static pages that rebuild in seconds when an editor publishes, so readers always get the fast version.",
      "Newsletter sign-up and delivery built in, with Resend sending each new story to subscribers."
    ],
    "results": [
      {
        "value": 9,
        "prefix": "×",
        "suffix": "",
        "label": "more interactive stories per year"
      },
      {
        "value": 64,
        "prefix": "",
        "suffix": "%",
        "label": "longer average reading time"
      },
      {
        "value": 12,
        "prefix": "",
        "suffix": "k",
        "label": "newsletter subscribers in six months"
      }
    ],
    "feature": [
      {
        "component": "feature_blocks",
        "title": "A library of story blocks",
        "blocks": [
          "Map",
          "Timeline",
          "Scroll scene",
          "Pull quote",
          "Gallery",
          "Data chart",
          "Audio",
          "Footnotes"
        ]
      }
    ],
    "gallery": [
      {
        "image": local("/works/fieldbook/template-1.webp", "Story blocks"),
        "caption": "Story blocks"
      },
      {
        "image": local("/works/fieldbook/template-2.webp", "Article"),
        "caption": "Article"
      },
      {
        "image": local("/works/fieldbook/template-3.webp", "Newsletter"),
        "caption": "Newsletter"
      }
    ]
  },
  {
    "slug": "ardent-ledger",
    "title": "Ardent Ledger",
    "category": "Fintech onboarding",
    "year": 2024,
    "client": "Ardent",
    "role": "Design and full-stack development",
    "duration": "11 weeks",
    "summary": "Onboarding and cash-flow analytics for small businesses, from first sign-up to the first insight in one sitting.",
    "stack": [
      {
        "label": "Next.js"
      },
      {
        "label": "TypeScript"
      },
      {
        "label": "PostgreSQL"
      },
      {
        "label": "Stripe"
      },
      {
        "label": "Zod"
      },
      {
        "label": "Vitest"
      }
    ],
    "cover": local("/works/ardent-ledger/cover.svg", "Ardent Ledger, cover"),
    "screens": [
      local("/works/ardent-ledger/screen-1.svg"),
      local("/works/ardent-ledger/screen-2.svg"),
      local("/works/ardent-ledger/screen-3.svg")
    ],
    "challenge": "New customers had to upload documents, wait for a call and connect their bank before seeing any value. Most never came back after day one.",
    "solution": [
      "Progressive onboarding: connect a bank first, see a cash-flow forecast right away, and verify documents later.",
      "Charts designed for owners, not accountants: one question per view, with plain-language summaries.",
      "Payments and billing with Stripe, and every money calculation covered by unit tests."
    ],
    "results": [
      {
        "value": 3.1,
        "prefix": "×",
        "suffix": "",
        "label": "more accounts activated in week one"
      },
      {
        "value": 7,
        "prefix": "",
        "suffix": "min",
        "label": "from sign-up to first forecast"
      },
      {
        "value": 0,
        "prefix": "",
        "suffix": "",
        "label": "rounding errors in production"
      }
    ],
    "feature": [
      {
        "component": "feature_sequence",
        "title": "Value before paperwork",
        "steps": [
          {
            "time": "Minute 1",
            "label": "Connect a bank"
          },
          {
            "time": "Minute 3",
            "label": "See the cash-flow forecast"
          },
          {
            "time": "Day 2",
            "label": "Verify documents"
          }
        ]
      }
    ],
    "gallery": [
      {
        "image": local("/works/ardent-ledger/template-1.webp", "Connect"),
        "caption": "Connect"
      },
      {
        "image": local("/works/ardent-ledger/template-2.webp", "Forecast"),
        "caption": "Forecast"
      },
      {
        "image": local("/works/ardent-ledger/template-3.webp", "Insight"),
        "caption": "Insight"
      }
    ]
  }
];
