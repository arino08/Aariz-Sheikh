"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "./PerformanceProvider";

gsap.registerPlugin(ScrollTrigger);

type AsciiPattern =
  | "circuit"
  | "wave"
  | "matrix"
  | "binary"
  | "dots"
  | "arrows"
  | "blocks"
  | "code";

interface AsciiDividerProps {
  pattern?: AsciiPattern;
  className?: string;
  animated?: boolean;
  color?: string;
  height?: "sm" | "md" | "lg";
  glowEffect?: boolean;
  speed?: "slow" | "normal" | "fast";
}

// ASCII patterns - base units that will be repeated
const patterns: Record<AsciiPattern, string[]> = {
  circuit: [
    "───┬────────┬───",
    "   │ ┌───┐  │   ",
    "───┼─┤░░░├──┼───",
    "   │ └─┬─┘  │   ",
    "───┴───┴────┴───",
  ],
  wave: [
    "     ██          ",
    "   ██  ██        ",
    " ██      ██   ███",
    "██        ██ ██  ",
    "            █    ",
  ],
  matrix: [
    "01001000 01100101 ",
    "10110101 00111010 ",
    "01100100 00101110 ",
    "11011010 01010101 ",
    "01001000 01100101 ",
  ],
  binary: [
    "▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀",
    "░░░░░░░░░░░░░░░░",
    "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
    "░░░░░░░░░░░░░░░░",
    "▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄",
  ],
  dots: [
    "  ·  ·  ·  ·  ",
    " · ● · ● · ● ·",
    "· ● ○ ● ○ ● ○ ●",
    " · ● · ● · ● ·",
    "  ·  ·  ·  ·  ",
  ],
  arrows: [
    ">>>>>>>>>>>>>>>>",
    "<<<<<<<<<<<<<<<<",
    "→ → → → → → → → ",
    ">>>>>>>>>>>>>>>>",
    "<<<<<<<<<<<<<<<<",
  ],
  blocks: [
    "████░░░░████░░░░",
    "░░░░████░░░░████",
    "████░░░░████░░░░",
    "░░░░████░░░░████",
    "████░░░░████░░░░",
  ],
  code: [
    "/* ════════════════════ */",
    "   fn section() { next }  ",
    "/* ════════════════════ */",
    "   let div = '═'.repeat() ",
    "/* ════════════════════ */",
  ],
};

export default function AsciiDivider({
  pattern = "circuit",
  className = "",
  animated = true,
  color = "var(--terminal-green)",
  height = "md",
  glowEffect = true,
  speed = "normal",
}: AsciiDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [repeatCount, setRepeatCount] = useState(10);

  // Get performance settings
  const { settings } = usePerformance();

  // Override animation based on performance settings
  const effectiveAnimated = animated && settings.enableAsciiAnimations;
  const effectiveGlow = glowEffect && settings.enableGlow;

  const patternLines = useMemo(() => patterns[pattern], [pattern]);

  // Height classes
  const heightClasses = {
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
  };

  // Animation speed - memoized to avoid dependency issues
  const animationDurations = useMemo(
    () => ({
      slow: 60,
      normal: 30,
      fast: 15,
    }),
    [],
  );

  // Calculate repeat count based on viewport width
  useEffect(() => {
    const calculateRepeatCount = () => {
      if (typeof window !== "undefined") {
        const viewportWidth = window.innerWidth;
        const patternWidth = patternLines[0].length * 8; // Approximate character width in pixels
        const count = Math.ceil((viewportWidth * 3) / patternWidth) + 2; // 3x for smooth scrolling
        setRepeatCount(count);
      }
    };

    calculateRepeatCount();
    window.addEventListener("resize", calculateRepeatCount);
    return () => window.removeEventListener("resize", calculateRepeatCount);
  }, [patternLines]);

  // Scroll-triggered visibility
  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => {
        if (effectiveAnimated) {
          setIsVisible(false);
          setVisibleLines([]);
        }
      },
    });

    return () => trigger.kill();
  }, [effectiveAnimated]);

  // Staggered line reveal animation
  useEffect(() => {
    if (!isVisible || !effectiveAnimated) {
      if (isVisible && !effectiveAnimated) {
        setVisibleLines(patternLines.map((_, i) => i));
      }
      return;
    }

    setVisibleLines([]);

    patternLines.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
      }, index * 100);
    });
  }, [isVisible, effectiveAnimated, patternLines]);

  // Horizontal scroll animation for animated patterns
  useEffect(() => {
    if (!effectiveAnimated || !isVisible) return;

    const duration = animationDurations[speed];
    let animationFrame: number;
    let startTime: number;
    let lastFrameTime = 0;

    // Throttle to target FPS based on performance level
    const targetFPS =
      settings.level === "high" ? 60 : settings.level === "medium" ? 30 : 20;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      // Throttle frame rate
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < frameInterval) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;

      // Create smooth scrolling effect
      const totalElapsed = timestamp - startTime;
      const offset = (totalElapsed / (duration * 1000)) * 100;
      setScrollOffset(offset % 100);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [effectiveAnimated, isVisible, speed, animationDurations, settings.level]);

  // Create repeated pattern line
  const createRepeatedLine = (line: string): string => {
    return line.repeat(repeatCount);
  };

  // Render a single animated line
  const renderLine = (line: string, index: number) => {
    const isLineVisible = visibleLines.includes(index);
    const repeatedLine = createRepeatedLine(line);

    return (
      <div
        key={index}
        className={`overflow-hidden w-full ${
          settings.enableAnimations
            ? `transition-all duration-500 ${
                isLineVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`
            : "opacity-100"
        }`}
        style={{
          transitionDelay: settings.enableAnimations
            ? `${index * 50}ms`
            : "0ms",
        }}
      >
        <div
          className="whitespace-nowrap"
          style={{
            transform: effectiveAnimated
              ? `translateX(-${scrollOffset}%)`
              : "none",
            willChange: effectiveAnimated ? "transform" : "auto",
          }}
        >
          <pre
            className="whitespace-pre font-mono text-[10px] md:text-xs leading-tight inline-block"
            style={{
              color: color,
              textShadow: effectiveGlow
                ? `0 0 5px ${color}, 0 0 10px ${color}40`
                : "none",
            }}
          >
            {repeatedLine}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${heightClasses[height]} ${className}`}
      aria-hidden="true"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      {/* Background glow effect */}
      {effectiveGlow && isVisible && (
        <div
          className="absolute inset-0 opacity-20 blur-xl pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          }}
        />
      )}

      {/* ASCII pattern container - full width */}
      <div className="relative flex flex-col justify-center h-full w-full">
        {patternLines.map((line, index) => renderLine(line, index))}
      </div>

      {/* Fade edges for seamless scroll */}
      <div
        className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, #0D1117, transparent)`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10"
        style={{
          background: `linear-gradient(270deg, #0D1117, transparent)`,
        }}
      />

      {/* Scanline effect */}
      {effectiveGlow && isVisible && settings.enableScanlines && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          }}
        />
      )}
    </div>
  );
}

// Preset divider variations for easy use
export function CircuitDivider(props: Omit<AsciiDividerProps, "pattern">) {
  return <AsciiDivider {...props} pattern="circuit" />;
}

export function WaveDivider(props: Omit<AsciiDividerProps, "pattern">) {
  return <AsciiDivider {...props} pattern="wave" />;
}

export function MatrixDivider(props: Omit<AsciiDividerProps, "pattern">) {
  return <AsciiDivider {...props} pattern="matrix" />;
}

export function BinaryDivider(props: Omit<AsciiDividerProps, "pattern">) {
  return <AsciiDivider {...props} pattern="binary" />;
}

export function CodeDivider(props: Omit<AsciiDividerProps, "pattern">) {
  return <AsciiDivider {...props} pattern="code" />;
}
