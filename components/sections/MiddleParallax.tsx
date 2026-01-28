"use client";

import { MaskEntry } from "../ui/MaskEntry";

export default function MiddleParallax() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <MaskEntry
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
        leftText="EXPLORE"
        rightText="BEYOND"
      />
    </section>
  );
}
