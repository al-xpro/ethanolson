import { revalidateTag } from "next/cache";
import { CMS_TAG } from "@/lib/cms/storyblok";
import { isSigned } from "@/lib/cms/webhook";

// Storyblok calls this when a story is published, unpublished or deleted
// (Settings → Webhooks). Every page reads its content under one tag, so the whole site is
// refreshed: the next visitor already gets the new version.
export async function POST(request: Request) {
  const secret = process.env.STORYBLOK_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook secret not configured", { status: 500 });

  const body = await request.text();
  if (!isSigned(body, request.headers.get("webhook-signature"), secret)) {
    return new Response("Invalid signature", { status: 401 });
  }

  revalidateTag(CMS_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
