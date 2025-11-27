"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

// Premium cyberpunk-style developer avatar with detailed design
const DEV_AVATAR_FRAMES = {
  idle: `
     ╔═══════════════════════════════════════════════════╗
     ║                                                   ║
     ║                    ▄▄▄▄▄▄▄▄▄▄▄▄                   ║
     ║                ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄                 ║
     ║              ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄               ║
     ║             ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓░░░░░▓▓▓▓▓▓            ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓▓░░░░░▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▄▄▄▄▄▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            ║
     ║             ▓▓▓▓▓░░░░░░░░░░░░░░░▓▓▓▓▓             ║
     ║              ▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀              ║
     ║                ▀▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀▀                 ║
     ║                      ████████                     ║
     ║                 ╭────████████────╮                ║
     ║                 │   ████████████ │                ║
     ║                 │   ████████████ │                ║
     ║                 │   ████████████ │                ║
     ║                 │   ████████████ │                ║
     ║                 ╰──────┬┬┬┬──────╯                ║
     ║                        ││││                       ║
     ║                     ╭──╯╰╯╰──╮                    ║
     ║                                                   ║
     ╚═══════════════════════════════════════════════════╝
  `,
  wave1: `
     ╔═══════════════════════════════════════════════════╗
     ║                                          ╱        ║
     ║                    ▄▄▄▄▄▄▄▄▄▄▄▄         ╱         ║
     ║                ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄      ╱          ║
     ║              ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄   ╲           ║
     ║             ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓░░░░░▓▓▓▓▓▓            ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓▓░░░░░▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▄▄▄▄▄▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            ║
     ║             ▓▓▓▓▓░░░░░░░░░░░░░░░▓▓▓▓▓             ║
     ║              ▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀              ║
     ║                ▀▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀▀                 ║
     ║                      ████████                     ║
     ║                 ╭────████████────╮                ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                 ╰──────┬┬┬┬──────╯                ║
     ║                        ││││                       ║
     ║                     ╭──╯╰╯╰──╮                    ║
     ║                                                   ║
     ╚═══════════════════════════════════════════════════╝
  `,
  wave2: `
     ╔═══════════════════════════════════════════════════╗
     ║                                            ╲╲     ║
     ║                    ▄▄▄▄▄▄▄▄▄▄▄▄             ╲╲    ║
     ║                ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄           ╱╱    ║
     ║              ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄        ╱╱     ║
     ║             ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓░░░░░▓▓▓▓▓▓            ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓▓░░░░░▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▄▄▄▄▄▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            ║
     ║             ▓▓▓▓▓░░░░░░░░░░░░░░░▓▓▓▓▓             ║
     ║              ▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀              ║
     ║                ▀▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀▀                 ║
     ║                      ████████                     ║
     ║                 ╭────████████────╮                ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                 ╰──────┬┬┬┬──────╯                ║
     ║                        ││││                       ║
     ║                     ╭──╯╰╯╰──╮                    ║
     ║                                                   ║
     ╚═══════════════════════════════════════════════════╝
  `,
  wave3: `
     ╔═══════════════════════════════════════════════════╗
     ║                                         ─────╲    ║
     ║                    ▄▄▄▄▄▄▄▄▄▄▄▄              ╲    ║
     ║                ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄            ╱    ║
     ║              ▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄         ╱     ║
     ║             ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓░░░░░▓▓▓▓▓▓            ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓░░████░░▓▓▓░░████░░▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓░░░░░▓▓▓▓▓▓▓░░░░░▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║           ▓▓▓▓▓▓▓▓▓▓▓▄▄▄▄▄▓▓▓▓▓▓▓▓▓▓▓▓▓           ║
     ║            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            ║
     ║             ▓▓▓▓▓░░░░░░░░░░░░░░░▓▓▓▓▓             ║
     ║              ▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀              ║
     ║                ▀▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀▀                 ║
     ║                      ████████                     ║
     ║                 ╭────████████────╮                ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                      ████████████ │               ║
     ║                 ╰──────┬┬┬┬──────╯                ║
     ║                        ││││                       ║
     ║                     ╭──╯╰╯╰──╮                    ║
     ║                                                   ║
     ╚═══════════════════════════════════════════════════╝
  `,
};

// Compact minimal avatar for smaller screens
const COMPACT_AVATAR_FRAMES = {
  idle: `
   ╭──────────────────────────╮
   │                          │
   │       ▄▄▄▄▄▄▄▄▄▄▄        │
   │     ▄█░░░░░░░░░░░█▄      │
   │    █░░░░░░░░░░░░░░░█     │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░░░░░░░░░░░░░░░░█    │
   │   █░░░░░░▄▄▄▄░░░░░░░█    │
   │    █░░░░░░░░░░░░░░░█     │
   │     ▀█░░░░░░░░░░░█▀      │
   │       ▀▀▀▀▀▀▀▀▀▀▀        │
   │          ██████          │
   │      ╭───██████───╮      │
   │      │  ████████  │      │
   │      │  ████████  │      │
   │      ╰────┬┬┬┬────╯      │
   │           ││││           │
   │        ╭──╯╰╯╰──╮        │
   │                          │
   ╰──────────────────────────╯
  `,
  wave1: `
   ╭──────────────────────────╮
   │                     ╱    │
   │       ▄▄▄▄▄▄▄▄▄▄▄  ╱     │
   │     ▄█░░░░░░░░░░░█▄╲     │
   │    █░░░░░░░░░░░░░░░█     │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░░░░░░░░░░░░░░░░█    │
   │   █░░░░░░▄▄▄▄░░░░░░░█    │
   │    █░░░░░░░░░░░░░░░█     │
   │     ▀█░░░░░░░░░░░█▀      │
   │       ▀▀▀▀▀▀▀▀▀▀▀        │
   │          ██████          │
   │      ╭───██████───╮      │
   │         ████████  │      │
   │         ████████  │      │
   │      ╰────┬┬┬┬────╯      │
   │           ││││           │
   │        ╭──╯╰╯╰──╮        │
   │                          │
   ╰──────────────────────────╯
  `,
  wave2: `
   ╭──────────────────────────╮
   │                      ╲╲  │
   │       ▄▄▄▄▄▄▄▄▄▄▄    ╲╲  │
   │     ▄█░░░░░░░░░░░█▄  ╱╱  │
   │    █░░░░░░░░░░░░░░░█╱    │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░░░░░░░░░░░░░░░░█    │
   │   █░░░░░░▄▄▄▄░░░░░░░█    │
   │    █░░░░░░░░░░░░░░░█     │
   │     ▀█░░░░░░░░░░░█▀      │
   │       ▀▀▀▀▀▀▀▀▀▀▀        │
   │          ██████          │
   │      ╭───██████───╮      │
   │         ████████  │      │
   │         ████████  │      │
   │      ╰────┬┬┬┬────╯      │
   │           ││││           │
   │        ╭──╯╰╯╰──╮        │
   │                          │
   ╰──────────────────────────╯
  `,
  wave3: `
   ╭──────────────────────────╮
   │                    ───╲  │
   │       ▄▄▄▄▄▄▄▄▄▄▄     ╲  │
   │     ▄█░░░░░░░░░░░█▄   ╱  │
   │    █░░░░░░░░░░░░░░░█ ╱   │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░██░░░░░░░░██░░░█    │
   │   █░░░░░░░░░░░░░░░░░█    │
   │   █░░░░░░▄▄▄▄░░░░░░░█    │
   │    █░░░░░░░░░░░░░░░█     │
   │     ▀█░░░░░░░░░░░█▀      │
   │       ▀▀▀▀▀▀▀▀▀▀▀        │
   │          ██████          │
   │      ╭───██████───╮      │
   │         ████████  │      │
   │         ████████  │      │
   │      ╰────┬┬┬┬────╯      │
   │           ││││           │
   │        ╭──╯╰╯╰──╮        │
   │                          │
   ╰──────────────────────────╯
  `,
};

// Speech bubble messages with varied styles
const SPEECH_MESSAGES = [
  { text: "Hey there! 👋", delay: 0, style: "greeting" },
  { text: "Welcome to my terminal.", delay: 2500, style: "normal" },
  { text: "I'm Aariz Sheikh", delay: 5000, style: "highlight" },
  {
    text: "Full-Stack Developer & Rust Enthusiast",
    delay: 7500,
    style: "role",
  },
  { text: "Let's explore together →", delay: 10000, style: "cta" },
];

// Interactive guide items
const GUIDE_ITEMS = [
  {
    icon: "⌘",
    key: "Ctrl + Space",
    description: "Command Palette",
    delay: 0,
  },
  {
    icon: "⚙",
    key: "Ctrl + ,",
    description: "Settings",
    delay: 150,
  },
  {
    icon: "↓",
    key: "Scroll",
    description: "Navigate",
    delay: 300,
  },
  {
    icon: "⎋",
    key: "Esc",
    description: "Close Panels",
    delay: 450,
  },
];

// Hook to check performance settings
function usePerformanceSettings() {
  const [settings, setSettings] = useState({
    enableAnimations: true,
    enableGlow: true,
    level: "high" as "high" | "medium" | "low" | "potato",
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
            level: parsed.level || "high",
          });
        }
      } catch {
        // Invalid JSON or no settings, use defaults
      }
    };

    checkSettings();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio-performance-settings") {
        checkSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return settings;
}

interface AsciiAvatarIntroProps {
  onComplete?: () => void;
  onSkip?: () => void;
  autoSkipDelay?: number; // Auto skip after X ms (0 = disabled)
}

export default function AsciiAvatarIntro({
  onComplete,
  onSkip,
  autoSkipDelay = 0,
}: AsciiAvatarIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLPreElement>(null);
  const speechBubbleRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [speechText, setSpeechText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;
  const glowEnabled = performanceSettings.enableGlow;

  const frameKeys = ["idle", "wave1", "wave2", "wave3"] as const;

  // Use compact avatar on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const frames = isMobile ? COMPACT_AVATAR_FRAMES : DEV_AVATAR_FRAMES;

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Waving animation loop
  useEffect(() => {
    if (!animationsEnabled) {
      setCurrentFrame(0);
      return;
    }

    const waveSequence = [0, 1, 2, 3, 2, 1, 0, 0, 0]; // idle, wave up, peak, wave down, idle pause
    let sequenceIndex = 0;
    let loopCount = 0;
    const maxLoops = 3; // Wave 3 times then stop

    const interval = setInterval(() => {
      setCurrentFrame(waveSequence[sequenceIndex]);
      sequenceIndex++;

      if (sequenceIndex >= waveSequence.length) {
        loopCount++;
        if (loopCount >= maxLoops) {
          clearInterval(interval);
          setCurrentFrame(0); // Return to idle
        } else {
          sequenceIndex = 0;
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [animationsEnabled]);

  // Speech typing effect
  useEffect(() => {
    if (currentMessageIndex >= SPEECH_MESSAGES.length) return;

    const message = SPEECH_MESSAGES[currentMessageIndex];
    let charIndex = 0;
    setIsTyping(true);
    setSpeechText("");

    const typeInterval = setInterval(
      () => {
        if (charIndex < message.text.length) {
          setSpeechText(message.text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);

          // Move to next message after a delay
          setTimeout(() => {
            if (currentMessageIndex < SPEECH_MESSAGES.length - 1) {
              setCurrentMessageIndex((prev) => prev + 1);
            }
          }, 2000);
        }
      },
      animationsEnabled ? 50 : 0,
    );

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex, animationsEnabled]);

  // Define handleSkip first since it's used by multiple effects
  const handleSkip = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    if (animationsEnabled && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          onSkip?.();
          onComplete?.();
        },
      });
    } else {
      onSkip?.();
      onComplete?.();
    }
  }, [animationsEnabled, isExiting, onSkip, onComplete]);

  // Show guide after first message
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuide(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show skip hint after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkipHint(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto skip functionality
  useEffect(() => {
    if (autoSkipDelay <= 0) return;

    const timer = setTimeout(() => {
      handleSkip();
    }, autoSkipDelay);

    return () => clearTimeout(timer);
  }, [autoSkipDelay, handleSkip]);

  // GSAP entrance animations
  useEffect(() => {
    if (!animationsEnabled) return;

    const ctx = gsap.context(() => {
      // Avatar entrance
      gsap.fromTo(
        avatarRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        },
      );

      // Speech bubble entrance
      gsap.fromTo(
        speechBubbleRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.8,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationsEnabled]);

  // Guide entrance animation
  useEffect(() => {
    if (!showGuide || !animationsEnabled || !guideRef.current) return;

    gsap.fromTo(
      guideRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
    );
  }, [showGuide, animationsEnabled]);

  // Handle keyboard skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Handle scroll to skip
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleSkip();
      }, 100);
    };

    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleSkip]);

  const currentFrameKey = frameKeys[currentFrame] || "idle";
  const avatarArt = frames[currentFrameKey];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D1117] overflow-hidden"
      onClick={handleSkip}
      style={{ cursor: "pointer" }}
    >
      {/* Scanlines overlay */}
      {animationsEnabled && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
            }}
          />
          {/* Moving scanline effect */}
          <div
            className="absolute left-0 right-0 h-[2px] pointer-events-none z-30 opacity-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--terminal-green), transparent)",
              animation: "scanline-move 4s linear infinite",
            }}
          />
        </>
      )}

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Ambient glow */}
      {glowEnabled && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,255,136,0.08) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Speech bubble */}
        <div
          ref={speechBubbleRef}
          className="relative mb-4"
          style={{ opacity: animationsEnabled ? 0 : 1 }}
        >
          <div
            className="font-mono text-lg md:text-xl lg:text-2xl px-6 py-4 rounded-xl border border-[var(--terminal-green)]/40 bg-[#0D1117]/95 backdrop-blur-md"
            style={{
              boxShadow: glowEnabled
                ? "0 0 30px rgba(0,255,136,0.2), 0 0 60px rgba(0,255,136,0.1), inset 0 0 30px rgba(0,255,136,0.05)"
                : "0 4px 20px rgba(0,0,0,0.3)",
              minWidth: "300px",
              maxWidth: "90vw",
              textAlign: "center",
            }}
          >
            <span
              className="bg-gradient-to-r from-[var(--terminal-green)] via-[var(--terminal-blue)] to-[var(--terminal-green)] bg-clip-text"
              style={{
                WebkitBackgroundClip: "text",
                backgroundSize: "200% auto",
                animation: animationsEnabled
                  ? "gradient-shift 3s ease infinite"
                  : "none",
                color: animationsEnabled
                  ? "transparent"
                  : "var(--terminal-green)",
              }}
            >
              {speechText}
            </span>
            {isTyping && (
              <span
                className="inline-block w-[3px] h-[1.1em] ml-1 align-middle rounded-sm"
                style={{
                  backgroundColor: "var(--terminal-green)",
                  opacity: cursorVisible ? 1 : 0,
                  boxShadow: glowEnabled
                    ? "0 0 10px var(--terminal-green), 0 0 20px var(--terminal-green)"
                    : "none",
                  transition: "opacity 0.1s ease",
                }}
              />
            )}
          </div>
          {/* Speech bubble tail */}
          <div
            className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 rotate-45 border-r border-b border-[var(--terminal-green)]/40 bg-[#0D1117]"
            style={{
              boxShadow: glowEnabled
                ? "4px 4px 15px rgba(0,255,136,0.15)"
                : "none",
            }}
          />
        </div>

        {/* ASCII Avatar with enhanced styling */}
        <div
          className="relative"
          style={{
            animation: animationsEnabled
              ? "float 4s ease-in-out infinite"
              : "none",
          }}
        >
          {/* Glow backdrop */}
          {glowEnabled && (
            <div
              className="absolute inset-0 blur-2xl opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--terminal-green) 0%, transparent 70%)",
              }}
            />
          )}

          {/* Avatar container with border effect */}
          <div
            className="relative rounded-lg p-1"
            style={{
              background: glowEnabled
                ? "linear-gradient(135deg, rgba(0,255,136,0.2) 0%, transparent 50%, rgba(0,255,136,0.1) 100%)"
                : "transparent",
            }}
          >
            <pre
              ref={avatarRef}
              className="font-mono text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs leading-tight select-none relative z-10"
              style={{
                color: "var(--terminal-green)",
                textShadow: glowEnabled
                  ? "0 0 10px rgba(0,255,136,0.6), 0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.2)"
                  : "none",
                filter: glowEnabled
                  ? "drop-shadow(0 0 3px rgba(0,255,136,0.6))"
                  : "none",
                opacity: animationsEnabled ? 0 : 1,
                letterSpacing: "0.05em",
              }}
            >
              {avatarArt}
            </pre>
          </div>

          {/* Reflection effect */}
          {glowEnabled && (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 opacity-20 blur-sm"
              style={{
                background:
                  "linear-gradient(to bottom, var(--terminal-green), transparent)",
                transform: "translateX(-50%) scaleY(-0.3) translateY(100%)",
              }}
            />
          )}
        </div>

        {/* Interactive Guide */}
        {showGuide && (
          <div
            ref={guideRef}
            className="mt-8 flex flex-wrap justify-center gap-4 max-w-2xl"
            style={{ opacity: animationsEnabled ? 0 : 1 }}
          >
            {GUIDE_ITEMS.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700/50 bg-[#161B22]/80 backdrop-blur-sm transition-all duration-300 hover:border-[var(--terminal-green)]/50 hover:bg-[#1C2128]"
                style={{
                  animation: animationsEnabled
                    ? `fadeSlideUp 0.5s ease-out ${item.delay}ms forwards`
                    : "none",
                  opacity: animationsEnabled ? 0 : 1,
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-[var(--terminal-green)]">
                    {item.key}
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skip hint */}
        {showSkipHint && (
          <div
            className="mt-8 font-mono text-sm text-gray-400"
            style={{
              animation: animationsEnabled
                ? "fadeIn 0.5s ease-out, pulse 2s ease-in-out infinite"
                : "none",
            }}
          >
            <span className="text-[var(--terminal-green)]/70">⟨ </span>
            <span className="text-gray-400">
              Press any key, scroll, or click to continue
            </span>
            <span className="text-[var(--terminal-green)]/70"> ⟩</span>
          </div>
        )}
      </div>

      {/* Enhanced corner decorations */}
      <div className="absolute top-4 left-4 font-mono text-[10px] sm:text-xs">
        <span className="text-[var(--terminal-green)]/40">┌──</span>
        <span className="text-[var(--terminal-green)]/60"> SYS.INIT </span>
        <span className="text-[var(--terminal-green)]/40">──┐</span>
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] sm:text-xs">
        <span className="text-[var(--terminal-green)]/40">┌──</span>
        <span className="text-[var(--terminal-green)]/60"> v2.0.0 </span>
        <span className="text-[var(--terminal-green)]/40">──┐</span>
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] sm:text-xs">
        <span className="text-[var(--terminal-green)]/40">└──</span>
        <span className="text-[var(--terminal-green)]/60"> AARIZ.DEV </span>
        <span className="text-[var(--terminal-green)]/40">──┘</span>
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] sm:text-xs">
        <span className="text-[var(--terminal-green)]/40">└──</span>
        <span
          className={`text-[var(--terminal-green)]/60 ${animationsEnabled ? "animate-pulse" : ""}`}
        >
          {" "}
          ● READY{" "}
        </span>
        <span className="text-[var(--terminal-green)]/40">──┘</span>
      </div>

      {/* Side decorative lines */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-[var(--terminal-green)]/20 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-[var(--terminal-green)]/20 to-transparent" />

      {/* Keyframes */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.01);
          }
        }
        @keyframes scanline-move {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Export individual components for flexibility
export { DEV_AVATAR_FRAMES, COMPACT_AVATAR_FRAMES };
