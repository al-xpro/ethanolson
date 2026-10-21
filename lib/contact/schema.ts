import { z } from "zod";
import { isOpenSlot } from "@/lib/availability";

// No compiled validators: they need eval, which the Content Security Policy forbids
z.config({ jitless: true });

export const BUDGETS = ["Under €5k", "€5k–15k", "€15k–50k", "Over €50k", "Not sure yet"] as const;

// Shared by the form (field names, limits) and the server action (validation)
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Please enter your name." })
    .max(80, { error: "Keep your name under 80 characters." }),
  email: z
    .string()
    .trim()
    .max(254, { error: "That e-mail address is too long." })
    .pipe(z.email({ error: "Please enter a valid e-mail address." })),
  budget: z.enum(BUDGETS, { error: "Please choose a budget." }),
  message: z
    .string()
    .trim()
    .min(20, { error: "Tell me a bit more: at least 20 characters." })
    .max(2000, { error: "Keep it under 2,000 characters." }),
  // Optional: a free slot from the date picker, checked again on the server
  call: z
    .string()
    .trim()
    .refine((value) => value === "" || isOpenSlot(value), {
      error: "That time isn't free any more. Please choose another one.",
    })
    .optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

// Hidden from people, filled in by most bots
export const HONEYPOT_FIELD = "company";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      fieldErrors: Partial<Record<ContactField, string>>;
      values: Partial<Record<ContactField, string>>;
    };

export const initialContactState: ContactState = { status: "idle" };
