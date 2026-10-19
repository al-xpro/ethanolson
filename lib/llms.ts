import { site } from "@/content/site";
import { heroHeader, servicesData, contactPage, contactHeader } from "@/content/sections";
import { aboutHome, aboutPage } from "@/content/about";
import { services, servicesPage } from "@/content/services";
import { works, worksPage, type Work } from "@/content/works";
import { testimonials } from "@/content/testimonials";
import { privacyPolicy, termsPage, type LegalPage } from "@/content/legal";

// Markdown for agents, generated from the same content as the pages: /llms.txt (the index),
// /llms-full.txt (everything), a .md twin of every page, and the inline
// <script type="text/llms.txt"> in the layout. Nothing here is written by hand twice.

const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();
const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
const absolute = (path: string) => `${site.url}${path}`;

/** The Markdown twin of a page: `/about` → `/about.md`, `/` → `/index.md` */
export const markdownPath = (path: string) => `${path === "/" ? "/index" : path}.md`;

const concept = `${site.name} is a fictional design engineer: this is a concept site designed and developed by ${site.creator.name} (${site.creator.brand}, ${site.creator.url}). The projects, clients and testimonials are part of the concept.`;

function home() {
  return [
    `# ${site.title}`,
    oneLine(heroHeader.text),
    `## ${oneLine(aboutHome.title)}`,
    aboutHome.bio,
    list(aboutHome.stats.map((stat) => `${stat.value} ${stat.label}`)),
    "## Services",
    list(servicesData.map((service) => `**${service.title}**: ${oneLine(service.description)}`)),
    "## Works",
    list(works.map((work) => `[${work.title}](${absolute(`/works/${work.slug}`)}): ${work.summary}`)),
    "## Testimonials",
    testimonials.map((item) => `> ${item.quote}\n>\n> ${item.name}, ${item.role}, ${item.company}`).join("\n\n"),
    "## Contact",
    `[Start a project](${absolute("/contact")}) or write to ${site.email}.`,
  ].join("\n\n");
}

function about() {
  return [
    `# ${aboutPage.title}`,
    oneLine(aboutPage.text),
    aboutPage.story.join("\n\n"),
    `## ${aboutPage.experienceTitle}`,
    list(aboutPage.experience.map((job) => `${job.period}: **${job.role}**, ${job.company}. ${job.text}`)),
    `## ${aboutPage.skillsTitle}`,
    list(aboutPage.techSkills.map((skill) => `**${skill.group}**: ${skill.items.join(", ")}`)),
    `## ${aboutPage.softSkillsTitle}`,
    list(aboutPage.softSkills.map((skill) => `**${skill.title}**: ${skill.text}`)),
    `## ${aboutPage.passionsTitle}`,
    list(aboutPage.passions.map((passion) => `**${passion.title}**: ${passion.text}`)),
  ].join("\n\n");
}

function servicesMarkdown() {
  return [
    `# ${servicesPage.title}`,
    oneLine(servicesPage.text),
    ...services.map((service) =>
      [
        `## ${service.title}`,
        `${service.summary} ${service.intro}`,
        `**${servicesPage.deliverablesLabel}**\n\n${list(service.deliverables)}`,
        `**${servicesPage.processLabel}**\n\n${list(service.process.map((step) => `**${step.title}**: ${step.text}`))}`,
        `**Stack**: ${service.stack.join(", ")}. **${servicesPage.durationLabel}**: ${service.timeline}.`,
      ].join("\n\n")
    ),
  ].join("\n\n");
}

function worksMarkdown() {
  return [
    `# ${worksPage.title}`,
    oneLine(worksPage.text),
    list(
      works.map(
        (work) => `[${work.title}](${absolute(`/works/${work.slug}`)}): ${work.category}, ${work.year}. ${work.summary}`
      )
    ),
  ].join("\n\n");
}

function work(item: Work) {
  const result = (r: Work["results"][number]) => `${r.prefix ?? ""}${r.value}${r.suffix ?? ""} ${r.label}`;
  return [
    `# ${item.title}`,
    item.summary,
    list([
      `Client: ${item.client}`,
      `Category: ${item.category}`,
      `Year: ${item.year}`,
      `Role: ${item.role}`,
      `Duration: ${item.duration}`,
      `Stack: ${item.stack.join(", ")}`,
    ]),
    "## Challenge",
    item.challenge,
    "## Solution",
    list(item.solution),
    "## Results",
    list(item.results.map(result)),
  ].join("\n\n");
}

function contact() {
  return [
    `# ${contactHeader.title}`,
    oneLine(contactHeader.text),
    `**${contactPage.emailLabel}**: ${site.email}`,
    `**${contactPage.replyLabel}**: ${contactPage.replyText}`,
    "The form asks for a name, an e-mail address, a budget range and a message, and can include a preferred day for a call.",
  ].join("\n\n");
}

function legal(page: LegalPage) {
  return [
    `# ${page.title}`,
    `${page.intro} (Last updated ${page.updated}.)`,
    ...page.sections.map((section) =>
      [`## ${section.heading}`, section.paragraphs.join("\n\n"), section.list ? list(section.list) : ""]
        .filter(Boolean)
        .join("\n\n")
    ),
  ].join("\n\n");
}

type Page = { path: string; title: string; description: string; markdown: () => string };

export const pages: Page[] = [
  { path: "/", title: "Home", description: oneLine(heroHeader.text), markdown: home },
  { path: "/about", title: "About", description: "Experience, skills and interests.", markdown: about },
  {
    path: "/services",
    title: "Services",
    description: services.map((service) => service.title).join(", "),
    markdown: servicesMarkdown,
  },
  { path: "/works", title: "Works", description: oneLine(worksPage.text), markdown: worksMarkdown },
  ...works.map((item) => ({
    path: `/works/${item.slug}`,
    title: item.title,
    description: `${item.category}. ${item.summary}`,
    markdown: () => work(item),
  })),
  { path: "/contact", title: "Contact", description: "The contact form, e-mail and availability.", markdown: contact },
  { path: "/privacy", title: "Privacy policy", description: privacyPolicy.intro, markdown: () => legal(privacyPolicy) },
  { path: "/terms", title: "Terms & conditions", description: termsPage.intro, markdown: () => legal(termsPage) },
];

/** A page's Markdown, with a link back to its HTML version */
export function pageMarkdown(path: string) {
  const page = pages.find((item) => item.path === path);
  if (!page) return null;
  return `${page.markdown()}\n\n---\n\nHTML version: ${absolute(page.path)}. ${concept}\n`;
}

const link = (page: Page) => `- [${page.title}](${absolute(markdownPath(page.path))}): ${page.description}`;

/** /llms.txt, following https://llmstxt.org: a title, a summary, then sections of links */
export function llmsIndex() {
  const [homePage, aboutEntry, servicesEntry, worksEntry, ...rest] = pages;
  const projects = rest.filter((page) => page.path.startsWith("/works/"));
  const contactEntry = rest.find((page) => page.path === "/contact")!;
  const legalPages = rest.filter((page) => page.path === "/privacy" || page.path === "/terms");

  return [
    `# ${site.title}`,
    `> ${site.description}`,
    concept,
    `Every page has a Markdown version at the same URL with \`.md\` added (the home page is ${absolute("/index.md")}). Everything in one file: ${absolute("/llms-full.txt")}.`,
    "## Pages",
    [homePage, aboutEntry, servicesEntry, worksEntry, contactEntry].map(link).join("\n"),
    "## Works",
    projects.map(link).join("\n"),
    "## Optional",
    [...legalPages.map(link), `- [${site.creator.brand}](${site.creator.url}): the studio that designed and built this site`].join("\n"),
  ].join("\n\n") + "\n";
}

/** /llms-full.txt: every page's Markdown in one file */
export function llmsFull() {
  return [`# ${site.title}`, `> ${site.description}`, concept, ...pages.map((page) => page.markdown())].join(
    "\n\n---\n\n"
  ) + "\n";
}
