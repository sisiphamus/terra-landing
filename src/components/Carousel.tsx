"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  caption: string;
  color: string;
  hoverColor: string;
}

const slides: Slide[] = [
  { src: "/images/20251004_144654.webp", caption: "I was refactoring my codebase", color: "#7A8B6F", hoverColor: "#A3B595" },
  { src: "/images/20251010_230345.webp", caption: "I was applying to jobs", color: "#C4956A", hoverColor: "#D4B08A" },
  { src: "/images/20251015_205903.webp", caption: "I was doing research", color: "#5C4033", hoverColor: "#8B6B5A" },
  { src: "/images/20251025_183812 (1).webp", caption: "I was writing my thesis", color: "#8B7355", hoverColor: "#B39B7A" },
  { src: "/images/20251026_022124.webp", caption: "I was scheduling meetings", color: "#4A5D3A", hoverColor: "#6E8A58" },
  { src: "/images/20251122_213844.webp", caption: "I was summarizing lecture notes", color: "#B47B56", hoverColor: "#C99A78" },
  { src: "/images/20251127_083555.webp", caption: "I was debugging a pipeline", color: "#6B7F5E", hoverColor: "#8FA882" },
  { src: "/images/20251214_163214.webp", caption: "I was drafting cold emails", color: "#9C7B5B", hoverColor: "#BDA07E" },
  { src: "/images/20251230_080722.webp", caption: "I was organizing my files", color: "#5A6B4A", hoverColor: "#7E9468" },
  { src: "/images/20260206_180352 (1).webp", caption: "I was deploying to production", color: "#A0805A", hoverColor: "#C4A57E" },
  { src: "/images/IMG-20251018-WA0062.webp", caption: "I was reviewing pull requests", color: "#6E8060", hoverColor: "#92A884" },
  { src: "/images/IMG-20251228-WA0106.webp", caption: "I was analyzing datasets", color: "#8A6E50", hoverColor: "#AD9272" },
  { src: "/images/IMG1186621390301352295.webp", caption: "I was filling out applications", color: "#4E6340", hoverColor: "#728C62" },
  { src: "/images/IMG2068871883117059041 (1).webp", caption: "I was building a landing page", color: "#7B6548", hoverColor: "#A08A6A" },
  { src: "/images/IMG_7475 (1).webp", caption: "I was catching up on emails", color: "#5B7050", hoverColor: "#7E9670" },
];

const rotations = [-1.8, 1.2, -0.6, 1.5, -1.1, 0.8, -1.3, 0.9, -0.4, 1.7, -1.0, 0.5, -1.6, 1.3, -0.7];

const loopedSlides = [...slides, ...slides];

export default function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const baseSpeedRef = useRef(1.75);
  const speedRef = useRef(1.75);
  const hoveredRef = useRef(false);
  const isMobileRef = useRef(false);

  const handleImgError = useCallback((idx: number) => {
    setImgErrors((prev) => new Set(prev).add(idx % slides.length));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    baseSpeedRef.current = isMobile ? 2 : 1.75;
    speedRef.current = baseSpeedRef.current;
    isMobileRef.current = isMobile;

    const measureHalf = () => {
      const children = track.children;
      let w = 0;
      for (let i = 0; i < slides.length; i++) {
        w += (children[i] as HTMLElement).offsetWidth + 28;
      }
      return w;
    };

    let halfWidth = 0;
    requestAnimationFrame(() => {
      halfWidth = measureHalf();
    });

    const tick = () => {
      const target = (!isMobileRef.current && hoveredRef.current) ? 1 : baseSpeedRef.current;
      speedRef.current += (target - speedRef.current) * 0.08;
      offsetRef.current += speedRef.current;
      if (halfWidth > 0 && offsetRef.current >= halfWidth) {
        offsetRef.current -= halfWidth;
      }
      track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    const handleResize = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      isMobileRef.current = mobile;
      baseSpeedRef.current = mobile ? 2 : 1.75;
      halfWidth = measureHalf();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onCardHover = useCallback((hovered: boolean) => {
    hoveredRef.current = hovered;
  }, []);

  return (
    <section className="w-full overflow-hidden py-4">
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
            onHover={onCardHover}
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
  onHover,
}: {
  slide: Slide;
  hasError: boolean;
  onImgError: () => void;
  rotation: number;
  onHover: (hovered: boolean) => void;
}) {
  const [hoverOrigin, setHoverOrigin] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverOrigin({ x, y });
    setIsHovered(true);
    onHover(true);
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHover(false);
  }, [onHover]);

  return (
    <div
      className="shrink-0 polaroid-shadow select-none relative"
      style={{
        width: 260,
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white p-3 pb-12 relative overflow-hidden" style={{ borderRadius: 2 }}>
        {/* Glow overlay on the polaroid frame (outside the image) */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${hoverOrigin.x}% ${hoverOrigin.y}%, ${slide.hoverColor}bb 0%, transparent 65%)`,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "scale(1)" : "scale(0.3)",
            transformOrigin: `${hoverOrigin.x}% ${hoverOrigin.y}%`,
            transition: isHovered
              ? "opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
              : "opacity 0.3s ease-in, transform 0.3s ease-in",
            WebkitMaskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
            WebkitMaskSize: "100% 100%, 100% 100%",
            WebkitMaskPosition: "0 0, 0 0",
            WebkitMaskComposite: "xor",
            maskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
            maskSize: "100% 100%, 100% 100%",
            maskComposite: "exclude",
            padding: "12px 12px 48px 12px",
            WebkitMaskOrigin: "content-box, border-box",
            maskOrigin: "content-box, border-box",
          }}
        />

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
