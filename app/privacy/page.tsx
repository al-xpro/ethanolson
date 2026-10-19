import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { LegalView } from "@/components/pages/LegalView";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: "What personal data this website collects, why, and your rights.",
  alternates: { canonical: "/privacy", types: { "text/markdown": "/privacy.md" } },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro header={privacyPolicy} />
      <LegalView page={privacyPolicy} />
    </>
  );
}
