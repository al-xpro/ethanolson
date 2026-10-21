import "server-only";
import { Resend } from "resend";
import { site } from "@/content/site";
import { emailCopy } from "@/content/ui";
import { ContactConfirmation } from "@/emails/ContactConfirmation";
import { ContactNotification } from "@/emails/ContactNotification";

/** A valid message, as the e-mails show it */
export type Enquiry = { name: string; email: string; budget: string; call: string; message: string };

const callDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** "2026-10-21 14:00–15:30" → "Wednesday, 21 October 2026, 14:00–15:30 (Central European Time)" */
export function readableCall(value: string | undefined): string {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (.+)$/.exec(value ?? "");
  if (!match) return emailCopy.noCall;
  const [, year, month, day, slot] = match;
  return `${callDate.format(new Date(Number(year), Number(month) - 1, Number(day)))}, ${slot} (Central European Time)`;
}

// Both e-mails come from the site's own address, on the domain verified in Resend
const from = `Ethan Olson <${site.email}>`;

/**
 * Sends the message to me (reply-to: the visitor) and a confirmation to the visitor. The
 * e-mail to me is the only record of the message, so if it fails the caller must tell the
 * visitor; a failed confirmation is only logged. Without RESEND_API_KEY (CI, a fresh clone)
 * nothing is sent.
 */
export async function sendEnquiry(enquiry: Enquiry): Promise<{ delivered: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY isn't set: the enquiry was not e-mailed.");
    return { delivered: true };
  }
  const resend = new Resend(key);
  // One line, so a name can't add headers or break the subject
  const name = enquiry.name.replace(/\s+/g, " ").trim();

  const notification = await resend.emails
    .send({
      from,
      to: site.email,
      replyTo: enquiry.email,
      subject: emailCopy.notification.subject(name),
      react: ContactNotification({ enquiry: { ...enquiry, name } }),
    })
    .catch((error: unknown) => ({ data: null, error }));
  if (notification.error) {
    console.error("The enquiry couldn't be e-mailed:", notification.error);
    return { delivered: false };
  }

  const confirmation = await resend.emails
    .send({
      from,
      to: enquiry.email,
      replyTo: site.email,
      subject: emailCopy.confirmation.subject,
      react: ContactConfirmation({ enquiry: { ...enquiry, name } }),
    })
    .catch((error: unknown) => ({ data: null, error }));
  if (confirmation.error) console.error("The confirmation couldn't be e-mailed:", confirmation.error);

  return { delivered: true };
}
