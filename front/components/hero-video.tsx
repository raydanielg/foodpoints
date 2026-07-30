"use client"

import * as React from "react"
import Image from "next/image"
import { PlayIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function HeroVideo() {
  const [playing, setPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setPlaying(true)
    setTimeout(() => {
      videoRef.current?.play()
    }, 100)
  }

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border shadow-2xl">
      {/* Video element */}
      <video
        ref={videoRef}
        className={cn(
          "aspect-video w-full object-cover transition-opacity duration-500",
          playing ? "opacity-100" : "opacity-0"
        )}
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero-demo.mp4" type="video/mp4" />
      </video>

      {/* Poster image with play button */}
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label="Play video"
        >
          <Image
            src="/images/3394.jpg"
            alt="Restaurant dining experience"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />

          {/* Play button */}
          <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-white/90 shadow-2xl backdrop-blur transition-all group-hover:scale-110 group-hover:bg-white sm:size-20">
            <PlayIcon className="ml-1 size-7 fill-primary text-primary sm:size-9" />
          </div>

          {/* Label */}
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            See FoodPoint in action
          </span>
        </button>
      )}
    </div>
  )
}
