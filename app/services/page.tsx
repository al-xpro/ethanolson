import type { Metadata } from "next";
import { ServicesPageView } from "@/components/cms/pages/services";
import { loadServices } from "@/lib/cms/load";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product design, interactive front ends, back ends and APIs, and performance: what Ethan Olson offers, and how he works.",
  alternates: { canonical: "/services", types: { "text/markdown": "/services.md" } },
};

export default async function ServicesPage() {
  const { content } = await loadServices();
  return <ServicesPageView content={content} />;
}
