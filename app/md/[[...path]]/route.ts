import { pageMarkdown, pages } from "@/lib/llms";

// The Markdown twin of every page. next.config.ts rewrites /about.md here, and /index.md
// for the home page.
export const dynamic = "force-static";
// New works published after the build get their Markdown on first request
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await pages()).map((page) => ({ path: page.path === "/" ? [] : page.path.slice(1).split("/") }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const markdown = await pageMarkdown(`/${path.join("/")}`);
  if (!markdown) return new Response("Not found", { status: 404 });
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // For agents, not search results: the HTML page is the one to index
      "X-Robots-Tag": "noindex",
    },
  });
}
