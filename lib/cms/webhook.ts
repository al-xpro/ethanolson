import { createHmac, timingSafeEqual } from "node:crypto";

// Storyblok signs each webhook: the `webhook-signature` header is the HMAC-SHA1 of the raw
// body, with the secret set in Settings → Webhooks
export function isSigned(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = Buffer.from(createHmac("sha1", secret).update(body).digest("hex"));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
