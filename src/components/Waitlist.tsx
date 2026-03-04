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

    // Step 1: Slow fold
    setStatus("folding");
    await new Promise((r) => setTimeout(r, 1400));

    // Step 2: Fly off
    setStatus("flying");
    await new Promise((r) => setTimeout(r, 1200));

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
            transition={{ duration: 0.8, delay: 0.2 }}
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
            {/* The paper that folds and flies */}
            <motion.div
              className="origin-bottom-left"
              animate={
                status === "folding"
                  ? {
                      scaleY: [1, 0.7, 0.4, 0.15],
                      scaleX: [1, 0.95, 0.85, 0.7],
                      rotateX: [0, 15, 30, 45],
                      rotateZ: [0, -1, -2, -3],
                      y: [0, 2, 5, 8],
                    }
                  : status === "flying"
                    ? {
                        x: [0, 40, 150, 500],
                        y: [8, -10, -50, -160],
                        rotate: [-3, -10, -18, -25],
                        scaleX: [0.7, 0.5, 0.3, 0.1],
                        scaleY: [0.15, 0.12, 0.08, 0.02],
                        opacity: [1, 1, 0.7, 0],
                      }
                    : {}
              }
              transition={
                status === "folding"
                  ? { duration: 1.3, ease: [0.25, 0.1, 0.25, 1] }
                  : status === "flying"
                    ? { duration: 1.1, ease: [0.4, 0, 0.2, 1] }
                    : {}
              }
              style={{ perspective: 600 }}
            >
              {/* Just an input with a single gold underline */}
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
                className="w-full bg-transparent px-0 py-2 text-sm text-earth-deep
                  placeholder:text-earth-brown/25 border-0 border-b-2 border-earth-tan
                  focus:outline-none focus:border-earth-clay
                  disabled:opacity-40 transition-colors"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontStyle: "italic",
                }}
              />
            </motion.div>

            {/* Submit text link */}
            <AnimatePresence>
              {!isAnimating && (
                <motion.button
                  type="submit"
                  disabled={!email.trim()}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
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
