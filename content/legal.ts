export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalPage = {
  subTitle: string;
  title: string;
  text: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const contact = "hello@ethanolson.dev";

export const legalLabels = { updated: "Last updated", onThisPage: "On this page" };

export const privacyPolicy: LegalPage = {
  subTitle: "Legal",
  title: "Privacy Policy",
  text: `What this site collects,
  why it needs it,
  and what you can do about it.`,
  updated: "17 October 2026",
  intro:
    "This page explains what personal data this website collects, why, and what you can do about it. Ethan Olson is a fictional design engineer: the site is a concept project designed and developed by Alex Prostamo (AlxPro), who is responsible for the data described here.",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [
        `The controller of your personal data is Alex Prostamo, trading as AlxPro (alxpro.com). You can reach me about anything on this page at ${contact}.`,
      ],
    },
    {
      heading: "What I collect, and why",
      paragraphs: [
        "I only collect what the site needs to work and to answer you:",
      ],
      list: [
        "Contact form: your name, e-mail address, budget range and message, so I can reply to your enquiry. The legal basis is the steps you ask me to take before a possible contract.",
        "Spam protection: a salted, one-way hash of your IP address, kept for one hour to limit how many messages can be sent. Your IP address itself is never stored. The legal basis is my legitimate interest in keeping the form usable.",
        "Analytics: anonymous page views counted with Umami, without cookies and without identifying you. The legal basis is my legitimate interest in understanding which pages are useful.",
        "Performance: anonymous loading measurements (Core Web Vitals) and the page they were taken on, with no IP address, user agent or cookie.",
        "Bookings: if you book a call, Cal.com processes your name, e-mail address and the details you enter, under its own privacy policy.",
      ],
    },
    {
      heading: "Who processes the data for me",
      paragraphs: [
        "These providers process data on my behalf, under data processing agreements:",
      ],
      list: [
        "Vercel (hosting): serves the website and keeps short-lived server logs.",
        "Storyblok (EU servers): stores contact form messages.",
        "Resend: sends the e-mail notification about your message, and its confirmation.",
        "Neon (EU servers): stores the spam-protection counters and performance measurements.",
        "Umami: counts anonymous page views.",
        "Cal.com: handles call bookings.",
      ],
    },
    {
      heading: "Transfers outside the EU",
      paragraphs: [
        "Some providers are based in the United States. Where data leaves the European Economic Area, the transfer is covered by the European Commission's Standard Contractual Clauses or an adequacy decision.",
      ],
    },
    {
      heading: "How long data is kept",
      paragraphs: [
        "Contact messages are deleted 12 months after our last exchange, unless they become part of a project. Spam-protection counters are deleted after one hour. Anonymous analytics and performance data are kept in aggregate form.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "This website doesn't use tracking or advertising cookies, so there is no cookie banner. Bot protection on the contact form runs a short check in your browser, without storing a cookie for tracking.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `Under the GDPR you can ask for access to your data, its correction or deletion, a copy in a portable format, or a restriction of its use, and you can object to processing based on legitimate interest. Write to ${contact}; I reply within one month. You can also complain to your local data protection authority.`,
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If the way the site handles data changes, this page is updated, along with the date at the top.",
      ],
    },
  ],
};

export const termsPage: LegalPage = {
  subTitle: "Legal",
  title: "Terms & Conditions",
  text: `The rules for using this site,
  in plain words.`,
  updated: "17 October 2026",
  intro:
    "These terms apply to your use of this website. By using it, you agree to them. If you don't agree, please don't use the site.",
  sections: [
    {
      heading: "A concept website",
      paragraphs: [
        "Ethan Olson is a fictional design engineer. This website is a concept project designed and developed by Alex Prostamo (AlxPro) to show how a portfolio like this is built. The projects, clients, testimonials and figures shown are fictional and for illustration only.",
      ],
    },
    {
      heading: "Using the site",
      paragraphs: [
        "You may browse the site for personal, non-commercial purposes. You agree not to misuse it: no attempts to break or overload it, no automated scraping, and no use of the contact form to send spam or unlawful content.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The design, code and copy of this website belong to Alex Prostamo. All rights are reserved: the source code is public so it can be read, not reused. Third-party images, videos and models keep their own licenses, credited in the project's credits.",
      ],
    },
    {
      heading: "Enquiries",
      paragraphs: [
        "Sending a message or booking a call doesn't create a contract. Any project is agreed separately, in writing.",
      ],
    },
    {
      heading: "Links to other websites",
      paragraphs: [
        "The site links to services such as Cal.com and social networks. Their own terms and privacy policies apply there, and I'm not responsible for their content.",
      ],
    },
    {
      heading: "No warranty",
      paragraphs: [
        "The site is provided as it is. I work to keep it accurate and available, but I can't guarantee that it's free of errors or always online.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the extent the law allows, I'm not liable for indirect losses arising from the use of this website. Nothing in these terms limits liability that can't be limited by law.",
      ],
    },
    {
      heading: "Changes and contact",
      paragraphs: [
        `These terms may change; the date at the top shows the latest version. Questions are welcome at ${contact}.`,
      ],
    },
  ],
};
