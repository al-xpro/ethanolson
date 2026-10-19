import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { LegalView } from "@/components/pages/LegalView";
import { termsPage } from "@/content/legal";

export const metadata: Metadata = {
  title: termsPage.title,
  description: "The terms for using this website.",
  alternates: { canonical: "/terms", types: { "text/markdown": "/terms.md" } },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro header={termsPage} />
      <LegalView page={termsPage} />
    </>
  );
}
