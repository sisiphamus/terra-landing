"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "folding" | "flying" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Step 1: Fold the paper
    setStatus("folding");

    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Fly it off screen
    setStatus("flying");

    await new Promise((r) => setTimeout(r, 800));

    // Step 3: Store and confirm
    try {
      const existing = JSON.parse(localStorage.getItem("waitlist") || "[]");
      if (!existing.includes(email.toLowerCase())) {
        existing.push(email.toLowerCase());
        localStorage.setItem("waitlist", JSON.stringify(existing));
      }
      setStatus("success");
      setMessage("Sent. We'll find you.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  const isAnimating = status === "folding" || status === "flying";

  return (
    <div className="w-full max-w-[340px]">
      <p className="text-[10px] tracking-[0.25em] uppercase text-earth-brown/40 mb-5">
        Early Access
      </p>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-sm text-earth-dark/60 italic">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* The "paper" that folds and flies */}
            <motion.div
              className="origin-bottom"
              animate={
                status === "folding"
                  ? {
                      scaleY: [1, 0.6],
                      scaleX: [1, 0.85],
                      rotateX: [0, 25],
                      y: [0, 4],
                    }
                  : status === "flying"
                    ? {
                        x: [0, 20, 400],
                        y: [4, -30, -120],
                        rotate: [0, -8, -15],
                        scaleX: [0.85, 0.7, 0.3],
                        scaleY: [0.6, 0.5, 0.2],
                        opacity: [1, 1, 0],
                      }
                    : {}
              }
              transition={
                status === "folding"
                  ? { duration: 0.5, ease: "easeInOut" }
                  : status === "flying"
                    ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
                    : {}
              }
              style={{ perspective: 800 }}
            >
              {/* Paper surface */}
              <div className="relative bg-white/80 backdrop-blur-sm border-b border-earth-brown/10">
                <input
                  type="email"
                  required
                  placeholder="your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={isAnimating}
                  className="w-full bg-transparent px-0 py-3 text-sm text-earth-deep
                    placeholder:text-earth-brown/25 border-0
                    focus:outline-none disabled:opacity-40"
                  style={{
                    fontFamily: "var(--font-lora), Georgia, serif",
                    fontStyle: "italic",
                  }}
                />
              </div>
            </motion.div>

            {/* Submit — just text, ultra minimal */}
            <AnimatePresence>
              {!isAnimating && (
                <motion.button
                  type="submit"
                  disabled={!email.trim()}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 text-[11px] tracking-[0.2em] uppercase text-earth-brown/40
                    hover:text-earth-dark transition-colors duration-300
                    disabled:opacity-20 disabled:cursor-default
                    border-b border-transparent hover:border-earth-brown/20
                    pb-[1px]"
                >
                  request access
                </motion.button>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-red-700/50 mt-2"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
