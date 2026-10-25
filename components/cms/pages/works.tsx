import { PageIntro } from "@/components/ui/PageIntro";
import { WorksList } from "@/components/pages/WorksList";
import type { WorksPage } from "@/lib/cms/model";
import type { WorkEntry } from "@/lib/cms/types";

export function WorksPageView({ content, works }: { content: WorksPage; works: WorkEntry[] }) {
  return (
    <>
      <PageIntro header={content.header} />
      <WorksList works={works} />
    </>
  );
}
