"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";
import Image from "next/image";

interface Slide {
  src: string;
  caption: string;
  color: string; // fallback gradient color
}

// Placeholder slides — swap src with your real images in /public/images/
const slides: Slide[] = [
  { src: "/images/1.jpg", caption: "The open road", color: "#7A8B6F" },
  { src: "/images/2.jpg", caption: "Morning light", color: "#C4956A" },
  { src: "/images/3.jpg", caption: "Still waters", color: "#5C4033" },
  { src: "/images/4.jpg", caption: "High country", color: "#8B7355" },
  { src: "/images/5.jpg", caption: "Wild coast", color: "#4A5D3A" },
  { src: "/images/6.jpg", caption: "Golden hour", color: "#B47B56" },
];

const CARD_W = 280;
const CARD_GAP = 24;
const CARD_TOTAL = CARD_W + CARD_GAP;

// Random but deterministic rotations for each card
const rotations = [-1.8, 1.2, -0.6, 1.5, -1.1, 0.8];

export default function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth);
        setContainerWidth(trackRef.current.parentElement?.offsetWidth ?? 0);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const dragConstraint = -(trackWidth - containerWidth + 40);

  const handleImgError = useCallback((idx: number) => {
    setImgErrors((prev) => new Set(prev).add(idx));
  }, []);

  // Auto-advance every 5s
  const [autoplay, setAutoplay] = useState(true);
  const currentIdx = useRef(0);

  useEffect(() => {
    if (!autoplay || trackWidth === 0) return;
    const interval = setInterval(() => {
      currentIdx.current = (currentIdx.current + 1) % slides.length;
      const target = Math.max(
        dragConstraint,
        -(currentIdx.current * CARD_TOTAL)
      );
      animate(x, target, {
        type: "spring",
        stiffness: 80,
        damping: 20,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, trackWidth, dragConstraint, x]);

  return (
    <section className="w-full overflow-hidden py-4">
      <div className="relative">
        <motion.div
          ref={trackRef}
          className="flex cursor-grab active:cursor-grabbing px-6 sm:px-12 lg:px-20"
          style={{ x, gap: CARD_GAP }}
          drag="x"
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          onDragStart={() => setAutoplay(false)}
        >
          {slides.map((slide, i) => (
            <PolaroidCard
              key={i}
              slide={slide}
              index={i}
              rotation={rotations[i % rotations.length]}
              hasError={imgErrors.has(i)}
              onImgError={() => handleImgError(i)}
              parentX={x}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PolaroidCard({
  slide,
  index,
  rotation,
  hasError,
  onImgError,
  parentX,
}: {
  slide: Slide;
  index: number;
  rotation: number;
  hasError: boolean;
  onImgError: () => void;
  parentX: MotionValue<number>;
}) {
  // Parallax-like opacity based on scroll position
  const cardCenter = index * CARD_TOTAL + CARD_W / 2;
  const opacity = useTransform(
    parentX,
    [-(cardCenter + CARD_W), -cardCenter, -(cardCenter - CARD_W * 2)],
    [0.5, 1, 0.5]
  );

  const scale = useTransform(
    parentX,
    [-(cardCenter + CARD_W), -cardCenter, -(cardCenter - CARD_W * 2)],
    [0.92, 1, 0.92]
  );

  return (
    <motion.div
      className="shrink-0 polaroid-shadow"
      style={{
        width: CARD_W,
        rotate: rotation,
        opacity,
        scale,
      }}
    >
      <div className="bg-white p-3 pb-12 relative">
        {/* Image area */}
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
              sizes="280px"
              className="object-cover"
              loading={index < 3 ? "eager" : "lazy"}
              onError={onImgError}
            />
          ) : (
            /* Gradient placeholder when image not found */
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

        {/* Caption */}
        <p className="absolute bottom-3 left-3 right-3 text-center text-xs tracking-[0.1em] text-earth-brown/70 italic">
          {slide.caption}
        </p>
      </div>
    </motion.div>
  );
}
