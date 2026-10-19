"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";
import type { Media } from "@/lib/cms/fields";

// Storyblok resizes and compresses its own images: /m/<width>x0 returns the width asked for
const storyblokLoader: ImageLoader = ({ src, width, quality }) => `${src}/m/${width}x0/filters:quality(${quality ?? 75})`;

/** An image from the content: a file in public/ or an asset in Storyblok, with its size and blur preview */
export function CmsImage({
  media,
  alt,
  ...props
}: Omit<ImageProps, "src" | "width" | "height" | "alt" | "placeholder" | "blurDataURL" | "fill"> & {
  media: Media;
  alt?: string;
}) {
  const remote = media.src.startsWith("https://a.storyblok.com/");
  const svg = /\.svg$/i.test(media.src);
  return (
    <Image
      src={media.src}
      width={media.width || 1600}
      height={media.height || 1000}
      alt={alt ?? media.alt}
      placeholder={media.blurDataURL ? "blur" : "empty"}
      blurDataURL={media.blurDataURL}
      loader={remote && !svg ? storyblokLoader : undefined}
      // Vector art is sent as it is
      unoptimized={svg}
      {...props}
    />
  );
}
