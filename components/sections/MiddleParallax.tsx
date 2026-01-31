"use client";

import { useGSAP } from "@gsap/react";
import { animateWithGsap } from "@/lib/animation";
import { contentParallax, WaterRipple, WaterSpray, WavingWater } from "@/lib/data";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

export const MiddleParallax = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isPlaying = false;

    const safePlay = () => {
      if (isPlaying) return;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          isPlaying = true;
        }).catch(() => {
          // silently ignore autoplay race conditions
        });
      }
    };

    const safePause = () => {
      if (!isPlaying) return;
      video.pause();
      isPlaying = false;
    };

    ScrollTrigger.create({
      trigger: video,
      start: "top bottom",
      end: "bottom top",

      onEnter: () => {
        video.currentTime = 0;
        safePlay();
      },

      onEnterBack: () => {
        video.currentTime = 0;
        safePlay();
      },

      onLeave: () => {
        safePause();
        video.currentTime = 0;
      },

      onLeaveBack: () => {
        safePause();
        video.currentTime = 0;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useGSAP(() => {
    animateWithGsap(".g_grow", { scale: 1, opacity: 1, ease: "power1" }, { scrub: 5.5 });

    animateWithGsap(".g_text", { y: 0, opacity: 1, ease: "power2.inOut", duration: 1 });
  }, []);

  return (
    <section className="h-full sm:py-32 py-20 sm:px-10 px-5 relative">
      <div className="relative mx-auto">
        <div className="flex flex-col justify-center items-start">
          <div className="flex items-center justify-center flex-col sm:px-10 gap-5 xl:gap-[1vw]">
            <div className="relative h-[50vh] w-full flex items-center min-h-[300px]">
              <video
                playsInline={true}
                id="exploreVideo"
                className="w-full h-full object-cover object-center rounded-xl xl:rounded-[1.5vw] aspect-square"
                preload="none"
                muted
                ref={videoRef}
              >
                <source src={WaterRipple} type="video/mp4" />
              </video>
            </div>

            <div className="flex flex-col w-full relative">
              <div className="w-full flex flex-col md:flex-row gap-5 xl:gap-[1vw] items-center">
                <div className="flex-1 h-[50vh] overflow-hidden rounded-xl xl:rounded-[1.5vw]">
                  <img
                    src={WaterSpray}
                    alt="Water Spray"
                    className="w-full h-full object-cover object-center scale-150 opacity-0 g_grow"
                  />
                </div>
                <div className="flex-1 h-[50vh] overflow-hidden rounded-xl xl:rounded-[1.5vw]">
                  <img
                    src={WavingWater}
                    alt="Waving Water"
                    className="w-full h-full object-cover object-center scale-150 opacity-0 g_grow"
                  />
                </div>
              </div>

              <div className="w-full flex items-center justify-center flex-col md:flex-row mt-10 md:mt-16 gap-5">
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/80 text-lg md:text-xl xl:text-[2vw] font-light opacity-0 translate-y-[100px] g_text">
                    {contentParallax.firstContet}
                  </p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/80 text-lg md:text-xl xl:text-[2vw] font-light opacity-0 translate-y-[100px] g_text">
                    {contentParallax.secondContet}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
