"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Slide {
  src: string;
  caption: string;
  color: string;
}

// Placeholder slides — drop your images in /public/images/
const slides: Slide[] = [
  { src: "/images/1.jpg", caption: "The open road", color: "#7A8B6F" },
  { src: "/images/2.jpg", caption: "Morning light", color: "#C4956A" },
  { src: "/images/3.jpg", caption: "Still waters", color: "#5C4033" },
  { src: "/images/4.jpg", caption: "High country", color: "#8B7355" },
  { src: "/images/5.jpg", caption: "Wild coast", color: "#4A5D3A" },
  { src: "/images/6.jpg", caption: "Golden hour", color: "#B47B56" },
];

const rotations = [-1.8, 1.2, -0.6, 1.5, -1.1, 0.8];

const swipeVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
  }),
};

export default function Carousel() {
  const [[activeIndex, direction], setPage] = useState([0, 0]);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(autoplay);
  autoplayRef.current = autoplay;

  const paginate = useCallback(
    (newDir: number) => {
      setPage(([prev]) => {
        const next = (prev + newDir + slides.length) % slides.length;
        return [next, newDir];
      });
    },
    []
  );

  const goTo = useCallback((idx: number) => {
    setPage(([prev]) => [idx, idx > prev ? 1 : -1]);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      if (autoplayRef.current) paginate(1);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay, paginate]);

  // Pause autoplay on interaction, resume after 10s
  const pauseAutoplay = useCallback(() => {
    setAutoplay(false);
    const timer = setTimeout(() => setAutoplay(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleImgError = useCallback((idx: number) => {
    setImgErrors((prev) => new Set(prev).add(idx));
  }, []);

  // Swipe detection
  const dragStartX = useRef(0);

  // Visible cards: show prev, current, next for context on desktop
  const prevIdx = (activeIndex - 1 + slides.length) % slides.length;
  const nextIdx = (activeIndex + 1) % slides.length;

  return (
    <section className="w-full py-4">
      {/* Main carousel area */}
      <div className="relative flex items-center justify-center px-4 sm:px-12">
        {/* Prev button */}
        <button
          onClick={() => {
            paginate(-1);
            pauseAutoplay();
          }}
          className="hidden sm:flex absolute left-4 lg:left-12 z-10 w-10 h-10 items-center justify-center
            bg-earth-cream/80 border border-earth-brown/15 rounded-full
            hover:bg-earth-sand transition-colors"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5C4033" strokeWidth="1.5">
            <path d="M10 3L5 8L10 13" />
          </svg>
        </button>

        {/* Cards container */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-4xl mx-auto overflow-hidden">
          {/* Side card left - hidden on mobile */}
          <div className="hidden lg:block shrink-0 opacity-40 scale-90 -rotate-2">
            <PolaroidCard
              slide={slides[prevIdx]}
              hasError={imgErrors.has(prevIdx)}
              onImgError={() => handleImgError(prevIdx)}
              rotation={rotations[prevIdx % rotations.length]}
              size="small"
            />
          </div>

          {/* Center card with animation */}
          <div
            className="relative shrink-0"
            style={{ width: 280, height: 400 }}
            onPointerDown={(e) => {
              dragStartX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              const diff = e.clientX - dragStartX.current;
              if (Math.abs(diff) > 50) {
                paginate(diff < 0 ? 1 : -1);
                pauseAutoplay();
              }
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={swipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <PolaroidCard
                  slide={slides[activeIndex]}
                  hasError={imgErrors.has(activeIndex)}
                  onImgError={() => handleImgError(activeIndex)}
                  rotation={rotations[activeIndex % rotations.length]}
                  size="large"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side card right - hidden on mobile */}
          <div className="hidden lg:block shrink-0 opacity-40 scale-90 rotate-2">
            <PolaroidCard
              slide={slides[nextIdx]}
              hasError={imgErrors.has(nextIdx)}
              onImgError={() => handleImgError(nextIdx)}
              rotation={rotations[nextIdx % rotations.length]}
              size="small"
            />
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={() => {
            paginate(1);
            pauseAutoplay();
          }}
          className="hidden sm:flex absolute right-4 lg:right-12 z-10 w-10 h-10 items-center justify-center
            bg-earth-cream/80 border border-earth-brown/15 rounded-full
            hover:bg-earth-sand transition-colors"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5C4033" strokeWidth="1.5">
            <path d="M6 3L11 8L6 13" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goTo(i);
              pauseAutoplay();
            }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 h-2 bg-earth-tan"
                : "w-2 h-2 bg-earth-brown/25 hover:bg-earth-brown/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
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
  size,
}: {
  slide: Slide;
  hasError: boolean;
  onImgError: () => void;
  rotation: number;
  size: "small" | "large";
}) {
  const w = size === "large" ? 280 : 220;

  return (
    <div
      className="polaroid-shadow select-none"
      style={{
        width: w,
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
              sizes={`${w}px`}
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
