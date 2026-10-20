import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { ServicesDetails } from "@/components/pages/ServicesDetails";
import { servicesPage } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product design, interactive front ends, back ends and APIs, and performance: what Ethan Olson offers, and how he works.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro header={servicesPage} />
      <ServicesDetails />
    </>
  );
}
