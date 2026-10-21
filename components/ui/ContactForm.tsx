"use client";

import { Component, useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { contactLabels } from "@/content/ui";
import { CallPicker } from "@/components/ui/CallPicker";
import { submitContact } from "@/app/actions/contact";
import {
  BUDGETS,
  HONEYPOT_FIELD,
  contactSchema,
  initialContactState,
  type ContactField,
} from "@/lib/contact/schema";

// Only the bottom line reacts: it brightens on hover and turns solid on focus
const fieldClass =
  "w-full bg-transparent border-b border-white/30 py-3 text-lg xl:text-[1.3vw] text-white placeholder:text-white/40 outline-none transition-[border-color,box-shadow] duration-300 hover:border-white/70 focus:border-white focus:shadow-[0_1px_0_0_#fff] aria-[invalid=true]:border-[#ff8a80] aria-[invalid=true]:focus:shadow-[0_1px_0_0_#ff8a80]";
const labelClass = "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/70";

const FIELDS: ContactField[] = ["name", "email", "budget", "message", "call"];

type Errors = Partial<Record<ContactField, string>>;
type Values = Partial<Record<ContactField, string>>;

// What the visitor wrote, kept for this tab only, so a reload after a failed send loses nothing
const DRAFT_KEY = "contact-draft";

const readValues = (data: FormData): Values =>
  Object.fromEntries(FIELDS.map((field) => [field, String(data.get(field) ?? "")]));

const saveDraft = (values: Values | null) => {
  try {
    if (values) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
};

function validate(form: HTMLFormElement): Errors {
  const data = new FormData(form);
  const result = contactSchema.safeParse(readValues(data));
  if (result.success) return {};
  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    errors[field] ??= issue.message;
  }
  return errors;
}

/**
 * Sending can fail outright: offline, or the site was redeployed while this page was open,
 * so the action it was built with no longer exists. Instead of the error page, explain and
 * offer a reload; the message was saved before sending and comes back after it.
 */
class SendFailure extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="flex flex-col items-start gap-4 py-6 normal-case leading-normal">
        <p className="text-lg xl:text-[1.3vw] text-[#ff8a80]">{contactLabels.failed.text}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-full bg-white px-8 py-4 xl:px-[2vw] xl:py-[1vw] text-sm xl:text-[0.9vw] uppercase tracking-widest text-black hover:opacity-80"
        >
          {contactLabels.failed.reload}
        </button>
      </div>
    );
  }
}

export function ContactForm() {
  return (
    <SendFailure>
      <Form />
    </SendFailure>
  );
}

function Form() {
  // The server action itself, so the form also posts without JavaScript
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const formRef = useRef<HTMLFormElement>(null);
  // Client checks only start once React runs, so the form still works without JavaScript
  const [hydrated, setHydrated] = useState(false);
  const [clientErrors, setClientErrors] = useState<Errors>({});
  const [typing, setTyping] = useState<ContactField | null>(null);
  // Set when Send is pressed on an incomplete form: every error shows, and focus moves
  const [attempts, setAttempts] = useState(0);
  // A message saved before a failed send (see SendFailure)
  const [draft, setDraft] = useState<Values | null>(null);

  const serverErrors: Errors = state.status === "error" ? state.fieldErrors : {};
  const values: Values = state.status === "error" ? state.values : (draft ?? {});

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      // Runs once after hydration: the server can't know what this tab saved
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setDraft(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (state.status === "success") saveDraft(null);
  }, [state]);

  useEffect(() => {
    // Runs once after hydration; there's no earlier point to read the form
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    // Again when a saved message comes back, so Send unlocks for it
    if (formRef.current) setClientErrors(validate(formRef.current));
  }, [state, draft]);

  // After a failed submit (server or client), take the visitor to the first problem
  useEffect(() => {
    if (state.status !== "error" && attempts === 0) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state, attempts]);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-4 py-6 normal-case leading-normal">
        <p className="text-2xl xl:text-[2vw]">Thanks, your message is on its way.</p>
        <p className="text-base xl:text-[1.1vw] text-white/70">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  // Errors only show once Send has been pressed; from then on they follow the fields, but
  // never while one is being typed in. Without JavaScript, the server's errors show.
  const errorFor = (field: ContactField) => {
    if (typing === field) return undefined;
    if (attempts > 0) return clientErrors[field];
    return hydrated ? undefined : serverErrors[field];
  };

  const revalidate = () => {
    if (formRef.current) setClientErrors(validate(formRef.current));
  };

  const handleInput = (field: ContactField) => () => {
    setTyping(field);
    if (formRef.current) setClientErrors(validate(formRef.current));
  };

  const handleBlur = () => setTyping(null);

  const fieldProps = (field: ContactField) => {
    const error = errorFor(field);
    return {
      id: field,
      name: field,
      required: true,
      defaultValue: values[field],
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? `${field}-error` : undefined,
      onInput: handleInput(field),
      onChange: handleInput(field),
      onBlur: handleBlur,
      className: fieldClass,
    };
  };

  const error = (field: ContactField) => {
    const message = errorFor(field);
    return message ? (
      <p id={`${field}-error`} className="mt-2 text-sm xl:text-[0.9vw] text-[#ff8a80]">
        {message}
      </p>
    ) : null;
  };

  const isValid = Object.keys(clientErrors).length === 0;
  const locked = hydrated && !isValid;

  // Looks disabled until the form is valid, but stays clickable to explain what's missing
  const handleSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!locked) return;
    event.preventDefault();
    setTyping(null);
    setAttempts((count) => count + 1);
  };

  // Enter in a field doesn't send: only the button does (a new line still works in the message)
  const blockEnter = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && !(event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
    }
  };

  return (
    <form
      // React resets the form after every submit, and a <select> would fall back to its
      // first default. A new key remounts the form with the submitted values instead.
      key={JSON.stringify(values)}
      ref={formRef}
      action={formAction}
      onKeyDown={blockEnter}
      // Kept until it's sent, in case sending fails (see SendFailure)
      onSubmit={(event) => saveDraft(readValues(new FormData(event.currentTarget)))}
      noValidate
      className="group relative flex flex-col gap-8 xl:gap-[1.5vw] normal-case leading-normal"
    >
      <div className="grid gap-8 xl:gap-[1.5vw] md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input {...fieldProps("name")} autoComplete="name" />
          {error("name")}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail
          </label>
          <input {...fieldProps("email")} type="email" autoComplete="email" />
          {error("email")}
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={labelClass}>
          Budget
        </label>
        <select
          {...fieldProps("budget")}
          defaultValue={values.budget ?? ""}
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

      <CallPicker
        name="call"
        defaultValue={values.call}
        error={errorFor("call")}
        labelClass={labelClass}
        fieldClass={fieldClass}
        onChange={revalidate}
      />

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea {...fieldProps("message")} rows={5} className={`${fieldClass} resize-none`} />
        {error("message")}
      </div>

      {/* Honeypot: invisible to people and screen readers, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-sm xl:text-[0.9vw] text-white/60">
        {contactLabels.privacy.text}{" "}
        <Link href="/privacy" className="text-white underline underline-offset-4 hover:text-white/80">
          {contactLabels.privacy.link}
        </Link>
        .
      </p>

      {/* Until React runs, the browser's own checks (required, e-mail) dim the button, so it
          never flashes as ready on load. It still submits: the server validates too. */}
      <button
        type="submit"
        disabled={pending}
        tabIndex={locked ? -1 : 0}
        aria-disabled={locked}
        onClick={handleSend}
        className="self-start rounded-full bg-white px-8 py-4 xl:px-[2vw] xl:py-[1vw] cursor-pointer text-sm xl:text-[0.9vw] uppercase tracking-widest text-black transition-opacity duration-300 hover:opacity-80 disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 group-invalid:cursor-not-allowed group-invalid:opacity-40"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
