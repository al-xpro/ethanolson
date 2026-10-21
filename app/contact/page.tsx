import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactView } from "@/components/pages/ContactView";
import { contactHeader } from "@/content/sections";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell Ethan Olson about your product: a short form, or an e-mail.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageIntro header={contactHeader} />
      <ContactView />
    </>
  );
}
