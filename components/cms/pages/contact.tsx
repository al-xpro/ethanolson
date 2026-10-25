import { PageIntro } from "@/components/ui/PageIntro";
import { ContactView } from "@/components/pages/ContactView";
import type { ContactPage } from "@/lib/cms/model";

export function ContactPageView({ content }: { content: ContactPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <ContactView content={content} />
    </>
  );
}
