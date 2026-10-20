import "server-only";
import { site } from "@/content/site";
import { serviceLabels } from "@/content/ui";
import type { AboutPage, ContactPage, Home, LegalPage, ServicesPage, WorksPage } from "@/lib/cms/model";
import type { WorkEntry } from "@/lib/cms/types";
import {
  loadAbout,
  loadContact,
  loadHome,
  loadPrivacy,
  loadServices,
  loadTerms,
  loadWorks,
  loadWorksPage,
} from "@/lib/cms/load";

// Markdown for agents, generated from the same content as the pages (Storyblok, or the
// defaults): /llms.txt (the index), /llms-full.txt (everything), a .md twin of every page,
// and the inline <script type="text/llms.txt"> in the layout.

const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();
const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
const absolute = (path: string) => `${site.url}${path}`;

/** The Markdown twin of a page: `/about` → `/about.md`, `/` → `/index.md` */
export const markdownPath = (path: string) => `${path === "/" ? "/index" : path}.md`;

const concept = `${site.name} is a fictional design engineer: this is a concept site designed and developed by ${site.creator.name} (${site.creator.brand}, ${site.creator.url}). The projects, clients and testimonials are part of the concept.`;

const workLink = (work: WorkEntry) => `[${work.title}](${absolute(`/works/${work.slug}`)})`;

function home(content: Home, works: WorkEntry[]) {
  return [
    `# ${site.title}`,
    oneLine(content.hero.header.text),
    `## ${content.about.header.title}`,
    content.about.bio,
    list(content.about.stats.map((stat) => `${stat.value} ${stat.label}`)),
    `## ${content.services.header.title}`,
    list(content.services.services.map((service) => `**${service.title}**: ${oneLine(service.description)}`)),
    `## ${content.works.header.title}`,
    list(works.map((work) => `${workLink(work)}: ${work.summary}`)),
    `## ${content.testimonials.header.title}`,
    content.testimonials.testimonials.map((item) => `> ${item.quote}\n>\n> ${item.name}, ${item.role}, ${item.company}`).join("\n\n"),
    "## Contact",
    `[${content.testimonials.ctaLabel}](${absolute("/contact")}) or write to ${site.email}.`,
  ].join("\n\n");
}

function about(content: AboutPage) {
  return [
    `# ${content.header.title}`,
    oneLine(content.header.text),
    content.story.map((paragraph) => paragraph.text).join("\n\n"),
    `## ${content.experienceTitle}`,
    list(content.experience.map((job) => `${job.period}: **${job.role}**, ${job.company}. ${job.text}`)),
    `## ${content.skillsTitle}`,
    list(content.skills.map((group) => `**${group.title}**: ${group.badges.map((badge) => badge.label).join(", ")}`)),
    `## ${content.workTitle}`,
    list(content.work.map((item) => `**${item.title}**: ${item.text}`)),
    `## ${content.passionsTitle}`,
    list(content.passions.map((item) => `**${item.title}**: ${item.text}`)),
  ].join("\n\n");
}

function services(content: ServicesPage) {
  return [
    `# ${content.header.title}`,
    oneLine(content.header.text),
    ...content.services.map((service) =>
      [
        `## ${service.title}`,
        `${service.summary} ${service.intro}`,
        `**${serviceLabels.deliverables}**\n\n${list(service.deliverables)}`,
        `**${serviceLabels.process}**\n\n${list(service.process.map((step) => `**${step.title}**: ${step.text}`))}`,
        `**Stack**: ${service.stack.map((tool) => tool.label).join(", ")}. **${serviceLabels.duration}**: ${service.timeline}.`,
      ].join("\n\n")
    ),
  ].join("\n\n");
}

function worksMarkdown(content: WorksPage, works: WorkEntry[]) {
  return [
    `# ${content.header.title}`,
    oneLine(content.header.text),
    list(works.map((work) => `${workLink(work)}: ${work.category}, ${work.year}. ${work.summary}`)),
  ].join("\n\n");
}

function work(item: WorkEntry) {
  const result = (r: WorkEntry["results"][number]) => `${r.prefix}${r.value}${r.suffix ? ` ${r.suffix}` : ""} ${r.label}`;
  return [
    `# ${item.title}`,
    item.summary,
    list([
      `Client: ${item.client}`,
      `Category: ${item.category}`,
      `Year: ${item.year}`,
      `Role: ${item.role}`,
      `Duration: ${item.duration}`,
      `Stack: ${item.stack.map((tool) => tool.label).join(", ")}`,
    ]),
    "## Challenge",
    item.challenge,
    "## Solution",
    list(item.solution),
    "## Results",
    list(item.results.map(result)),
  ].join("\n\n");
}

function contact(content: ContactPage) {
  return [
    `# ${content.header.title}`,
    oneLine(content.header.text),
    `**E-mail**: ${site.email}`,
    content.replyText,
    "The form asks for a name, an e-mail address, a budget range and a message, and can include a preferred day for a call.",
  ].join("\n\n");
}

function legal(page: LegalPage) {
  return [
    `# ${page.header.title}`,
    `${page.intro} (Last updated ${page.updated}.)`,
    ...page.sections.map((section) =>
      [`## ${section.heading}`, section.paragraphs, section.list.length ? list(section.list) : ""].filter(Boolean).join("\n\n")
    ),
  ].join("\n\n");
}

type Page = { path: string; title: string; description: string; markdown: string };

/** Every page, with its Markdown */
export async function pages(): Promise<Page[]> {
  const [homePage, aboutPage, servicesPage, worksPage, { works }, contactPage, privacy, terms] = await Promise.all([
    loadHome(),
    loadAbout(),
    loadServices(),
    loadWorksPage(),
    loadWorks(),
    loadContact(),
    loadPrivacy(),
    loadTerms(),
  ]);
  return [
    { path: "/", title: "Home", description: oneLine(homePage.content.hero.header.text), markdown: home(homePage.content, works) },
    { path: "/about", title: aboutPage.content.header.title, description: "Experience, skills and interests.", markdown: about(aboutPage.content) },
    {
      path: "/services",
      title: servicesPage.content.header.title,
      description: servicesPage.content.services.map((service) => service.title).join(", "),
      markdown: services(servicesPage.content),
    },
    { path: "/works", title: worksPage.content.header.title, description: oneLine(worksPage.content.header.text), markdown: worksMarkdown(worksPage.content, works) },
    ...works.map((item) => ({
      path: `/works/${item.slug}`,
      title: item.title,
      description: `${item.category}. ${item.summary}`,
      markdown: work(item),
    })),
    { path: "/contact", title: contactPage.content.header.title, description: "The contact form, e-mail and availability.", markdown: contact(contactPage.content) },
    { path: "/privacy", title: privacy.content.header.title, description: privacy.content.intro, markdown: legal(privacy.content) },
    { path: "/terms", title: terms.content.header.title, description: terms.content.intro, markdown: legal(terms.content) },
  ];
}

/** A page's Markdown, with a link back to its HTML version */
export async function pageMarkdown(path: string) {
  const page = (await pages()).find((item) => item.path === path);
  if (!page) return null;
  return `${page.markdown}\n\n---\n\nHTML version: ${absolute(page.path)}. ${concept}\n`;
}

const link = (page: Page) => `- [${page.title}](${absolute(markdownPath(page.path))}): ${page.description}`;

/** /llms.txt, following https://llmstxt.org: a title, a summary, then sections of links */
export async function llmsIndex() {
  const all = await pages();
  const projects = all.filter((page) => page.path.startsWith("/works/"));
  const main = all.filter((page) => ["/", "/about", "/services", "/works", "/contact"].includes(page.path));
  const legalPages = all.filter((page) => page.path === "/privacy" || page.path === "/terms");

  return (
    [
      `# ${site.title}`,
      `> ${site.description}`,
      concept,
      `Every page has a Markdown version at the same URL with \`.md\` added (the home page is ${absolute("/index.md")}). Everything in one file: ${absolute("/llms-full.txt")}.`,
      "## Pages",
      main.map(link).join("\n"),
      "## Works",
      projects.map(link).join("\n"),
      "## Optional",
      [...legalPages.map(link), `- [${site.creator.brand}](${site.creator.url}): the studio that designed and built this site`].join("\n"),
    ].join("\n\n") + "\n"
  );
}

/** /llms-full.txt: every page's Markdown in one file */
export async function llmsFull() {
  return [`# ${site.title}`, `> ${site.description}`, concept, ...(await pages()).map((page) => page.markdown)].join("\n\n---\n\n") + "\n";
}
