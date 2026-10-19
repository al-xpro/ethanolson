import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { WorksList } from "@/components/pages/WorksList";
import { worksPage } from "@/content/works";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Five projects by Ethan Olson: a logistics dashboard, healthcare booking, headless e-commerce, an editorial platform and fintech onboarding.",
  alternates: { canonical: "/works", types: { "text/markdown": "/works.md" } },
};

export default function WorksPage() {
  return (
    <>
      <PageIntro header={worksPage} />
      <WorksList />
    </>
  );
}
