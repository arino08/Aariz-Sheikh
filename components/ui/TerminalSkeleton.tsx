"use client";

import { useEffect, useState, useRef } from "react";

interface TerminalSkeletonProps {
  /** Type of skeleton to display */
  variant?:
    | "text"
    | "heading"
    | "paragraph"
    | "card"
    | "avatar"
    | "code"
    | "list"
    | "grid";
  /** Number of lines for text variants */
  lines?: number;
  /** Width of the skeleton (CSS value) */
  width?: string;
  /** Height of the skeleton (CSS value) */
  height?: string;
  /** Whether to show the typing animation */
  animated?: boolean;
  /** Custom class name */
  className?: string;
  /** Show ASCII loading animation */
  asciiLoader?: boolean;
  /** Loading text to display */
  loadingText?: string;
}

// ASCII spinner frames
const ASCII_SPINNERS = {
  dots: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  line: ["-", "\\", "|", "/"],
  arrow: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  bounce: ["⠁", "⠂", "⠄", "⠂"],
  pulse: ["█", "▓", "▒", "░", "▒", "▓"],
  blocks: ["▖", "▘", "▝", "▗"],
  braille: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
};

export default function TerminalSkeleton({
  variant = "text",
  lines = 3,
  width,
  height,
  animated = true,
  className = "",
  asciiLoader = false,
  loadingText = "Loading",
}: TerminalSkeletonProps) {
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [dots, setDots] = useState("");
  const spinner = ASCII_SPINNERS.braille;

  // Animate spinner
  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setSpinnerFrame((prev) => (prev + 1) % spinner.length);
    }, 80);

    return () => clearInterval(interval);
  }, [animated, spinner.length]);

  // Animate loading dots
  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, [animated]);

  // Base skeleton line component
  const SkeletonLine = ({
    widthClass = "w-full",
    heightClass = "h-4",
    extraClass = "",
  }: {
    widthClass?: string;
    heightClass?: string;
    extraClass?: string;
  }) => (
    <div
      className={`relative overflow-hidden bg-gray-800/50 rounded ${widthClass} ${heightClass} ${extraClass}`}
    >
      {animated && (
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}
    </div>
  );

  // ASCII Loading indicator
  if (asciiLoader) {
    return (
      <div className={`font-mono text-[var(--terminal-green)] ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{spinner[spinnerFrame]}</span>
          <span>
            {loadingText}
            {dots}
          </span>
        </div>
      </div>
    );
  }

  // Variant renderers
  switch (variant) {
    case "heading":
      return (
        <div className={`space-y-2 ${className}`} style={{ width }}>
          <SkeletonLine widthClass="w-3/4" heightClass="h-8" />
          <SkeletonLine widthClass="w-1/2" heightClass="h-4" />
        </div>
      );

    case "paragraph":
      return (
        <div className={`space-y-2 ${className}`} style={{ width }}>
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLine
              key={i}
              widthClass={i === lines - 1 ? "w-2/3" : "w-full"}
            />
          ))}
        </div>
      );

    case "card":
      return (
        <div
          className={`bg-[#161B22] border border-gray-800 rounded-xl overflow-hidden ${className}`}
          style={{ width, height }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#21262D] border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-700" />
              <div className="w-3 h-3 rounded-full bg-gray-700" />
              <div className="w-3 h-3 rounded-full bg-gray-700" />
            </div>
            <SkeletonLine widthClass="w-32" heightClass="h-3" />
          </div>
          {/* Card body */}
          <div className="p-4 space-y-3">
            <SkeletonLine widthClass="w-full" heightClass="h-32" />
            <SkeletonLine widthClass="w-3/4" heightClass="h-5" />
            <SkeletonLine widthClass="w-full" heightClass="h-3" />
            <SkeletonLine widthClass="w-5/6" heightClass="h-3" />
            <div className="flex gap-2 mt-4">
              <SkeletonLine widthClass="w-20" heightClass="h-8" />
              <SkeletonLine widthClass="w-20" heightClass="h-8" />
            </div>
          </div>
        </div>
      );

    case "avatar":
      return (
        <div className={`flex items-center gap-4 ${className}`}>
          <div className="relative overflow-hidden bg-gray-800/50 rounded-xl w-16 h-16">
            {animated && (
              <div
                className="absolute inset-0 -translate-x-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent)",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            )}
          </div>
          <div className="space-y-2 flex-1">
            <SkeletonLine widthClass="w-32" heightClass="h-4" />
            <SkeletonLine widthClass="w-24" heightClass="h-3" />
          </div>
        </div>
      );

    case "code":
      return (
        <div
          className={`bg-[#161B22] border border-gray-800 rounded-xl overflow-hidden ${className}`}
          style={{ width }}
        >
          {/* Code header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#21262D] border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]/50" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/50" />
              <div className="w-3 h-3 rounded-full bg-[#27ca3f]/50" />
            </div>
            <SkeletonLine widthClass="w-24" heightClass="h-3" />
          </div>
          {/* Code content */}
          <div className="p-4 font-mono text-sm space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-600 w-6 text-right text-xs">
                  {i + 1}
                </span>
                <SkeletonLine
                  widthClass={`w-${Math.floor(Math.random() * 40 + 40)}%`}
                  heightClass="h-4"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "list":
      return (
        <div className={`space-y-3 ${className}`} style={{ width }}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-[#161B22] border border-gray-800 rounded-lg"
            >
              <SkeletonLine widthClass="w-8" heightClass="h-8" />
              <div className="flex-1 space-y-2">
                <SkeletonLine widthClass="w-3/4" heightClass="h-4" />
                <SkeletonLine widthClass="w-1/2" heightClass="h-3" />
              </div>
            </div>
          ))}
        </div>
      );

    case "grid":
      return (
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}
          style={{ width }}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="bg-[#161B22] border border-gray-800 rounded-lg p-4 space-y-3"
            >
              <SkeletonLine widthClass="w-full" heightClass="h-24" />
              <SkeletonLine widthClass="w-3/4" heightClass="h-4" />
              <SkeletonLine widthClass="w-1/2" heightClass="h-3" />
            </div>
          ))}
        </div>
      );

    case "text":
    default:
      return (
        <div className={className} style={{ width, height }}>
          <SkeletonLine />
        </div>
      );
  }
}

// Terminal-style loading screen
interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
}

export function TerminalLoadingScreen({
  message = "Initializing system",
  progress,
  showProgress = false,
  className = "",
}: LoadingScreenProps) {
  const [dots, setDots] = useState("");
  const [frame, setFrame] = useState(0);
  const spinner = ASCII_SPINNERS.braille;

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    const spinnerInterval = setInterval(() => {
      setFrame((prev) => (prev + 1) % spinner.length);
    }, 80);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(spinnerInterval);
    };
  }, [spinner.length]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[200px] font-mono ${className}`}
    >
      <div className="text-[var(--terminal-green)] text-4xl mb-4">
        {spinner[frame]}
      </div>
      <div className="text-[var(--terminal-green)] mb-2">
        {message}
        {dots}
      </div>
      {showProgress && progress !== undefined && (
        <div className="w-48 mt-4">
          <div className="flex justify-between text-xs text-[var(--code-comment)] mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--terminal-green)] transition-all duration-300"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 10px var(--terminal-green)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ASCII progress bar component
interface AsciiProgressBarProps {
  progress: number;
  width?: number;
  showPercentage?: boolean;
  className?: string;
  color?: string;
}

export function AsciiProgressBar({
  progress,
  width = 20,
  showPercentage = true,
  className = "",
  color = "var(--terminal-green)",
}: AsciiProgressBarProps) {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;

  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <div className={`font-mono ${className}`} style={{ color }}>
      <span>[{bar}]</span>
      {showPercentage && (
        <span className="ml-2">{Math.round(progress)}%</span>
      )}
    </div>
  );
}

// Typing loader - shows text being "typed"
interface TypingLoaderProps {
  text?: string;
  className?: string;
}

export function TypingLoader({
  text = "Processing",
  className = "",
}: TypingLoaderProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);
  const directionRef = useRef<"forward" | "backward">("forward");

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    const typingInterval = setInterval(() => {
      if (directionRef.current === "forward") {
        if (indexRef.current < text.length) {
          setDisplayText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          setTimeout(() => {
            directionRef.current = "backward";
          }, 1000);
        }
      } else {
        if (indexRef.current > 0) {
          indexRef.current--;
          setDisplayText(text.slice(0, indexRef.current));
        } else {
          directionRef.current = "forward";
        }
      }
    }, 100);

    return () => {
      clearInterval(cursorInterval);
      clearInterval(typingInterval);
    };
  }, [text]);

  return (
    <div className={`font-mono text-[var(--terminal-green)] ${className}`}>
      <span>{displayText}</span>
      <span
        className="inline-block w-2 h-4 ml-0.5 align-middle"
        style={{
          backgroundColor: showCursor
            ? "var(--terminal-green)"
            : "transparent",
          boxShadow: showCursor ? "0 0 8px var(--terminal-green)" : "none",
        }}
      />
    </div>
  );
}

// Add shimmer animation to global styles
const shimmerStyle = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

// Inject style if not exists
if (typeof document !== "undefined") {
  const styleId = "terminal-skeleton-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = shimmerStyle;
    document.head.appendChild(style);
  }
}
