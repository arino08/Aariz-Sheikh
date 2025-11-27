"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ASCII art font mappings for letters
const ASCII_LETTERS: Record<string, string[]> = {
  A: ["▄▀█", "█▀█"],
  B: ["█▄▄", "█▄█"],
  C: ["█▀▀", "█▄▄"],
  D: ["█▀▄", "█▄▀"],
  E: ["█▀▀", "██▄"],
  F: ["█▀▀", "█▀░"],
  G: ["█▀▀", "█▄█"],
  H: ["█░█", "█▀█"],
  I: ["█", "█"],
  J: ["░░█", "█▄█"],
  K: ["█▄▀", "█░█"],
  L: ["█░░", "█▄▄"],
  M: ["█▀▄▀█", "█░▀░█"],
  N: ["█▄░█", "█░▀█"],
  O: ["█▀█", "█▄█"],
  P: ["█▀█", "█▀▀"],
  Q: ["█▀█", "▀▀█"],
  R: ["█▀█", "█▀▄"],
  S: ["█▀▀", "▄█▄"],
  T: ["▀█▀", "░█░"],
  U: ["█░█", "█▄█"],
  V: ["█░█", "▀▄▀"],
  W: ["█░█░█", "▀▄▀▄▀"],
  X: ["▀▄▀", "█░█"],
  Y: ["█▄█", "░█░"],
  Z: ["▀▀█", "█▄▄"],
  " ": ["░", "░"],
  ".": ["░", "▄"],
  "!": ["█", "▄"],
  "?": ["▀█", "▄░"],
  "-": ["░░░", "▀▀▀"],
  _: ["░░░", "▄▄▄"],
  "'": ["▀", "░"],
  "&": ["▄▀█▄", "█▀█▀"],
};

// Scramble characters for effects
const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`█▓▒░▀▄";
const MATRIX_CHARS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

type AnimationType =
  | "decode" // Matrix-style decode
  | "wave" // Wave animation
  | "typewriter" // Classic typewriter
  | "glitch" // Glitch effect
  | "cascade" // Cascade from top
  | "scramble" // Scramble then reveal
  | "terminal" // Terminal boot sequence
  | "pixelate" // Pixel-by-pixel reveal
  | "none"; // No animation

interface AsciiHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  animation?: AnimationType;
  className?: string;
  color?: string;
  glowColor?: string;
  enableGlow?: boolean;
  enableHoverEffect?: boolean;
  triggerOnScroll?: boolean;
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
  useAsciiFont?: boolean; // Use ASCII art letters vs regular text
  prefix?: string; // Terminal prefix like "$" or ">"
  suffix?: string; // Suffix like "_" cursor
  onAnimationComplete?: () => void;
}

export default function AsciiHeading({
  text,
  as: Component = "h2",
  animation = "decode",
  className = "",
  color = "var(--terminal-green)",
  glowColor = "var(--terminal-green)",
  enableGlow = true,
  enableHoverEffect = true,
  triggerOnScroll = true,
  delay = 0,
  duration = 1.5,
  size = "md",
  useAsciiFont = false,
  prefix = "",
  suffix = "",
  onAnimationComplete,
}: AsciiHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Size classes
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl lg:text-4xl",
    lg: "text-3xl md:text-4xl lg:text-5xl",
    xl: "text-4xl md:text-5xl lg:text-6xl",
  };

  // Convert text to ASCII art format
  const getAsciiArt = useCallback((inputText: string): string[] => {
    const upperText = inputText.toUpperCase();
    const lines: string[] = ["", ""];

    for (const char of upperText) {
      const asciiChar = ASCII_LETTERS[char] || ASCII_LETTERS[" "];
      lines[0] += asciiChar[0] + " ";
      lines[1] += asciiChar[1] + " ";
    }

    return lines;
  }, []);

  // Cursor blink effect
  useEffect(() => {
    if (!suffix.includes("_") && !suffix.includes("█")) return;

    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => clearInterval(interval);
  }, [suffix]);

  // Decode animation (Matrix-style)
  const animateDecode = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const chars = text.split("");
    const revealed = new Array(chars.length).fill(false);
    let completedCount = 0;

    const interval = setInterval(() => {
      const newText = chars
        .map((char, i) => {
          if (revealed[i]) return char;
          if (char === " ") return " ";

          // Random chance to reveal
          if (Math.random() < 0.05) {
            revealed[i] = true;
            completedCount++;
            return char;
          }

          return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        })
        .join("");

      setDisplayText(newText);

      if (completedCount >= chars.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        setHasAnimated(true);
        onAnimationComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, isAnimating, onAnimationComplete]);

  // Wave animation
  const animateWave = useCallback(() => {
    if (isAnimating || !containerRef.current) return;
    setIsAnimating(true);
    setDisplayText(text);

    const chars = containerRef.current.querySelectorAll(".wave-char");

    gsap.fromTo(
      chars,
      {
        y: 20,
        opacity: 0,
        rotateX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: "back.out(1.7)",
        onComplete: () => {
          setIsAnimating(false);
          setHasAnimated(true);
          onAnimationComplete?.();
        },
      }
    );
  }, [text, isAnimating, onAnimationComplete]);

  // Typewriter animation
  const animateTypewriter = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDisplayText("");

    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;

      if (index >= text.length) {
        clearInterval(interval);
        setIsAnimating(false);
        setHasAnimated(true);
        onAnimationComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, isAnimating, onAnimationComplete]);

  // Glitch animation
  const animateGlitch = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    let iterations = 0;
    const maxIterations = 20;

    const interval = setInterval(() => {
      const glitched = text
        .split("")
        .map((char) => {
          if (char === " ") return " ";
          if (Math.random() > 0.3 + iterations / maxIterations) {
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          }
          return char;
        })
        .join("");

      setDisplayText(glitched);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        setHasAnimated(true);
        onAnimationComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, isAnimating, onAnimationComplete]);

  // Cascade animation
  const animateCascade = useCallback(() => {
    if (isAnimating || !containerRef.current) return;
    setIsAnimating(true);
    setDisplayText(text);

    const chars = containerRef.current.querySelectorAll(".wave-char");

    gsap.fromTo(
      chars,
      {
        y: -50,
        opacity: 0,
        scale: 0,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: {
          each: 0.02,
          from: "start",
        },
        ease: "bounce.out",
        onComplete: () => {
          setIsAnimating(false);
          setHasAnimated(true);
          onAnimationComplete?.();
        },
      }
    );
  }, [text, isAnimating, onAnimationComplete]);

  // Scramble animation
  const animateScramble = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const chars = text.split("");
    let iterations = 0;
    const maxIterations = text.length * 3;

    const interval = setInterval(() => {
      setDisplayText(
        chars
          .map((char, index) => {
            if (index < iterations / 3) return text[index];
            if (char === " ") return " ";
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join("")
      );

      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        setHasAnimated(true);
        onAnimationComplete?.();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, isAnimating, onAnimationComplete]);

  // Terminal animation
  const animateTerminal = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDisplayText("");

    const steps = [
      { text: "> initializing...", delay: 200 },
      { text: "> loading module...", delay: 300 },
      { text: `> ${text}`, delay: 100 },
    ];

    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex < steps.length - 1) {
        setDisplayText(steps[stepIndex].text);
        setTimeout(() => {
          stepIndex++;
          runStep();
        }, steps[stepIndex].delay);
      } else {
        // Final step - typewriter the actual text
        let charIndex = 0;
        const finalText = text;
        setDisplayText("");

        const typeInterval = setInterval(() => {
          setDisplayText(finalText.slice(0, charIndex + 1));
          charIndex++;

          if (charIndex >= finalText.length) {
            clearInterval(typeInterval);
            setIsAnimating(false);
            setHasAnimated(true);
            onAnimationComplete?.();
          }
        }, 40);
      }
    };

    runStep();
  }, [text, isAnimating, onAnimationComplete]);

  // Pixelate animation
  const animatePixelate = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const chars = text.split("");
    const revealed = new Array(chars.length).fill(false);
    let completedCount = 0;

    // Reveal in random order
    const order = chars
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5);

    const interval = setInterval(() => {
      if (completedCount < chars.length) {
        revealed[order[completedCount]] = true;
        completedCount++;

        setDisplayText(
          chars
            .map((char, i) => (revealed[i] ? char : "█"))
            .join("")
        );
      } else {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        setHasAnimated(true);
        onAnimationComplete?.();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, isAnimating, onAnimationComplete]);

  // Start animation based on type
  const startAnimation = useCallback(() => {
    switch (animation) {
      case "decode":
        return animateDecode();
      case "wave":
        return animateWave();
      case "typewriter":
        return animateTypewriter();
      case "glitch":
        return animateGlitch();
      case "cascade":
        return animateCascade();
      case "scramble":
        return animateScramble();
      case "terminal":
        return animateTerminal();
      case "pixelate":
        return animatePixelate();
      case "none":
      default:
        setDisplayText(text);
        setHasAnimated(true);
    }
  }, [
    animation,
    animateDecode,
    animateWave,
    animateTypewriter,
    animateGlitch,
    animateCascade,
    animateScramble,
    animateTerminal,
    animatePixelate,
    text,
  ]);

  // Scroll trigger
  useEffect(() => {
    if (!triggerOnScroll || hasAnimated || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => {
              startAnimation();
            }, delay * 1000);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [triggerOnScroll, hasAnimated, delay, startAnimation]);

  // Initial animation if not scroll-triggered
  useEffect(() => {
    if (!triggerOnScroll && !hasAnimated) {
      setTimeout(() => {
        startAnimation();
      }, delay * 1000);
    }
  }, [triggerOnScroll, hasAnimated, delay, startAnimation]);

  // Hover scramble effect
  const handleHoverScramble = useCallback(() => {
    if (!enableHoverEffect || isAnimating || !hasAnimated) return;

    setIsAnimating(true);
    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) return text[index];
            if (char === " ") return " ";
            if (Math.random() > 0.5) {
              return SCRAMBLE_CHARS[
                Math.floor(Math.random() * SCRAMBLE_CHARS.length)
              ];
            }
            return char;
          })
          .join("")
      );

      iterations++;

      if (iterations > text.length + maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, 30);
  }, [text, enableHoverEffect, isAnimating, hasAnimated]);

  // Render ASCII art version
  const renderAsciiArt = () => {
    const lines = getAsciiArt(displayText);
    return (
      <pre
        className="font-mono leading-tight select-none"
        style={{
          fontSize:
            size === "sm"
              ? "0.5rem"
              : size === "lg"
              ? "1rem"
              : size === "xl"
              ? "1.25rem"
              : "0.75rem",
        }}
      >
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    );
  };

  // Render regular text with wave animation support
  const renderText = () => {
    if (animation === "wave" || animation === "cascade") {
      return (
        <span className="inline-flex flex-wrap">
          {displayText.split("").map((char, i) => (
            <span
              key={i}
              className="wave-char inline-block"
              style={{
                opacity: hasAnimated ? 1 : 0,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      );
    }

    return displayText;
  };

  return (
    <div
      ref={containerRef}
      className={`ascii-heading relative inline-block ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
        handleHoverScramble();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        className={`font-mono font-bold tracking-wider ${sizeClasses[size]} transition-all duration-300`}
        style={{
          color: color,
          textShadow: enableGlow
            ? `
              0 0 5px ${glowColor},
              0 0 10px ${glowColor},
              0 0 20px ${glowColor},
              0 0 40px ${glowColor}
            `
            : "none",
          filter: isHovered && enableHoverEffect ? "brightness(1.2)" : "none",
        }}
      >
        {/* Prefix */}
        {prefix && (
          <span className="text-[var(--terminal-orange)] mr-2 opacity-70">
            {prefix}
          </span>
        )}

        {/* Main text */}
        {useAsciiFont ? renderAsciiArt() : renderText()}

        {/* Suffix / Cursor */}
        {suffix && (
          <span
            className="ml-1"
            style={{
              opacity: suffix.includes("_") || suffix.includes("█")
                ? cursorVisible
                  ? 1
                  : 0
                : 1,
            }}
          >
            {suffix}
          </span>
        )}
      </Component>

      {/* Underline effect */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-500 ease-out"
        style={{
          width: isHovered ? "100%" : "0%",
          background: `linear-gradient(90deg, ${color}, transparent)`,
          boxShadow: `0 0 10px ${glowColor}`,
        }}
      />

      {/* Glitch layers */}
      {isHovered && enableHoverEffect && (
        <>
          <span
            className="absolute top-0 left-0 opacity-70 pointer-events-none"
            style={{
              color: "#ff0000",
              clipPath: "inset(10% 0 60% 0)",
              transform: "translateX(-2px)",
              animation: "glitchAnim1 0.3s infinite",
            }}
            aria-hidden="true"
          >
            <Component
              className={`font-mono font-bold tracking-wider ${sizeClasses[size]}`}
            >
              {prefix}
              {displayText}
              {suffix}
            </Component>
          </span>
          <span
            className="absolute top-0 left-0 opacity-70 pointer-events-none"
            style={{
              color: "#00ffff",
              clipPath: "inset(50% 0 20% 0)",
              transform: "translateX(2px)",
              animation: "glitchAnim2 0.3s infinite",
            }}
            aria-hidden="true"
          >
            <Component
              className={`font-mono font-bold tracking-wider ${sizeClasses[size]}`}
            >
              {prefix}
              {displayText}
              {suffix}
            </Component>
          </span>
        </>
      )}

      {/* CSS for glitch animation */}
      <style jsx>{`
        @keyframes glitchAnim1 {
          0% {
            clip-path: inset(10% 0 60% 0);
            transform: translateX(-2px);
          }
          20% {
            clip-path: inset(30% 0 40% 0);
            transform: translateX(2px);
          }
          40% {
            clip-path: inset(50% 0 20% 0);
            transform: translateX(-1px);
          }
          60% {
            clip-path: inset(70% 0 10% 0);
            transform: translateX(1px);
          }
          80% {
            clip-path: inset(20% 0 50% 0);
            transform: translateX(-2px);
          }
          100% {
            clip-path: inset(10% 0 60% 0);
            transform: translateX(2px);
          }
        }

        @keyframes glitchAnim2 {
          0% {
            clip-path: inset(50% 0 20% 0);
            transform: translateX(2px);
          }
          20% {
            clip-path: inset(10% 0 70% 0);
            transform: translateX(-2px);
          }
          40% {
            clip-path: inset(80% 0 5% 0);
            transform: translateX(1px);
          }
          60% {
            clip-path: inset(25% 0 45% 0);
            transform: translateX(-1px);
          }
          80% {
            clip-path: inset(60% 0 30% 0);
            transform: translateX(2px);
          }
          100% {
            clip-path: inset(50% 0 20% 0);
            transform: translateX(-2px);
          }
        }
      `}</style>
    </div>
  );
}

// Export preset configurations for common use cases
export const HeadingPresets = {
  hero: {
    animation: "decode" as AnimationType,
    size: "xl" as const,
    enableGlow: true,
    prefix: ">",
    suffix: "_",
  },
  section: {
    animation: "wave" as AnimationType,
    size: "lg" as const,
    enableGlow: true,
    prefix: "$",
  },
  subsection: {
    animation: "scramble" as AnimationType,
    size: "md" as const,
    enableGlow: false,
    prefix: "//",
  },
  terminal: {
    animation: "terminal" as AnimationType,
    size: "md" as const,
    enableGlow: true,
    prefix: "root@portfolio:~#",
  },
};
