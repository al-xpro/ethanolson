import type { Metadata } from "next";
import { LegalPageView } from "@/components/cms/pages/legal";
import { loadTerms } from "@/lib/cms/load";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await loadTerms();
  return {
    title: content.header.title,
    description: "The terms for using this website.",
    alternates: {
      canonical: "/terms",
      types: { "text/markdown": "/terms.md" },
    },
  };
}

export default async function TermsPage() {
  const { content } = await loadTerms();
  return <LegalPageView content={content} />;
}
