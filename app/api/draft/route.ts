import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

// The Visual Editor opens every story through this route:
//   https://<site>/api/draft?secret=<STORYBLOK_DRAFT_SECRET>&slug=
// Storyblok appends the story's path to `slug`, followed by its own `?_storyblok…` query.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const secret = process.env.STORYBLOK_DRAFT_SECRET;
  if (!secret || params.get("secret") !== secret) {
    return new Response("Invalid preview link", { status: 401 });
  }

  // "works/quarrow?_storyblok=123" → the path, and the editor's query for the bridge
  const [path, editorQuery = ""] = (params.get("slug") ?? "").split("?");
  const forward = new URLSearchParams(editorQuery);
  params.forEach((value, key) => {
    if (key.startsWith("_storyblok")) forward.set(key, value);
  });

  // Only paths on this site: no protocol, no leading slashes, no host
  const clean = path.replace(/^\/+/, "");
  if (/[:\\]/.test(clean)) return new Response("Invalid path", { status: 400 });

  (await draftMode()).enable();
  const target = clean === "home" ? "/" : `/${clean}`;
  redirect(forward.size ? `${target}?${forward}` : target);
}
