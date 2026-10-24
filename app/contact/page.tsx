import type { Metadata } from "next";
import { ContactPageView } from "@/components/cms/pages/contact";
import { loadContact } from "@/lib/cms/load";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell Ethan Olson about your product: a short form, or an e-mail.",
  alternates: { canonical: "/contact", types: { "text/markdown": "/contact.md" } },
};

export default async function ContactPage() {
  const { content } = await loadContact();
  return <ContactPageView content={content} />;
}
