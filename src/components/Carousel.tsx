"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  caption: string;
  color: string;
}

const slides: Slide[] = [
  { src: "/images/20251004_144654.webp", caption: "I was refactoring my codebase", color: "#7A8B6F" },
  { src: "/images/20251010_230345.webp", caption: "I was applying to jobs", color: "#C4956A" },
  { src: "/images/20251015_205903.webp", caption: "I was doing research", color: "#5C4033" },
  { src: "/images/20251025_183812 (1).webp", caption: "I was writing my thesis", color: "#8B7355" },
  { src: "/images/20251026_022124.webp", caption: "I was scheduling meetings", color: "#4A5D3A" },
  { src: "/images/20251122_213844.webp", caption: "I was summarizing lecture notes", color: "#B47B56" },
  { src: "/images/20251127_083555.webp", caption: "I was debugging a pipeline", color: "#6B7F5E" },
  { src: "/images/20251214_163214.webp", caption: "I was drafting cold emails", color: "#9C7B5B" },
  { src: "/images/20251230_080722.webp", caption: "I was organizing my files", color: "#5A6B4A" },
  { src: "/images/20260206_180352 (1).webp", caption: "I was deploying to production", color: "#A0805A" },
  { src: "/images/IMG-20251018-WA0062.webp", caption: "I was reviewing pull requests", color: "#6E8060" },
  { src: "/images/IMG-20251228-WA0106.webp", caption: "I was analyzing datasets", color: "#8A6E50" },
  { src: "/images/IMG1186621390301352295.webp", caption: "I was filling out applications", color: "#4E6340" },
  { src: "/images/IMG2068871883117059041 (1).webp", caption: "I was building a landing page", color: "#7B6548" },
  { src: "/images/IMG_7475 (1).webp", caption: "I was catching up on emails", color: "#5B7050" },
];

const rotations = [-1.8, 1.2, -0.6, 1.5, -1.1, 0.8, -1.3, 0.9, -0.4, 1.7, -1.0, 0.5, -1.6, 1.3, -0.7];

// Duplicate slides for seamless infinite loop
const loopedSlides = [...slides, ...slides];

export default function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const speedRef = useRef(1.5); // pixels per frame
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
