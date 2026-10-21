"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { contactLabels } from "@/content/ui";
import { clientIp, limit, visitorKey } from "@/lib/rate-limit";
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

  // At most 5 messages per visitor per hour (counted only once a message is valid)
  const key = visitorKey(clientIp(await headers()), "contact");
  const { allowed } = await limit(key, 5, 3600);
  if (!allowed) return { status: "error", values, fieldErrors: {}, formError: contactLabels.limited };

  return { status: "success" };
}
