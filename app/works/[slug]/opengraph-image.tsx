import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { works } from "@/content/works";

export const alt = `${site.name}: work`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = works.find((item) => item.slug === slug) ?? works[0];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 50% 35%, #2a2a2a, #0a0a0a 75%)",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 10, textTransform: "uppercase", opacity: 0.7 }}>
          {`${work.category} · Concept project`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 112, textTransform: "uppercase", lineHeight: 1 }}>
            {work.title}
          </div>
          <div style={{ fontSize: 36, opacity: 0.8, maxWidth: 900 }}>{work.summary}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: 0.6 }}>
          <span>Designed and developed by {site.creator.brand}</span>
          <span>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    size
  );
}
