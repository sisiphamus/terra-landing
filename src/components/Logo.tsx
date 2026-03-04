"use client";

export default function Logo() {
  return (
    <a href="/" aria-label="Terra home" className="flex items-center gap-3">
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer circle badge */}
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke="#5C4033"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r="17"
          stroke="#5C4033"
          strokeWidth="0.5"
          fill="none"
        />

        {/* Mountain silhouette */}
        <path
          d="M8 30 L16 16 L20 22 L24 14 L32 28 L36 30"
          fill="#4A5D3A"
          opacity="0.9"
        />
        <path
          d="M8 30 L14 20 L18 24 L22 16 L28 26 L36 30"
          fill="#5C4033"
          opacity="0.7"
        />

        {/* Sun */}
        <circle cx="32" cy="13" r="3" fill="#C4956A" />

        {/* Tree line */}
        <path
          d="M10 30 L12 26 L14 30 M16 30 L18 25 L20 30 M28 30 L30 27 L32 30"
          stroke="#4A5D3A"
          strokeWidth="1"
          fill="#4A5D3A"
          opacity="0.6"
        />

        {/* Ground line */}
        <line
          x1="6"
          y1="31"
          x2="38"
          y2="31"
          stroke="#5C4033"
          strokeWidth="1"
        />
      </svg>

      <span className="text-xl tracking-[0.25em] text-earth-dark font-semibold uppercase">
        Terra
      </span>
    </a>
  );
}
