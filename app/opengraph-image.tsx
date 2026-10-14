import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          Concept portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 112, textTransform: "uppercase", lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 40, textTransform: "uppercase", letterSpacing: 8, opacity: 0.8 }}>
            {site.role}
          </div>
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
