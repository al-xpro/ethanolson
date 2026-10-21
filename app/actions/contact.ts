"use server";

import { z } from "zod";
import {
  contactSchema,
  HONEYPOT_FIELD,
  type ContactField,
  type ContactState,
} from "@/lib/contact/schema";

const FIELDS: ContactField[] = ["name", "email", "budget", "message", "call"];

export async function submitContact(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  // A filled honeypot means a bot: pretend it worked and do nothing
  if (formData.get(HONEYPOT_FIELD)) return { status: "success" };

  const values = Object.fromEntries(
    FIELDS.map((field) => [field, String(formData.get(field) ?? "")])
  ) as Record<ContactField, string>;

  const result = contactSchema.safeParse(values);
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      status: "error",
      values,
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.[0]])
      ),
    };
  }

  // Next: rate limiting (#26) and e-mail with Resend (#28), which is also the record of each enquiry
  return { status: "success" };
}
