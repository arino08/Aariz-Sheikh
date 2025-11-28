"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CoffeeIcon,
  NextJsIcon,
  ReactIcon,
  TypeScriptIcon,
  CrabIcon,
  TailwindIcon,
  ThreeJsIcon,
  SparkleIcon,
  PostgresIcon,
  StackOverflowIcon,
} from "./TerminalIcons";

interface BootSequenceProps {
  onComplete: () => void;
}

interface BootLine {
  text: string;
  type:
    | "bios"
    | "info"
    | "ok"
    | "loading"
    | "success"
    | "ascii"
    | "blank"
    | "warn"
    | "error"
    | "comment";
  delay: number;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [displayedLines, setDisplayedLines] = useState<
    { text: string; type: string }[]
  >([]);
  const [showCursor, setShowCursor] = useState(true);
  const [memoryCount, setMemoryCount] = useState(0);
  const [showMemoryTest, setShowMemoryTest] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [showCoffeeCount, setShowCoffeeCount] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Show skip hint after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowSkipHint(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Skip handler
  const handleSkip = useCallback(() => {
    if (!isComplete) {
      setIsComplete(true);
      setTimeout(onComplete, 300);
    }
  }, [isComplete, onComplete]);

  // Keyboard listener for skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Memory test animation
  useEffect(() => {
    if (showMemoryTest) {
      const targetMemory = 32768;
      const increment = 1024;
      const interval = setInterval(() => {
        setMemoryCount((prev) => {
          if (prev >= targetMemory) {
            clearInterval(interval);
            setShowMemoryTest(false);
            return targetMemory;
          }
          return prev + increment;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [showMemoryTest]);

  // Coffee counter animation
  useEffect(() => {
    if (showCoffeeCount) {
      const interval = setInterval(() => {
        setCoffeeCount((prev) => {
          if (prev >= 9999) {
            clearInterval(interval);
            setShowCoffeeCount(false);
            return 9999;
          }
          return prev + Math.floor(Math.random() * 150) + 100;
        });
      }, 15);
      return () => clearInterval(interval);
    }
  }, [showCoffeeCount]);

  // Boot lines configuration
  const bootLinesRef = useRef<BootLine[]>([
    { text: "", type: "blank", delay: 100 },
    {
      text: "+--------------------------------------------------------------+",
      type: "ascii",
      delay: 25,
    },
    {
      text: "|     AARIZ BIOS  -  Advanced Awesome Runtime Interface Zone   |",
      type: "ascii",
      delay: 25,
    },
    {
      text: "+--------------------------------------------------------------+",
      type: "ascii",
      delay: 25,
    },
    {
      text: "",
      type: "blank",
      delay: 30,
    },
    {
      text: '     (C) 2025 Sheikh Technologies - "It works on my machine"',
      type: "bios",
      delay: 50,
    },
    {
      text: "",
      type: "blank",
      delay: 30,
    },
    { text: "", type: "blank", delay: 50 },
    {
      text: "AARIZ-BIOS v3.14.159 - Built with {{COFFEE}} and existential dread",
      type: "bios",
      delay: 60,
    },
    { text: "", type: "blank", delay: 30 },
    {
      text: "// TODO: Actually finish this portfolio someday",
      type: "comment",
      delay: 60,
    },
    { text: "", type: "blank", delay: 30 },
    {
      text: "CPU: Developer Brain™ @ Variable GHz (depends on coffee intake)",
      type: "info",
      delay: 45,
    },
    {
      text: "      Cores: 2 (1 for coding, 1 for existential crisis)",
      type: "info",
      delay: 40,
    },
    { text: "MEMORY_TEST", type: "loading", delay: 250 },
    {
      text: "RAM: 32768MB OK (98% used by Chrome tabs)",
      type: "ok",
      delay: 60,
    },
    { text: "", type: "blank", delay: 30 },
    { text: "Detecting Storage Devices...", type: "info", delay: 80 },
    {
      text: "  ├── /dev/projects    : 10+ repositories [MOUNTED]",
      type: "ok",
      delay: 45,
    },
    {
      text: "  ├── /dev/node_modules: ∞ GB (why is it so big?!) [MOUNTED]",
      type: "warn",
      delay: 50,
    },
    {
      text: "  └── /dev/sleep       : 0 bytes (404 Not Found)",
      type: "error",
      delay: 50,
    },
    { text: "", type: "blank", delay: 30 },
    {
      text: "Loading Developer Stack...",
      type: "info",
      delay: 60,
    },
    {
      text: "  ├── Next.js 15 .......................... [LOADED] {{NEXTJS}}",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── React 19 ............................ [LOADED] {{REACT}}",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── TypeScript 5.x ...................... [LOADED] {{TYPESCRIPT}}",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── Rust (because I like pain) .......... [LOADED] {{RUST}}",
      type: "ok",
      delay: 40,
    },
    {
      text: "  ├── Tailwind CSS ........................ [LOADED] {{TAILWIND}}",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── Three.js ............................ [LOADED] {{THREEJS}}",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── GSAP ................................ [LOADED] {{SPARKLE}}",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── PostgreSQL .......................... [LOADED] {{POSTGRES}}",
      type: "ok",
      delay: 35,
    },
    {
      text: "  └── Stack Overflow ...................... [ESSENTIAL] {{STACKOVERFLOW}}",
      type: "ok",
      delay: 40,
    },
    { text: "", type: "blank", delay: 30 },
    { text: "Initializing Developer Environment...", type: "info", delay: 50 },
    {
      text: "  ├── Coffee Machine ...................... [CONNECTED]",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── Dark Theme .......................... [ALWAYS]",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── Impostor Syndrome ................... [ACTIVE]",
      type: "warn",
      delay: 40,
    },
    {
      text: "  ├── Ability to Google ................... [EXPERT]",
      type: "ok",
      delay: 35,
    },
    {
      text: "  └── Work-Life Balance ................... [SEGFAULT]",
      type: "error",
      delay: 45,
    },
    { text: "", type: "blank", delay: 30 },
    {
      text: "Running System Diagnostics...",
      type: "info",
      delay: 50,
    },
    {
      text: "  ├── Debugging Skills .................... [RUBBER DUCK REQUIRED]",
      type: "warn",
      delay: 45,
    },
    {
      text: '  ├── Git Commit Messages ................. ["fixed stuff" x99]',
      type: "warn",
      delay: 45,
    },
    {
      text: "  └── Code Quality ........................ [COMPILES = SHIPS]",
      type: "ok",
      delay: 45,
    },
    { text: "", type: "blank", delay: 30 },
    {
      text: "Loading User Profile: aariz@dev",
      type: "info",
      delay: 60,
    },
    {
      text: "  ├── Title: Full-Stack Developer",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── Status: 3rd Year IT Student",
      type: "ok",
      delay: 35,
    },
    {
      text: "  ├── Passion: Building cool stuff",
      type: "ok",
      delay: 35,
    },
    {
      text: "  └── Mission: Turn caffeine → code",
      type: "ok",
      delay: 40,
    },
    { text: "", type: "blank", delay: 30 },
    { text: "COFFEE_COUNT", type: "loading", delay: 180 },
    {
      text: "  {{COFFEE}} Lifetime coffees consumed: ∞ (counter overflow)",
      type: "warn",
      delay: 60,
    },
    { text: "", type: "blank", delay: 30 },
    { text: "Compiling portfolio.rs...", type: "loading", delay: 80 },
    { text: "PROGRESS_BAR", type: "loading", delay: 500 },
    { text: "", type: "blank", delay: 30 },
    {
      text: "   Finished `release` profile [optimized] target(s)",
      type: "success",
      delay: 50,
    },
    { text: "", type: "blank", delay: 30 },
    {
      text: "================================================================",
      type: "ascii",
      delay: 25,
    },
    {
      text: "  [OK] All systems nominal. Welcome to the terminal.",
      type: "success",
      delay: 40,
    },
    {
      text: "  Press any key to continue... (or don't, I'm not your mom)",
      type: "info",
      delay: 40,
    },
    {
      text: "================================================================",
      type: "ascii",
      delay: 25,
    },
    { text: "WAIT_FOR_INPUT", type: "success", delay: 0 },
  ]);

  // Main boot sequence logic
  useEffect(() => {
    if (hasStartedRef.current || isComplete) return;
    hasStartedRef.current = true;

    const bootLines = bootLinesRef.current;
    let lineIdx = 0;
    let charIdx = 0;
    let currentText = "";
    let currentMemoryCount = 0;

    const processLine = () => {
      if (isComplete) return;

      if (lineIdx >= bootLines.length) {
        return;
      }

      const line = bootLines[lineIdx];

      // Handle special line types
      if (line.text === "MEMORY_TEST") {
        setShowMemoryTest(true);
        setDisplayedLines((prev) => [
          ...prev,
          { text: `RAM Test: ${currentMemoryCount}KB`, type: "loading" },
        ]);

        // Animate memory count
        const memInterval = setInterval(() => {
          currentMemoryCount += 1024;
          setMemoryCount(currentMemoryCount);
          if (currentMemoryCount >= 32768) {
            clearInterval(memInterval);
            setShowMemoryTest(false);
          }
        }, 20);

        setTimeout(() => {
          lineIdx++;
          charIdx = 0;
          processLine();
        }, line.delay + 300);
        return;
      }

      if (line.text === "COFFEE_COUNT") {
        setShowCoffeeCount(true);
        setCoffeeCount(0);
        setDisplayedLines((prev) => [
          ...prev,
          {
            text: `  {{COFFEE}} Counting coffees consumed: ${coffeeCount}`,
            type: "loading",
          },
        ]);

        setTimeout(() => {
          setShowCoffeeCount(false);
          lineIdx++;
          charIdx = 0;
          processLine();
        }, line.delay + 200);
        return;
      }

      if (line.text === "PROGRESS_BAR") {
        setDisplayedLines((prev) => [
          ...prev,
          { text: "PROGRESS", type: "loading" },
        ]);

        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 3;
          setProgressWidth(progress);
          if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              lineIdx++;
              charIdx = 0;
              processLine();
            }, 120);
          }
        }, 12);
        return;
      }

      if (line.text === "WAIT_FOR_INPUT") {
        // Wait for user input - don't auto-complete
        return;
      }

      // Type out the line character by character
      if (charIdx === 0) {
        currentText = "";
      }

      if (charIdx < line.text.length) {
        currentText = line.text.substring(0, charIdx + 1);

        // Update or add the current line
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (
            newLines.length > 0 &&
            newLines[newLines.length - 1].type === "typing"
          ) {
            newLines[newLines.length - 1] = {
              text: currentText,
              type: "typing",
            };
          } else {
            newLines.push({ text: currentText, type: "typing" });
          }
          return newLines;
        });

        charIdx++;
        const charDelay = line.type === "ascii" ? 8 : 13 + Math.random() * 15;
        setTimeout(processLine, charDelay);
      } else {
        // Line complete, finalize it
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines.length > 0) {
            newLines[newLines.length - 1] = {
              text: line.text,
              type: line.type,
            };
          }
          return newLines;
        });

        lineIdx++;
        charIdx = 0;
        setTimeout(processLine, line.delay);
      }
    };

    // Start the boot sequence
    setTimeout(processLine, 300);
  }, [isComplete, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines, memoryCount, coffeeCount]);

  const getLineColor = (type: string) => {
    switch (type) {
      case "bios":
        return "text-[var(--terminal-blue)]";
      case "info":
        return "text-gray-400";
      case "ok":
        return "text-[var(--terminal-green)]";
      case "loading":
        return "text-[var(--terminal-orange)]";
      case "success":
        return "text-[var(--terminal-green)] font-bold";
      case "ascii":
        return "text-[var(--terminal-purple)]";
      case "typing":
        return "text-gray-300";
      case "warn":
        return "text-[var(--terminal-orange)]";
      case "error":
        return "text-red-500";
      case "comment":
        return "text-gray-600 italic";
      default:
        return "text-gray-300";
    }
  };

  // Icon mapping for replacing placeholders
  const iconMap: Record<string, React.ReactNode> = {
    "{{COFFEE}}": (
      <CoffeeIcon
        size={14}
        color="var(--terminal-orange)"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{NEXTJS}}": (
      <NextJsIcon
        size={14}
        color="var(--terminal-green)"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{REACT}}": (
      <ReactIcon
        size={14}
        color="#61DAFB"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{TYPESCRIPT}}": (
      <TypeScriptIcon
        size={14}
        color="#3178C6"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{RUST}}": (
      <CrabIcon
        size={14}
        color="#DEA584"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{TAILWIND}}": (
      <TailwindIcon
        size={14}
        color="#38BDF8"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{THREEJS}}": (
      <ThreeJsIcon
        size={14}
        color="var(--terminal-blue)"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{SPARKLE}}": (
      <SparkleIcon
        size={14}
        color="#88CE02"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{POSTGRES}}": (
      <PostgresIcon
        size={14}
        color="#336791"
        className="inline-block align-middle mx-0.5"
      />
    ),
    "{{STACKOVERFLOW}}": (
      <StackOverflowIcon
        size={14}
        color="#F48024"
        className="inline-block align-middle mx-0.5"
      />
    ),
  };

  // Render text with icon replacements
  const renderTextWithIcons = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\{\{[A-Z]+\}\}/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      // Add the icon
      const icon = iconMap[match[0]];
      if (icon) {
        parts.push(<span key={match.index}>{icon}</span>);
      } else {
        parts.push(match[0]);
      }
      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div
      className={`fixed inset-0 bg-[#0a0a0a] z-[99999] overflow-hidden transition-opacity duration-500 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handleSkip}
    >
      {/* CRT Effects */}
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      {/* CRT Curvature vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Screen flicker */}
      <div
        className="absolute inset-0 pointer-events-none z-10 animate-flicker"
        style={{ background: "rgba(255,255,255,0.02)" }}
      />

      {/* Horizontal scan line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-10 animate-scanline"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,136,0.15), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(0,255,136,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Terminal content */}
      <div
        ref={containerRef}
        className="relative z-20 h-full overflow-y-auto p-4 md:p-8 font-mono text-[10px] md:text-xs lg:text-sm"
        style={{ textShadow: "0 0 5px currentColor" }}
      >
        {/* Boot lines */}
        <div className="space-y-0.5 max-w-4xl mx-auto">
          {displayedLines.map((line, index) => {
            // Handle progress bar
            if (line.text === "PROGRESS" && line.type === "loading") {
              return (
                <div key={index} className="py-1">
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--terminal-orange)]">
                      Compiling:
                    </span>
                    <div className="flex-1 max-w-md h-4 bg-gray-900 border border-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--terminal-green)] via-[var(--terminal-blue)] to-[var(--terminal-purple)] transition-all duration-100"
                        style={{
                          width: `${progressWidth}%`,
                          boxShadow: "0 0 10px var(--terminal-green)",
                        }}
                      />
                    </div>
                    <span className="text-[var(--terminal-green)] w-12 text-right">
                      {progressWidth}%
                    </span>
                  </div>
                </div>
              );
            }

            // Handle memory test display
            if (line.type === "loading" && line.text.startsWith("RAM Test:")) {
              return (
                <div key={index} className="text-[var(--terminal-orange)]">
                  RAM Test: {memoryCount.toLocaleString()}KB
                  {showMemoryTest && (
                    <span className="animate-pulse ml-2">▓</span>
                  )}
                </div>
              );
            }

            // Handle coffee count display
            if (
              line.type === "loading" &&
              line.text.includes("Counting coffees")
            ) {
              return (
                <div
                  key={index}
                  className="text-[var(--terminal-orange)] flex items-center"
                >
                  {"  "}
                  <CoffeeIcon
                    size={14}
                    color="var(--terminal-orange)"
                    className="inline-block mx-0.5"
                  />{" "}
                  Counting coffees consumed: {coffeeCount.toLocaleString()}
                  {showCoffeeCount && (
                    <span className="animate-pulse ml-2">▓</span>
                  )}
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`${getLineColor(line.type)} flex items-center flex-wrap`}
              >
                {renderTextWithIcons(line.text || "\u00A0")}
                {/* Show cursor on the last typing line */}
                {index === displayedLines.length - 1 &&
                  line.type === "typing" && (
                    <span
                      className={`ml-0.5 ${showCursor ? "opacity-100" : "opacity-0"}`}
                    >
                      █
                    </span>
                  )}
              </div>
            );
          })}

          {/* Final cursor */}
          {displayedLines.length > 0 &&
            displayedLines[displayedLines.length - 1]?.type !== "typing" && (
              <div className="text-[var(--terminal-green)]">
                <span className={`${showCursor ? "opacity-100" : "opacity-0"}`}>
                  █
                </span>
              </div>
            )}
        </div>
      </div>

      {/* Skip hint */}
      {showSkipHint && !isComplete && (
        <div className="absolute bottom-14 right-4 md:bottom-14 md:right-6 z-30 animate-fadeIn">
          <button
            onClick={handleSkip}
            className="font-mono text-[10px] md:text-xs text-gray-500 hover:text-[var(--terminal-green)] border border-gray-700 hover:border-[var(--terminal-green)] px-3 py-1.5 md:px-4 md:py-2 rounded transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,255,136,0.3)]"
          >
            Press ESC to skip (but you&apos;ll miss the fun)
          </button>
        </div>
      )}

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#050505] border-t border-gray-800 flex items-center justify-between px-4 z-30">
        <div className="font-mono text-[10px] text-gray-600 flex items-center gap-2">
          <span className="text-[var(--terminal-green)]">●</span>
          AARIZ-BIOS v3.14.159
        </div>
        <div className="font-mono text-[10px] text-gray-600 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CoffeeIcon size={12} color="currentColor" /> ∞
          </span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes flicker {
          0%,
          100% {
            opacity: 0.02;
          }
          50% {
            opacity: 0.04;
          }
          75% {
            opacity: 0.01;
          }
        }

        @keyframes scanline {
          0% {
            top: -2px;
          }
          100% {
            top: 100%;
          }
        }

        .animate-flicker {
          animation: flicker 0.15s infinite;
        }

        .animate-scanline {
          animation: scanline 6s linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
