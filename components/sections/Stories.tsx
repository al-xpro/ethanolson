"use client";

import {
  FLoating1,
  FLoating10,
  FLoating11,
  FLoating2,
  FLoating3,
  FLoating4,
  FLoating5,
  FLoating6,
  FLoating7,
  FLoating8,
  FLoating9,
  FLoating12,
  FLoating13,
  FLoating14,
  FLoating15,
  FLoating16,
  FLoating17,
  FLoating18,
  FLoating19,
  FLoating20,
  storiesHeader,
  testimonials,
} from "@/lib/data";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import AnimatedHeaderSection from "../ui/AnimatedHeaderSection";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialCard } from "../ui/TweetCard";

gsap.registerPlugin(ScrollTrigger);

export default function Stories() {
  const plane1 = useRef<HTMLDivElement>(null);
  const plane2 = useRef<HTMLDivElement>(null);
  const plane3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // PLANE DEPTH
      gsap.to(".plane-1", { y: -120, scrollTrigger: { trigger: ".plane-1", scrub: true } });
      gsap.to(".plane-2", { y: -260, scrollTrigger: { trigger: ".plane-2", scrub: true } });
      gsap.to(".plane-3", { y: -420, scrollTrigger: { trigger: ".plane-3", scrub: true } });

      // FOREGROUND
      gsap.to(".img-a", { y: -80, scrollTrigger: { trigger: ".img-a", scrub: true } });
      gsap.to(".img-a2", { y: -140, scrollTrigger: { trigger: ".img-a2", scrub: true } });
      gsap.to(".img-b", { y: -100, scrollTrigger: { trigger: ".img-b", scrub: true } });
      gsap.to(".img-g", { y: -90, scrollTrigger: { trigger: ".img-g", scrub: true } });
      gsap.to(".img-h", { y: 110, scrollTrigger: { trigger: ".img-h", scrub: true } });
      gsap.to(".img-i", { y: -75, scrollTrigger: { trigger: ".img-i", scrub: true } });

      // MID
      gsap.to(".img-c", { y: 120, scrollTrigger: { trigger: ".img-c", scrub: true } });
      gsap.to(".img-c2", { y: -160, scrollTrigger: { trigger: ".img-c2", scrub: true } });
      gsap.to(".img-d", { y: -200, scrollTrigger: { trigger: ".img-d", scrub: true } });
      gsap.to(".img-j", { y: 150, scrollTrigger: { trigger: ".img-j", scrub: true } });
      gsap.to(".img-k", { y: -120, scrollTrigger: { trigger: ".img-k", scrub: true } });
      gsap.to(".img-l", { y: 180, scrollTrigger: { trigger: ".img-l", scrub: true } });

      gsap.to(".img-center", {
        y: 220,
        scale: 1.08,
        scrollTrigger: { trigger: ".img-center", scrub: true },
      });

      gsap.to(".img-center-lg", {
        y: 340,
        scale: 1.12,
        scrollTrigger: { trigger: ".img-center-lg", scrub: true },
      });

      // BACKGROUND
      gsap.to(".img-e", { y: -260, scrollTrigger: { trigger: ".img-e", scrub: true } });
      gsap.to(".img-e2", { y: 200, scrollTrigger: { trigger: ".img-e2", scrub: true } });
      gsap.to(".img-f", { y: -320, scrollTrigger: { trigger: ".img-f", scrub: true } });
      gsap.to(".img-m", { y: -240, scrollTrigger: { trigger: ".img-m", scrub: true } });
      gsap.to(".img-n", { y: 280, scrollTrigger: { trigger: ".img-n", scrub: true } });
      gsap.to(".img-o", { y: -300, scrollTrigger: { trigger: ".img-o", scrub: true } });
    });

    return () => ctx.revert();
  }, []);

  let requestAnimationFrameId: number | null = null;

  let xForce = 0;

  let yForce = 0;

  const easing = 0.08;

  const speed = 0.01;

  const manageMouseMove = (e: MouseEvent) => {
    const { movementX, movementY } = e;

    xForce += movementX * speed;

    yForce += movementY * speed;

    if (requestAnimationFrameId == null) {
      requestAnimationFrameId = requestAnimationFrame(animate);
    }
  };

  const lerp = ({ start, target, amount }: { start: number; target: number; amount: number }) =>
    start * (1 - amount) + target * amount;

  const animate = () => {
    xForce = lerp({ start: xForce, target: 0, amount: easing });

    yForce = lerp({ start: yForce, target: 0, amount: easing });

    gsap.set(plane1.current, { x: `+=${xForce}`, y: `+=${yForce}` });

    gsap.set(plane2.current, { x: `+=${xForce * 0.5}`, y: `+=${yForce * 0.5}` });

    gsap.set(plane3.current, { x: `+=${xForce * 0.25}`, y: `+=${yForce * 0.25}` });

    if (Math.abs(xForce) < 0.01) xForce = 0;

    if (Math.abs(yForce) < 0.01) yForce = 0;

    if (xForce != 0 || yForce != 0) {
      requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestAnimationFrameId as number);

      requestAnimationFrameId = null;
    }
  };

  return (
    <section
      onMouseMove={(e) => {
        manageMouseMove(e as any);
      }}
      className="relative h-full min-w-[320px]"
      id="stories"
    >
      <AnimatedHeaderSection
        title={storiesHeader.title}
        subTitle={storiesHeader.subTitle}
        text={storiesHeader.text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="h-screen w-full relative -z-1">
        {/* PLANE 1 */}
        <div
          ref={plane1}
          className="plane plane-1 absolute inset-0 z-30 overflow-visible will-change-transform"
        >
          <div className="float img-b absolute left-[65%] top-[20%] will-change-transform">
            <TestimonialCard {...testimonials[0]} />
          </div>

          <div className="float img-center absolute left-[40%] top-[30%] -translate-x-1/2 will-change-transform">
            <TestimonialCard {...testimonials[1]} />
          </div>

          <div className="float img-a absolute left-[20%] top-[20%] will-change-transform">
            <TestimonialCard {...testimonials[2]} />
          </div>

          <div className="float img-a2 absolute left-[18%] top-[75%] will-change-transform">
            <TestimonialCard {...testimonials[3]} />
          </div>

          <div className="float img-g absolute left-[55%] top-[50%] will-change-transform">
            <TestimonialCard {...testimonials[4]} />
          </div>

          <div className="float img-h absolute right-[5%] top-[55%] will-change-transform">
            <TestimonialCard {...testimonials[5]} />
          </div>
        </div>

        {/* PLANE 2 */}
        <div
          ref={plane2}
          className="plane plane-2 absolute inset-0 z-20 brightness-[0.7] will-change-transform"
        >
          <div className="float img-c absolute left-[10%] top-[30%] will-change-transform">
            <TestimonialCard {...testimonials[6]} />
          </div>

          <div className="float img-center-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform">
            <TestimonialCard {...testimonials[7]} />
          </div>

          <div className="float img-d absolute left-[45%] top-[45%] will-change-transform">
            <TestimonialCard {...testimonials[8]} />
          </div>

          <div className="float img-c2 absolute left-[47%] top-[20%] will-change-transform">
            <TestimonialCard {...testimonials[9]} />
          </div>

          <div className="float img-j absolute right-[10%] top-[30%] will-change-transform">
            <TestimonialCard {...testimonials[10]} />
          </div>

          <div className="float img-k absolute left-[5%] top-[20%] will-change-transform">
            <TestimonialCard {...testimonials[11]} />
          </div>

          <div className="float img-l absolute left-[65%] top-[75%] will-change-transform">
            <TestimonialCard {...testimonials[12]} />
          </div>
        </div>

        {/* PLANE 3 */}
        <div
          ref={plane3}
          className="plane plane-3 absolute inset-0 z-10 brightness-[0.4] will-change-transform"
        >

          <div className="float img-e absolute left-[15%] top-[75%] will-change-transform">
            <TestimonialCard {...testimonials[13]} />
          </div>

          <div className="float img-f absolute left-[60%] top-[25%] will-change-transform">
            <TestimonialCard {...testimonials[14]} />
          </div>

          <div className="float img-e2 absolute left-[50%] top-[85%] -translate-x-1/2 will-change-transform">
            <TestimonialCard {...testimonials[15]} />
          </div>

          <div className="float img-m absolute left-[30%] top-[25%] will-change-transform">
            <TestimonialCard {...testimonials[16]} />
          </div>

          <div className="float img-n absolute right-[25%] top-[70%] will-change-transform">
            <TestimonialCard {...testimonials[17]} />
          </div>

          <div className="float img-o absolute right-[38%] top-[50%] will-change-transform">
            <TestimonialCard {...testimonials[18]} />
          </div>

          <div className="float img-i absolute left-[70%] top-[20%] will-change-transform">
            <TestimonialCard {...testimonials[19]} />
          </div>
        </div>
      </div>
    </section>
  );
}
