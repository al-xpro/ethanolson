import type { NextRequest } from "next/server";
import { llmsIndex, pageMarkdown } from "@/lib/llms";

const text = { "Content-Type": "text/plain; charset=utf-8" };

// /llms.txt is the index; /llms.txt?page=/about is one page, as agents read it (/home for the
// home page). It's what the footer's "View as an agent" opens.
export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");
  if (!page) return new Response(await llmsIndex(), { headers: text });

  const path = page === "/home" ? "/" : `/${page.replace(/^\/+|\/+$/g, "")}`;
  const markdown = await pageMarkdown(path);
  if (!markdown) return new Response(`No page at ${path}. The index is at /llms.txt.\n`, { status: 404, headers: text });
  return new Response(markdown, { headers: text });
}
