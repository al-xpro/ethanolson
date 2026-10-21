import { CmsImage } from "@/components/cms/CmsImage";
import type { Work } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";

// Three images of the project, each in a card with its caption. The page makes them drift
// past at different speeds (.work-template).
export function WorkGallery({ items }: { items: Work["gallery"] }) {
  return (
    <>
      {items.map((item, index) => (
        <figure
          key={index}
          {...editable(item)}
          className="work-template flex flex-col gap-5 xl:gap-[1.2vw] rounded-2xl sm:rounded-3xl xl:rounded-[2vw] border border-white/15 bg-[#161616] p-5 sm:p-7 xl:p-[1.8vw] text-white"
        >
          <figcaption className="text-[10px] sm:text-xs xl:text-[0.75vw] tracking-[0.25rem] uppercase text-white/45">
            {item.caption}
          </figcaption>
          <CmsImage
            media={item.image}
            alt={item.image.alt || item.caption}
            sizes="(min-width: 640px) 30vw, 90vw"
            className="h-auto w-full rounded-lg xl:rounded-[0.6vw]"
          />
        </figure>
      ))}
    </>
  );
}
