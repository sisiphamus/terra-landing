"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list. We'll be in touch.");
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not connect. Try again later.");
    }
  };

  return (
    <section className="w-full max-w-lg mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl text-earth-dark tracking-wide mb-3">
          Join the Waitlist
        </h2>
        <p className="text-sm text-earth-brown/70 leading-relaxed max-w-sm mx-auto">
          Be the first to know when we open the gates. No spam. Just the signal.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <div className="inline-block w-12 h-12 rounded-full bg-earth-forest/10 mb-4 flex items-center justify-center mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4A5D3A"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <p className="text-earth-forest text-sm tracking-wide">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className="flex-1 px-4 py-3 bg-white border border-earth-brown/20 rounded-sm
                text-sm text-earth-deep placeholder:text-earth-brown/40
                focus:outline-none focus:border-earth-tan transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3 bg-earth-dark text-earth-cream text-sm tracking-[0.15em]
                uppercase rounded-sm hover:bg-earth-deep transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-red-700/70 mt-3"
        >
          {message}
        </motion.p>
      )}
    </section>
  );
}
