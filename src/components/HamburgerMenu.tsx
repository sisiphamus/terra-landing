"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  {
    id: "about",
    label: "About",
    content:
      "Outdoors is an agent that does everything you don't want to. We built it because the best hours of your day shouldn't go to inbox management and calendar shuffling. They should go to living.",
  },
  {
    id: "mission",
    label: "Mission",
    content:
      "Give people back their time. Not with another productivity app that needs managing, but with an agent that actually does the work. You tell it what you need. It figures out the rest.",
  },
  {
    id: "story",
    label: "Story",
    content:
      "We were building software 80 hours a week and realized the tools meant to save us time were just creating more tasks. So we built an agent that learns how you work and takes things off your hands for real.",
  },
  {
    id: "contact",
    label: "Contact",
    content:
      "hello@getoutdoors.co. We read every message. Whether you want early access, have a use case in mind, or just want to talk about what freedom looks like when your agent handles the rest.",
  },
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Close on outside click (mobile)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="relative z-50"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      {/* Hamburger button */}
      <button
        onClick={handleToggle}
        className="relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] group"
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="block w-6 h-[2px] bg-earth-dark origin-center"
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="block w-6 h-[2px] bg-earth-dark"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="block w-6 h-[2px] bg-earth-dark origin-center"
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-12 w-[340px] sm:w-[400px] bg-earth-cream border border-earth-brown/20 rounded-sm shadow-lg overflow-hidden"
          >
            {/* Tab bar */}
            <div className="flex border-b border-earth-brown/15">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-earth-dark border-b-2 border-earth-tan bg-earth-sand/40"
                      : "text-earth-brown hover:text-earth-dark hover:bg-earth-sand/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {tabs.map(
                (tab) =>
                  activeTab === tab.id && (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <p className="text-sm leading-relaxed text-earth-dark/80">
                        {tab.content}
                      </p>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
