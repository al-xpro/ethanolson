import { WorkDetail } from "@/components/pages/WorkDetail";
import type { WorkEntry } from "@/lib/cms/types";

export function WorkPage({ work, next }: { work: WorkEntry; next: WorkEntry }) {
  return <WorkDetail work={work} next={next} />;
}
