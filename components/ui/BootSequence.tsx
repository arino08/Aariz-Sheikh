"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

interface BootLine {
  text: string;
  type: "bios" | "info" | "ok" | "loading" | "success" | "ascii" | "blank";
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
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showMemoryTest]);

  // Boot lines configuration
  const bootLinesRef = useRef<BootLine[]>([
    { text: "", type: "blank", delay: 200 },
    {
      text: "╔══════════════════════════════════════════════════════════════════╗",
      type: "ascii",
      delay: 50,
    },
    {
      text: "║     AARIZ-BIOS (C) 2024 Sheikh Technologies, Inc.                ║",
      type: "ascii",
      delay: 50,
    },
    {
      text: "║     PORTFOLIO SYSTEM BIOS - Version 2.0.24                       ║",
      type: "ascii",
      delay: 50,
    },
    {
      text: "╚══════════════════════════════════════════════════════════════════╝",
      type: "ascii",
      delay: 50,
    },
    { text: "", type: "blank", delay: 100 },
    {
      text: "AARIZ-BIOS Date: 01/15/2024   Time: 00:00:00",
      type: "bios",
      delay: 80,
    },
    { text: "", type: "blank", delay: 50 },
    {
      text: "CPU: Developer Brain @ 3.6GHz (Turbo: ∞)",
      type: "info",
      delay: 60,
    },
    { text: "MEMORY_TEST", type: "loading", delay: 400 },
    { text: "Memory Test Passed: 32768MB OK", type: "ok", delay: 100 },
    { text: "", type: "blank", delay: 50 },
    { text: "Detecting IDE Drives...", type: "info", delay: 150 },
    { text: "  Primary Master  : Next.js 15.4.4 [SSD]", type: "ok", delay: 80 },
    { text: "  Primary Slave   : React 19.1.0 [SSD]", type: "ok", delay: 80 },
    { text: "  Secondary Master: TypeScript 5.x [SSD]", type: "ok", delay: 80 },
    {
      text: "  Secondary Slave : Tailwind CSS 4.x [SSD]",
      type: "ok",
      delay: 80,
    },
    { text: "", type: "blank", delay: 50 },
    {
      text: "Initializing Hardware Abstraction Layer...",
      type: "info",
      delay: 100,
    },
    {
      text: "  ├── three.js@0.178.0 ...................... [LOADED]",
      type: "ok",
      delay: 60,
    },
    {
      text: "  ├── @react-three/fiber@9.2.0 .............. [LOADED]",
      type: "ok",
      delay: 60,
    },
    {
      text: "  ├── gsap@3.13.0 ........................... [LOADED]",
      type: "ok",
      delay: 60,
    },
    {
      text: "  ├── @supabase/supabase-js@2.76.0 .......... [LOADED]",
      type: "ok",
      delay: 60,
    },
    {
      text: "  └── framer-motion (optional) .............. [SKIPPED]",
      type: "info",
      delay: 60,
    },
    { text: "", type: "blank", delay: 50 },
    { text: "PCI Device Enumeration:", type: "info", delay: 80 },
    {
      text: "  GPU: WebGL 2.0 - NVIDIA GeForce RTX Mental",
      type: "ok",
      delay: 60,
    },
    { text: "  Audio: Web Audio API [Enabled]", type: "ok", delay: 60 },
    { text: "  Network: Ethernet [Connected]", type: "ok", delay: 60 },
    { text: "", type: "blank", delay: 50 },
    { text: "Loading portfolio.sys...", type: "loading", delay: 200 },
    { text: "PROGRESS_BAR", type: "loading", delay: 800 },
    { text: "", type: "blank", delay: 50 },
    { text: "All systems operational.", type: "success", delay: 100 },
    { text: "", type: "blank", delay: 50 },
    {
      text: "╔══════════════════════════════════════════════════════════════════╗",
      type: "ascii",
      delay: 30,
    },
    {
      text: "║  System Ready. Press any key to continue...                      ║",
      type: "ascii",
      delay: 30,
    },
    {
      text: "╚══════════════════════════════════════════════════════════════════╝",
      type: "ascii",
      delay: 30,
    },
    { text: "COMPLETE", type: "success", delay: 500 },
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
          { text: `Memory Test: ${currentMemoryCount}MB`, type: "loading" },
        ]);

        // Animate memory count
        const memInterval = setInterval(() => {
          currentMemoryCount += 1024;
          setMemoryCount(currentMemoryCount);
          if (currentMemoryCount >= 32768) {
            clearInterval(memInterval);
            setShowMemoryTest(false);
          }
        }, 30);

        setTimeout(() => {
          lineIdx++;
          charIdx = 0;
          processLine();
        }, line.delay + 500);
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
          progress += 2;
          setProgressWidth(progress);
          if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              lineIdx++;
              charIdx = 0;
              processLine();
            }, 200);
          }
        }, 15);
        return;
      }

      if (line.text === "COMPLETE") {
        setIsComplete(true);
        setTimeout(onComplete, line.delay);
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
        const charDelay = line.type === "ascii" ? 2 : 8 + Math.random() * 12;
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
    setTimeout(processLine, 500);
  }, [isComplete, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines]);

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
      default:
        return "text-gray-300";
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black z-[99999] overflow-hidden transition-opacity duration-500 ${
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
            "linear-gradient(90deg, transparent, rgba(0,255,136,0.1), transparent)",
        }}
      />

      {/* Terminal content */}
      <div
        ref={containerRef}
        className="relative z-20 h-full overflow-y-auto p-6 md:p-10 font-mono text-xs md:text-sm"
        style={{ textShadow: "0 0 5px currentColor" }}
      >
        {/* Boot lines */}
        <div className="space-y-0.5 max-w-4xl">
          {displayedLines.map((line, index) => {
            // Handle progress bar
            if (line.text === "PROGRESS" && line.type === "loading") {
              return (
                <div key={index} className="py-1">
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--terminal-orange)]">
                      Loading:
                    </span>
                    <div className="flex-1 max-w-md h-4 bg-gray-900 border border-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--terminal-green)] to-[var(--terminal-blue)] transition-all duration-100"
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
            if (
              line.type === "loading" &&
              line.text.startsWith("Memory Test:")
            ) {
              return (
                <div key={index} className="text-[var(--terminal-orange)]">
                  Memory Test: {memoryCount.toLocaleString()}KB
                  {showMemoryTest && (
                    <span className="animate-pulse ml-2">▓</span>
                  )}
                </div>
              );
            }

            return (
              <div key={index} className={`${getLineColor(line.type)}`}>
                {line.text || "\u00A0"}
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
        <div className="absolute bottom-6 right-6 z-30 animate-fadeIn">
          <button
            onClick={handleSkip}
            className="font-mono text-xs text-gray-500 hover:text-[var(--terminal-green)] border border-gray-700 hover:border-[var(--terminal-green)] px-4 py-2 rounded transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,255,136,0.3)]"
          >
            Press ESC or click to skip
          </button>
        </div>
      )}

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0a0a0a] border-t border-gray-800 flex items-center justify-between px-4 z-30">
        <div className="font-mono text-[10px] text-gray-600">
          AARIZ-BIOS v2.0.24
        </div>
        <div className="font-mono text-[10px] text-gray-600">
          {new Date().toLocaleTimeString()}
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
          animation: scanline 8s linear infinite;
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
