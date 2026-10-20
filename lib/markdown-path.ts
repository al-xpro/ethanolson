/** The Markdown twin of a page: `/about` → `/about.md`, `/` → `/index.md` */
export const markdownPath = (path: string) => `${path === "/" ? "/index" : path.replace(/\/$/, "")}.md`;
