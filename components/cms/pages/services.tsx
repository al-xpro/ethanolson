import { PageIntro } from "@/components/ui/PageIntro";
import { ServicesDetails } from "@/components/pages/ServicesDetails";
import type { ServicesPage } from "@/lib/cms/model";

export function ServicesPageView({ content }: { content: ServicesPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <ServicesDetails content={content} />
    </>
  );
}
