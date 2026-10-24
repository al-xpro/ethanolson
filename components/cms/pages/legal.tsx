import { PageIntro } from "@/components/ui/PageIntro";
import { LegalView } from "@/components/pages/LegalView";
import type { LegalPage } from "@/lib/cms/model";

export function LegalPageView({ content }: { content: LegalPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <LegalView page={content} />
    </>
  );
}
