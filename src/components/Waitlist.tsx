"use client";

import { useState, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [sealed, setSealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setSealed(true);

    await new Promise((r) => setTimeout(r, 1200));

    try {
      const existing = JSON.parse(localStorage.getItem("waitlist") || "[]");
      if (!existing.includes(email.toLowerCase())) {
        existing.push(email.toLowerCase());
        localStorage.setItem("waitlist", JSON.stringify(existing));
      }
      setStatus("success");
      setMessage("You're in. We'll reach out soon.");
      setEmail("");
    } catch {
      setSealed(false);
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="w-full max-w-[340px]">
      <p className="text-xs tracking-[0.2em] uppercase text-earth-brown/50 mb-4">
        Early Access
      </p>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            {/* Sealed envelope look */}
            <div className="bg-white/60 backdrop-blur-sm border border-earth-brown/10 p-6 relative">
              {/* Wax seal */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-earth-tan flex items-center justify-center shadow-md">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5F0E8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <p className="text-center text-sm text-earth-dark/70 mt-3 leading-relaxed">
                {message}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative"
          >
            {/* Polaroid-style card for the input */}
            <div className="bg-white polaroid-shadow p-4 pb-6 relative">
              {/* Subtle lined paper texture */}
              <div className="absolute inset-x-4 top-4 bottom-6 pointer-events-none opacity-[0.07]">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="border-b border-earth-deep"
                    style={{ height: "22px" }}
                  />
                ))}
              </div>

              {/* Input field — no border, just a bottom line like writing */}
              <input
                ref={inputRef}
                type="email"
                required
                placeholder="your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                className="relative z-10 w-full bg-transparent border-0 border-b border-earth-brown/20
                  py-2 text-sm text-earth-deep placeholder:text-earth-brown/30
                  focus:outline-none focus:border-earth-tan transition-colors
                  disabled:opacity-50"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontStyle: "italic",
                }}
              />

              {/* Caption area like polaroid bottom */}
              <p className="mt-3 text-[10px] tracking-[0.15em] text-earth-brown/40 italic">
                we let people in gradually
              </p>
            </div>

            {/* Seal / Submit button */}
            <div className="flex justify-center -mt-4 relative z-10">
              <motion.button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                animate={
                  sealed
                    ? { scale: [1, 0.85, 1.1, 1], rotate: [0, -5, 5, 0] }
                    : {}
                }
                transition={
                  sealed
                    ? { duration: 0.6, ease: "easeInOut" }
                    : { type: "spring", stiffness: 400, damping: 15 }
                }
                className="w-14 h-14 rounded-full bg-earth-dark flex items-center justify-center
                  shadow-lg hover:bg-earth-deep transition-colors
                  disabled:opacity-30 disabled:cursor-not-allowed
                  border-2 border-earth-cream"
              >
                {status === "loading" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-earth-cream/30 border-t-earth-cream rounded-full"
                  />
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F5F0E8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[10px] text-red-700/60 mt-2"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
