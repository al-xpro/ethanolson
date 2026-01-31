"use client"

import { cn } from "@/lib/utils"

type Props = {
  name: string
  username: string
  avatar: string
  description: string
  className?: string
}

export function TestimonialCard({
  name,
  username,
  avatar,
  description,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex w-[90vw] sm:w-full max-w-sm xl:max-w-[20vw] flex-col gap-4 bg-[#0A0A0A] rounded-xl xl:rounded-[1.5vw] border xl:border-[0.1vw] border-[#2A2A2A] p-5 xl:p-[1.5vw]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 xl:gap-[0.5vw]">
        <img
          src={avatar}
          alt={name}
          className="h-10 xl:h-[2vw] w-10 xl:w-[2vw] rounded-full border xl:border-[0.1vw] border-[#2A2A2A]"
        />
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-white xl:text-[1.2vw]">{name}</span>
          <span className="text-sm xl:text-[1vw] text-white/80">
            @{username}
          </span>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm xl:text-[0.9vw] text-white leading-relaxed">
        {description}
      </p>
    </div>
  )
}
