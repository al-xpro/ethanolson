"use client";

import { useRef } from "react";
import { CmsImage, mediaSrc } from "@/components/cms/CmsImage";
import { animateWithGsap } from "@/lib/animation";
import type { Home } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

export const MiddleParallax = ({ content }: { content: Home["middle"] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        animateWithGsap(".g_grow", { scale: 1, opacity: 1, ease: "power1" }, { scrub: 5.5 });
        animateWithGsap(".g_text", { y: 0, opacity: 1, ease: "power2.inOut", duration: 1 });
      });

      const video = videoRef.current;
      if (!video) return;

      let isPlaying = false;

      const safePlay = () => {
        if (isPlaying) return;
        video
          .play()
          .then(() => {
            isPlaying = true;
          })
          .catch(() => {
            // silently ignore autoplay race conditions
          });
      };

      const restart = () => {
        video.currentTime = 0;
        safePlay();
      };

      const stop = () => {
        if (isPlaying) {
          video.pause();
          isPlaying = false;
        }
        video.currentTime = 0;
      };

      // Created inside useGSAP, so only this trigger is killed on unmount
      ScrollTrigger.create({
        trigger: video,
        start: "top bottom",
        end: "bottom top",
        onEnter: restart,
        onEnterBack: restart,
        onLeave: stop,
        onLeaveBack: stop,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} {...editable(content)} className="h-full sm:py-32 py-20 sm:px-10 px-5 relative">
      <div className="relative mx-auto">
        <div className="flex flex-col justify-center items-start">
          <div className="flex items-center justify-center flex-col sm:px-10 gap-5 xl:gap-[1vw]">
            <div className="relative h-[50vh] w-full flex items-center min-h-[300px]">
              <video
                playsInline
                className="w-full h-full object-cover object-center rounded-xl xl:rounded-[1.5vw] aspect-square"
                preload="none"
                poster={mediaSrc(content.poster, 1280)}
                muted
                aria-hidden
                ref={videoRef}
              >
                <source key={content.video.src} src={content.video.src} type="video/mp4" />
              </video>
            </div>

            <div className="flex flex-col w-full relative">
              <div className="w-full flex flex-col md:flex-row gap-5 xl:gap-[1vw] items-center">
                {content.images.map((picture, index) => (
                  <div
                    key={index}
                    className="relative flex-1 w-full h-[50vh] overflow-hidden rounded-xl xl:rounded-[1.5vw]"
                  >
                    <CmsImage
                      media={picture}
                      alt=""
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="h-full w-full object-cover object-center scale-150 opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100 g_grow"
                    />
                  </div>
                ))}
              </div>

              <div className="w-full flex items-center justify-center flex-col md:flex-row mt-10 md:mt-16 gap-5">
                {[content.firstText, content.secondText].map((text, index) => (
                  <div key={index} className="flex-1 flex items-center justify-center">
                    <p className="text-white/80 text-lg md:text-xl xl:text-[2vw] font-light opacity-0 translate-y-[100px] motion-reduce:opacity-100 motion-reduce:translate-y-0 g_text">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
