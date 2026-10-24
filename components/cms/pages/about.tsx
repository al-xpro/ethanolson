import { PageIntro } from "@/components/ui/PageIntro";
import { AboutView } from "@/components/pages/AboutView";
import type { AboutPage } from "@/lib/cms/model";

export function AboutPageView({ content }: { content: AboutPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <AboutView content={content} />
    </>
  );
}
