"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Beautiful ASCII avatar frames - a friendly developer character
const AVATAR_FRAMES = {
  idle: `
    ┌─────────────────────────┐
    │                         │
    │      ▄▄▄▄▄▄▄▄▄▄▄        │
    │    ▄█▀▀▀▀▀▀▀▀▀▀█▄       │
    │   █▀            ▀█      │
    │  █  ●        ●   █     │
    │  █                █     │
    │  █      ╰─╯       █     │
    │   █▄            ▄█      │
    │    ▀█▄▄▄▄▄▄▄▄▄▄█▀       │
    │         ████            │
    │      ┌──████──┐         │
    │      │ ██████ │         │
    │      │ ██████ │         │
    │      └───┬┬───┘         │
    │          ││             │
    │        ┌─┘└─┐           │
    │                         │
    └─────────────────────────┘
  `,
  wave1: `
    ┌─────────────────────────┐
    │                    ╱    │
    │      ▄▄▄▄▄▄▄▄▄▄▄  ╱     │
    │    ▄█▀▀▀▀▀▀▀▀▀▀█▄╲      │
    │   █▀            ▀█      │
    │  █  ●        ●   █     │
    │  █                █     │
    │  █      ╰─╯       █     │
    │   █▄            ▄█      │
    │    ▀█▄▄▄▄▄▄▄▄▄▄█▀       │
    │         ████            │
    │      ┌──████──┐         │
    │        ██████ │         │
    │        ██████ │         │
    │      └───┬┬───┘         │
    │          ││             │
    │        ┌─┘└─┐           │
    │                         │
    └─────────────────────────┘
  `,
  wave2: `
    ┌─────────────────────────┐
    │                   ─┐    │
    │      ▄▄▄▄▄▄▄▄▄▄▄  ─┤    │
    │    ▄█▀▀▀▀▀▀▀▀▀▀█▄ ─┘    │
    │   █▀            ▀█      │
    │  █  ●        ●   █     │
    │  █                █     │
    │  █      ╰─╯       █     │
    │   █▄            ▄█      │
    │    ▀█▄▄▄▄▄▄▄▄▄▄█▀       │
    │         ████            │
    │      ┌──████──┐         │
    │        ██████ │         │
    │        ██████ │         │
    │      └───┬┬───┘         │
    │          ││             │
    │        ┌─┘└─┐           │
    │                         │
    └─────────────────────────┘
  `,
  excited: `
    ┌─────────────────────────┐
    │                         │
    │      ▄▄▄▄▄▄▄▄▄▄▄        │
    │    ▄█▀▀▀▀▀▀▀▀▀▀█▄       │
    │   █▀            ▀█      │
    │  █  ★        ★   █     │
    │  █                █     │
    │  █     ╰───╯      █     │
    │   █▄            ▄█      │
    │    ▀█▄▄▄▄▄▄▄▄▄▄█▀       │
    │         ████            │
    │      ┌──████──┐         │
    │      │ ██████ │         │
    │      │ ██████ │         │
    │      └───┬┬───┘         │
    │          ││             │
    │        ┌─┘└─┐           │
    │                         │
    └─────────────────────────┘
  `,
  thinking: `
    ┌─────────────────────────┐
    │                    ○    │
    │      ▄▄▄▄▄▄▄▄▄▄▄  ○     │
    │    ▄█▀▀▀▀▀▀▀▀▀▀█▄       │
    │   █▀            ▀█      │
    │  █  ◔        ◔   █     │
    │  █                █     │
    │  █      ───       █     │
    │   █▄            ▄█      │
    │    ▀█▄▄▄▄▄▄▄▄▄▄█▀       │
    │         ████            │
    │      ┌──████──┐         │
    │      │ ██████ │         │
    │      │ ██████ │         │
    │      └───┬┬───┘         │
    │          ││             │
    │        ┌─┘└─┐           │
    │                         │
    └─────────────────────────┘
  `,
  pointing: `
    ┌─────────────────────────┐
    │                         │
    │      ▄▄▄▄▄▄▄▄▄▄▄        │
    │    ▄█▀▀▀▀▀▀▀▀▀▀█▄       │
    │   █▀            ▀█      │
    │  █  ◉        ◉   █     │
    │  █                █     │
    │  █      ╰─╯       █     │
    │   █▄            ▄█      │
    │    ▀█▄▄▄▄▄▄▄▄▄▄█▀       │
    │         ████            │
    │      ┌──████──────➤     │
    │      │ ██████            │
    │      │ ██████            │
    │      └───┬┬───┘         │
    │          ││             │
    │        ┌─┘└─┐           │
    │                         │
    └─────────────────────────┘
  `,
};

// Compact avatar for smaller screens
const COMPACT_AVATAR = {
  idle: `
  ┌───────────────┐
  │  ▄▄▄▄▄▄▄▄▄▄   │
  │ █ ● ── ● █  │
  │ █  ╰──╯  █  │
  │  ▀▀████▀▀   │
  │    ████─┐   │
  │    ████ │   │
  │    ┬┬───┘   │
  └───────────────┘
  `,
  wave: `
  ┌───────────────┐
  │  ▄▄▄▄▄▄▄▄▄▄ ╱ │
  │ █ ● ── ● █╱  │
  │ █  ╰──╯  █  │
  │  ▀▀████▀▀   │
  │    ████─┐   │
  │    ████ │   │
  │    ┬┬───┘   │
  └───────────────┘
  `,
  excited: `
  ┌───────────────┐
  │  ▄▄▄▄▄▄▄▄▄▄   │
  │ █ ★ ── ★ █  │
  │ █ ╰────╯ █  │
  │  ▀▀████▀▀   │
  │    ████─┐   │
  │    ████ │   │
  │    ┬┬───┘   │
  └───────────────┘
  `,
  pointing: `
  ┌───────────────┐
  │  ▄▄▄▄▄▄▄▄▄▄   │
  │ █ ◉ ── ◉ █  │
  │ █  ╰──╯  █  │
  │  ▀▀████▀▀   │
  │    ████───➤ │
  │    ████     │
  │    ┬┬       │
  └───────────────┘
  `,
};

// ASCII art name
const ASCII_NAME = `
 █████╗  █████╗ ██████╗ ██╗███████╗
██╔══██╗██╔══██╗██╔══██╗██║╚══███╔╝
███████║███████║██████╔╝██║  ███╔╝
██╔══██║██╔══██║██╔══██╗██║ ███╔╝
██║  ██║██║  ██║██║  ██║██║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
`;

const ASCII_NAME_SMALL = `
┏━┓┏━┓┳━┓┳┓┳━┓
┣━┫┣━┫┣┳┛┃┃┏━┛
┛ ┗┛ ┗┛┗━┛┗┗━━
`;

// Section-specific messages and expressions
const SECTION_MESSAGES: Record<
  string,
  { messages: string[]; expression: keyof typeof AVATAR_FRAMES }
> = {
  hero: {
    messages: [
      "Hey there! 👋 Welcome to my corner of the internet!",
      "I'm your guide today. Scroll down to explore!",
      "Use Ctrl+Space to open the command palette anytime!",
    ],
    expression: "wave1",
  },
  about: {
    messages: [
      "This is where you learn about me! 🧑‍💻",
      "I'm Aariz - a passionate developer!",
      "I love building cool stuff with code!",
      "Rust is my current obsession 🦀",
    ],
    expression: "excited",
  },
  skills: {
    messages: [
      "Check out my tech stack! 💪",
      "I'm always learning new things!",
      "Full-stack? Backend? Frontend? Yes! 🚀",
      "Hover over the skills to see more!",
    ],
    expression: "pointing",
  },
  projects: {
    messages: [
      "Here's what I've been building! 🛠️",
      "Each project taught me something new!",
      "Click on any project to see details!",
      "Got feedback? I'd love to hear it!",
    ],
    expression: "excited",
  },
  contact: {
    messages: [
      "Want to connect? Let's chat! 💬",
      "I'm always open to new opportunities!",
      "Drop me a message anytime!",
      "Let's build something amazing together!",
    ],
    expression: "wave2",
  },
};

// Hook to check performance settings
function usePerformanceSettings() {
  const [settings, setSettings] = useState({
    enableAnimations: true,
    enableGlow: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSettings = () => {
      try {
        const savedSettings = localStorage.getItem(
          "portfolio-performance-settings",
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({
            enableAnimations: parsed.enableAnimations !== false,
            enableGlow: parsed.enableGlow !== false,
          });
        }
      } catch {
        // Use defaults
      }
    };

    checkSettings();
    window.addEventListener("storage", checkSettings);
    return () => window.removeEventListener("storage", checkSettings);
  }, []);

  return settings;
}

interface AsciiGuideProps {
  enabled?: boolean;
  position?: "left" | "right";
  showName?: boolean;
}

export default function AsciiGuide({
  enabled = true,
  position = "right",
  showName = true,
}: AsciiGuideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentExpression, setCurrentExpression] =
    useState<keyof typeof AVATAR_FRAMES>("idle");
  const [isWaving, setIsWaving] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;
  const glowEnabled = performanceSettings.enableGlow;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  // Wave animation on section change
  useEffect(() => {
    if (!animationsEnabled || isMinimized) return;

    setIsWaving(true);
    const timeout = setTimeout(() => setIsWaving(false), 1500);
    return () => clearTimeout(timeout);
  }, [currentSection, animationsEnabled, isMinimized]);

  // Typing effect for messages
  const typeMessage = useCallback(
    (message: string) => {
      if (!animationsEnabled) {
        setCurrentMessage(message);
        return;
      }

      setIsTyping(true);
      setCurrentMessage("");

      let index = 0;
      const interval = setInterval(() => {
        if (index < message.length) {
          setCurrentMessage(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);

      return () => clearInterval(interval);
    },
    [animationsEnabled],
  );

  // Update message when section changes
  useEffect(() => {
    const sectionData = SECTION_MESSAGES[currentSection];
    if (sectionData) {
      setCurrentExpression(sectionData.expression);
      const msg =
        sectionData.messages[messageIndex % sectionData.messages.length];
      typeMessage(msg);
    }
  }, [currentSection, messageIndex, typeMessage]);

  // Cycle through messages
  useEffect(() => {
    if (isMinimized) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => prev + 1);
    }, 8000);

    return () => clearInterval(interval);
  }, [isMinimized, currentSection]);

  // Set up scroll triggers for each section
  useEffect(() => {
    if (typeof window === "undefined" || !enabled) return;

    // Initial delay before showing
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    const sections = ["hero", "about", "skills", "projects", "contact"];

    const triggers = sections.map((section) => {
      const element = document.getElementById(section);
      if (!element) return null;

      return ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setCurrentSection(section);
          setMessageIndex(0);
        },
        onEnterBack: () => {
          setCurrentSection(section);
          setMessageIndex(0);
        },
      });
    });

    return () => {
      clearTimeout(showTimeout);
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, [enabled]);

  // GSAP entrance animation
  useEffect(() => {
    if (!isVisible || !containerRef.current || !animationsEnabled) return;

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        x: position === "right" ? 100 : -100,
        scale: 0.8,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
    );
  }, [isVisible, position, animationsEnabled]);

  // Handle minimize/maximize
  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
    setHasInteracted(true);
  }, []);

  // Handle next message
  const nextMessage = useCallback(() => {
    setMessageIndex((prev) => prev + 1);
    setHasInteracted(true);
  }, []);

  if (!enabled || !isVisible) return null;

  // Get current avatar frame
  const getAvatarFrame = () => {
    if (isWaving) {
      if (isMobile) return COMPACT_AVATAR.wave;
      // Animate between wave frames
      const waveFrames = ["wave1", "wave2", "wave1", "idle"] as const;
      const frameIndex = Math.floor((Date.now() / 200) % waveFrames.length);
      return AVATAR_FRAMES[waveFrames[frameIndex]];
    }

    if (isMobile) {
      if (currentExpression === "excited") return COMPACT_AVATAR.excited;
      if (currentExpression === "pointing") return COMPACT_AVATAR.pointing;
      return COMPACT_AVATAR.idle;
    }

    return AVATAR_FRAMES[currentExpression] || AVATAR_FRAMES.idle;
  };

  return (
    <div
      ref={containerRef}
      className={`fixed z-40 transition-all duration-300 ${
        position === "right" ? "right-4" : "left-4"
      } ${isMobile ? "bottom-20" : "bottom-24"}`}
      style={{ opacity: 0 }}
    >
      {/* Main container */}
      <div
        className={`relative ${isMinimized ? "cursor-pointer" : ""}`}
        onClick={isMinimized ? toggleMinimize : undefined}
      >
        {/* Glow effect */}
        {glowEnabled && !isMinimized && (
          <div
            className="absolute inset-0 blur-2xl opacity-10 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--terminal-green) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Speech bubble - only show when not minimized */}
        {!isMinimized && (
          <div
            className={`absolute ${
              position === "right" ? "right-full mr-3" : "left-full ml-3"
            } bottom-1/2 translate-y-1/2`}
          >
            <div
              className="relative bg-[#0D1117]/95 backdrop-blur-md border border-[var(--terminal-green)]/30 rounded-lg p-3 max-w-[250px] md:max-w-[300px]"
              style={{
                boxShadow: glowEnabled
                  ? "0 0 10px rgba(0,255,136,0.1), inset 0 0 10px rgba(0,255,136,0.02)"
                  : "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              {/* ASCII Name */}
              {showName && currentSection === "hero" && (
                <pre
                  className="font-mono text-[4px] md:text-[6px] text-[var(--terminal-green)] leading-none mb-2 select-none"
                  style={{
                    textShadow: glowEnabled
                      ? "0 0 3px rgba(0,255,136,0.3)"
                      : "none",
                  }}
                >
                  {isMobile ? ASCII_NAME_SMALL : ASCII_NAME}
                </pre>
              )}

              {/* Message */}
              <p className="font-mono text-xs md:text-sm text-[var(--terminal-green)]">
                {currentMessage}
                {isTyping && (
                  <span
                    className="inline-block w-[2px] h-[1em] ml-0.5 align-middle"
                    style={{
                      backgroundColor: "var(--terminal-green)",
                      opacity: cursorVisible ? 1 : 0,
                      boxShadow: glowEnabled
                        ? "0 0 3px var(--terminal-green)"
                        : "none",
                    }}
                  />
                )}
              </p>

              {/* Navigation hint */}
              {!hasInteracted && (
                <p className="font-mono text-[10px] text-gray-500 mt-2 animate-pulse">
                  Click avatar to minimize
                </p>
              )}

              {/* Next message button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextMessage();
                }}
                className="absolute -bottom-2 right-2 font-mono text-[10px] text-[var(--terminal-green)]/60 hover:text-[var(--terminal-green)] transition-colors"
              >
                [next →]
              </button>

              {/* Speech bubble tail */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#0D1117] border-[var(--terminal-green)]/30 ${
                  position === "right"
                    ? "right-[-7px] border-r border-t"
                    : "left-[-7px] border-l border-b"
                }`}
              />
            </div>
          </div>
        )}

        {/* Avatar container */}
        <div
          className={`relative rounded-lg overflow-hidden border border-[var(--terminal-green)]/30 bg-[#0D1117]/95 backdrop-blur-md cursor-pointer transition-all duration-300 ${
            isMinimized ? "opacity-60 hover:opacity-100" : ""
          }`}
          onClick={!isMinimized ? toggleMinimize : undefined}
          style={{
            boxShadow: glowEnabled
              ? "0 0 10px rgba(0,255,136,0.08)"
              : "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Scanlines */}
          {animationsEnabled && !isMinimized && (
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
              }}
            />
          )}

          {/* Avatar */}
          <pre
            className={`font-mono select-none transition-all duration-300 ${
              isMinimized
                ? "text-[4px] md:text-[5px] p-1"
                : "text-[5px] md:text-[7px] p-2"
            }`}
            style={{
              color: "var(--terminal-green)",
              textShadow: glowEnabled ? "0 0 3px rgba(0,255,136,0.3)" : "none",
              lineHeight: 1.1,
            }}
          >
            {getAvatarFrame()}
          </pre>

          {/* Minimize/maximize indicator */}
          <div className="absolute bottom-1 right-1 font-mono text-[8px] text-[var(--terminal-green)]/40">
            {isMinimized ? "[+]" : "[−]"}
          </div>
        </div>

        {/* Section indicator */}
        {!isMinimized && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[var(--terminal-green)]/60 whitespace-nowrap">
            ⟨ {currentSection.toUpperCase()} ⟩
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!isMinimized && !isMobile && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-gray-600 whitespace-nowrap">
          Press G to toggle guide
        </div>
      )}
    </div>
  );
}

// Export the ASCII name for use elsewhere
export { ASCII_NAME, ASCII_NAME_SMALL, AVATAR_FRAMES, COMPACT_AVATAR };
