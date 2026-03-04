"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  caption: string;
  color: string;
}

// Placeholder slides — drop your images in /public/images/
const slides: Slide[] = [
  { src: "/images/1.jpg", caption: "While it works, you live", color: "#7A8B6F" },
  { src: "/images/2.jpg", caption: "Emails handled before coffee", color: "#C4956A" },
  { src: "/images/3.jpg", caption: "Schedules that build themselves", color: "#5C4033" },
  { src: "/images/4.jpg", caption: "Research done by morning", color: "#8B7355" },
  { src: "/images/5.jpg", caption: "One agent, everything covered", color: "#4A5D3A" },
  { src: "/images/6.jpg", caption: "Your time is yours again", color: "#B47B56" },
];

const rotations = [-1.8, 1.2, -0.6, 1.5, -1.1, 0.8];

// Duplicate slides for seamless infinite loop
const loopedSlides = [...slides, ...slides];

export default function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const speedRef = useRef(0.5); // pixels per frame
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  const handleImgError = useCallback((idx: number) => {
    setImgErrors((prev) => new Set(prev).add(idx % slides.length));
  }, []);

  // Continuous scroll animation
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure half the track (one full set of slides)
    const measureHalf = () => {
      const children = track.children;
      let w = 0;
      for (let i = 0; i < slides.length; i++) {
        w += (children[i] as HTMLElement).offsetWidth + 28; // 28px gap
      }
      return w;
    };

    let halfWidth = 0;
    // Wait a frame for layout
    requestAnimationFrame(() => {
      halfWidth = measureHalf();
    });

    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current += speedRef.current;
        // Reset when we've scrolled past the first set
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        }
        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    const handleResize = () => {
      halfWidth = measureHalf();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      className="w-full overflow-hidden py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        // Resume after a short delay so it doesn't jerk
        setTimeout(() => setPaused(false), 2000);
      }}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: 28 }}
      >
        {loopedSlides.map((slide, i) => (
          <PolaroidCard
            key={i}
            slide={slide}
            hasError={imgErrors.has(i % slides.length)}
            onImgError={() => handleImgError(i)}
            rotation={rotations[i % rotations.length]}
          />
        ))}
      </div>
    </section>
  );
}

function PolaroidCard({
  slide,
  hasError,
  onImgError,
  rotation,
}: {
  slide: Slide;
  hasError: boolean;
  onImgError: () => void;
  rotation: number;
}) {
  return (
    <div
      className="shrink-0 polaroid-shadow select-none"
      style={{
        width: 260,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="bg-white p-3 pb-12 relative">
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "4/5",
            backgroundColor: slide.color,
          }}
        >
          {!hasError ? (
            <Image
              src={slide.src}
              alt={slide.caption}
              fill
              sizes="260px"
              className="object-cover"
              draggable={false}
              onError={onImgError}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${slide.color}dd, ${slide.color}88)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5F0E8"
                  strokeWidth="1"
                  className="opacity-40"
                >
                  <path d="M21 15l-5-5L5 21" />
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <p className="absolute bottom-3 left-3 right-3 text-center text-xs tracking-[0.1em] text-earth-brown/70 italic">
          {slide.caption}
        </p>
      </div>
    </div>
  );
}
