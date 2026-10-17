"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/app/actions/contact";
import {
  BUDGETS,
  HONEYPOT_FIELD,
  initialContactState,
  type ContactField,
} from "@/lib/contact/schema";

const fieldClass =
  "w-full bg-transparent border-b border-white/30 py-3 text-lg xl:text-[1.3vw] text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors aria-[invalid=true]:border-[#ff8a80]";
const labelClass = "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/70";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};

  // After a failed submit, take the visitor to the first problem
  useEffect(() => {
    if (state.status !== "error") return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-4 py-6 normal-case leading-normal">
        <p className="text-2xl xl:text-[2vw]">Thanks, your message is on its way.</p>
        <p className="text-base xl:text-[1.1vw] text-white/70">
          This is a concept site: messages reach the AlxPro studio.
        </p>
      </div>
    );
  }

  const describedBy = (field: ContactField) => (errors[field] ? `${field}-error` : undefined);

  const error = (field: ContactField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-2 text-sm xl:text-[0.9vw] text-[#ff8a80]">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      // React resets the form after every submit, and a <select> would fall back to its
      // first default. A new key remounts the form with the submitted values instead.
      key={state.status === "error" ? JSON.stringify(state.values) : "empty"}
      ref={formRef}
      action={formAction}
      noValidate
      className="relative flex flex-col gap-8 xl:gap-[1.5vw] normal-case leading-normal"
      aria-describedby="contact-note"
    >
      <div className="grid gap-8 xl:gap-[1.5vw] md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={fieldClass}
          />
          {error("name")}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={fieldClass}
          />
          {error("email")}
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={labelClass}>
          Budget
        </label>
        <select
          id="budget"
          name="budget"
          required
          defaultValue={values.budget ?? ""}
          aria-invalid={Boolean(errors.budget)}
          aria-describedby={describedBy("budget")}
          className={`${fieldClass} [&>option]:bg-black`}
        >
          <option value="" disabled>
            Choose a range
          </option>
          {BUDGETS.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
        {error("budget")}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          className={`${fieldClass} resize-y`}
        />
        {error("message")}
      </div>

      {/* Honeypot: invisible to people and screen readers, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 xl:gap-[1.5vw]">
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-white px-8 py-4 xl:px-[2vw] xl:py-[1vw] text-sm xl:text-[0.9vw] uppercase tracking-widest text-black transition-opacity duration-300 hover:opacity-80 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
        <p id="contact-note" className="text-sm xl:text-[0.9vw] text-white/60">
          Concept site: messages reach the AlxPro studio.
        </p>
      </div>
    </form>
  );
}
