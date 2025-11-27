"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Hook to check performance settings from localStorage
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

    // Listen for storage changes
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

export default function AnimatedAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;
  const glowEnabled = performanceSettings.enableGlow;
  const isPotatoMode = performanceSettings.level === "potato";

  const terminalLines = [
    { type: "prompt", text: "aariz@dev:~$" },
    { type: "command", text: " whoami" },
    { type: "output", text: "Full-Stack Developer" },
    { type: "output", text: "Rust Enthusiast" },
    { type: "output", text: "3rd Year IT Student" },
    { type: "prompt", text: "aariz@dev:~$" },
    { type: "command", text: " cat skills.rs" },
    { type: "code", text: "pub struct Dev {" },
    { type: "code", text: "    frontend: Vec<&str>," },
    { type: "code", text: "    backend: Vec<&str>," },
    { type: "code", text: "    passion: bool," },
    { type: "code", text: "}" },
    { type: "prompt", text: "aariz@dev:~$" },
    { type: "command", text: " cargo run --release" },
    { type: "success", text: "▶ Building something cool..." },
  ];

  // Initialize - set all content visible immediately in potato mode
  useEffect(() => {
    if (isPotatoMode || !animationsEnabled) {
      // Show all lines immediately
      setCurrentLine(terminalLines.length);
      setDisplayedText("");
      setIsTyping(false);
    }
    setIsInitialized(true);
  }, [isPotatoMode, animationsEnabled, terminalLines.length]);

  // Typing animation - only if animations are enabled
  useEffect(() => {
    if (!isInitialized) return;
    if (isPotatoMode || !animationsEnabled) return;

    if (currentLine >= terminalLines.length) {
      // Reset after a pause
      const timeout = setTimeout(() => {
        setCurrentLine(0);
        setDisplayedText("");
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const line = terminalLines[currentLine];
    const fullText = line.text;
    let charIndex = 0;

    setIsTyping(true);
    setDisplayedText("");

    const typeChar = () => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        charIndex++;
        const speed =
          line.type === "command" ? 80 : line.type === "code" ? 40 : 20;
        setTimeout(typeChar, speed + Math.random() * 30);
      } else {
        setIsTyping(false);
        setTimeout(
          () => {
            setCurrentLine((prev) => prev + 1);
          },
          line.type === "prompt" ? 100 : 400,
        );
      }
    };

    const startDelay = setTimeout(typeChar, 200);
    return () => clearTimeout(startDelay);
  }, [
    currentLine,
    isInitialized,
    isPotatoMode,
    animationsEnabled,
    terminalLines,
  ]);

  // GSAP animations - only if animations are enabled
  useEffect(() => {
    if (!animationsEnabled || isPotatoMode) return;

    const container = containerRef.current;
    const terminal = terminalRef.current;
    const cursor = cursorRef.current;

    if (!container || !terminal || !cursor) return;

    // Floating animation
    const floatAnim = gsap.to(terminal, {
      y: -8,
      duration: 2.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Subtle rotation
    const rotateAnim = gsap.to(terminal, {
      rotateY: 3,
      rotateX: -2,
      duration: 4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Cursor blink
    const cursorAnim = gsap.to(cursor, {
      opacity: 0,
      duration: 0.5,
      ease: "steps(1)",
      yoyo: true,
      repeat: -1,
    });

    // Glow pulse
    const glowAnim = glowEnabled
      ? gsap.to(container, {
          "--glow-opacity": 0.6,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        })
      : null;

    return () => {
      floatAnim.kill();
      rotateAnim.kill();
      cursorAnim.kill();
      glowAnim?.kill();
    };
  }, [animationsEnabled, isPotatoMode, glowEnabled]);

  const getLineColor = (type: string) => {
    switch (type) {
      case "prompt":
        return "text-[var(--terminal-green)]";
      case "command":
        return "text-[var(--terminal-blue)]";
      case "output":
        return "text-gray-300";
      case "code":
        return "text-[var(--terminal-purple)]";
      case "success":
        return "text-[var(--terminal-orange)]";
      default:
        return "text-white";
    }
  };

  // In potato mode, show all lines; otherwise show up to currentLine
  const renderedLines =
    isPotatoMode || !animationsEnabled
      ? terminalLines
      : terminalLines.slice(0, currentLine);

  return (
    <div
      ref={containerRef}
      className="relative w-72 h-80 md:w-96 md:h-96"
      style={
        {
          perspective: animationsEnabled ? "1000px" : "none",
          "--glow-opacity": glowEnabled ? "0.3" : "0",
        } as React.CSSProperties
      }
    >
      {/* Ambient glow - conditional */}
      {glowEnabled && (
        <div
          className="absolute inset-0 blur-3xl transition-opacity duration-1000"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--terminal-green) 0%, transparent 70%)",
            opacity: "var(--glow-opacity)",
          }}
        />
      )}

      {/* Scan lines overlay - conditional */}
      {animationsEnabled && (
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
            }}
          />
        </div>
      )}

      {/* CRT flicker effect - conditional */}
      {animationsEnabled && (
        <div className="absolute inset-0 pointer-events-none z-20 animate-flicker opacity-[0.02] bg-white" />
      )}

      {/* Main terminal */}
      <div
        ref={terminalRef}
        className="relative w-full h-full rounded-xl overflow-hidden border border-[var(--terminal-green)]/30 shadow-2xl"
        style={{
          background:
            "linear-gradient(145deg, #0a0f14 0%, #0d1117 50%, #0a0f14 100%)",
          transformStyle: animationsEnabled ? "preserve-3d" : "flat",
          boxShadow: glowEnabled
            ? `
            0 0 0 1px rgba(0,255,136,0.1),
            0 0 30px rgba(0,255,136,0.1),
            0 25px 50px -12px rgba(0,0,0,0.8),
            inset 0 0 60px rgba(0,255,136,0.03)
          `
            : "0 25px 50px -12px rgba(0,0,0,0.8)",
        }}
      >
        {/* Terminal header */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-[var(--terminal-green)]/20 bg-[#0d1117]/80 backdrop-blur-sm">
          {/* Window controls */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div
                className="w-3 h-3 rounded-full bg-[#ff5f56]"
                style={{
                  boxShadow: glowEnabled ? "0 0 6px #ff5f56" : "none",
                }}
              />
              {animationsEnabled && (
                <div className="absolute inset-0 rounded-full bg-[#ff5f56] animate-ping opacity-20" />
              )}
            </div>
            <div className="relative group">
              <div
                className="w-3 h-3 rounded-full bg-[#ffbd2e]"
                style={{
                  boxShadow: glowEnabled ? "0 0 6px #ffbd2e" : "none",
                }}
              />
            </div>
            <div className="relative group">
              <div
                className="w-3 h-3 rounded-full bg-[#27ca3f]"
                style={{
                  boxShadow: glowEnabled ? "0 0 6px #27ca3f" : "none",
                }}
              />
            </div>
          </div>

          {/* Title */}
          <div className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-[var(--terminal-green)]/60 tracking-wider">
            aariz@portfolio — zsh
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-[var(--terminal-green)] ${animationsEnabled ? "animate-pulse" : ""}`}
              style={{
                boxShadow: glowEnabled
                  ? "0 0 8px var(--terminal-green)"
                  : "none",
              }}
            />
            <span className="font-mono text-[10px] text-[var(--terminal-green)]/60 hidden md:block">
              LIVE
            </span>
          </div>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-xs md:text-sm h-[calc(100%-48px)] overflow-hidden">
          {/* Rendered lines */}
          <div className="space-y-1">
            {renderedLines.map((line, index) => (
              <div
                key={index}
                className={`${getLineColor(line.type)} ${animationsEnabled ? "transition-all duration-300" : ""}`}
                style={
                  animationsEnabled
                    ? {
                        animation: "fadeSlideIn 0.3s ease-out forwards",
                        animationDelay: `${index * 0.05}s`,
                      }
                    : { opacity: 1 }
                }
              >
                {line.type === "code" && (
                  <span className="text-gray-600 mr-2 select-none">
                    {String(
                      index -
                        renderedLines.findIndex((l) => l.type === "code") +
                        1,
                    ).padStart(2, " ")}
                  </span>
                )}
                {line.text}
              </div>
            ))}
          </div>

          {/* Current line being typed - only show if animating */}
          {animationsEnabled &&
            !isPotatoMode &&
            currentLine < terminalLines.length && (
              <div
                className={`${getLineColor(terminalLines[currentLine].type)} flex items-center`}
              >
                {terminalLines[currentLine].type === "code" && (
                  <span className="text-gray-600 mr-2 select-none">
                    {String(
                      currentLine -
                        terminalLines.findIndex((l) => l.type === "code") +
                        1,
                    ).padStart(2, " ")}
                  </span>
                )}
                <span>{displayedText}</span>
                <span
                  ref={cursorRef}
                  className={`inline-block w-2 h-4 md:h-5 ml-0.5 bg-[var(--terminal-green)] ${
                    isTyping ? "opacity-100" : ""
                  }`}
                  style={{
                    boxShadow: glowEnabled
                      ? "0 0 8px var(--terminal-green)"
                      : "none",
                  }}
                />
              </div>
            )}

          {/* Static cursor for potato mode */}
          {(!animationsEnabled || isPotatoMode) && (
            <div className="flex items-center mt-1">
              <span className="text-[var(--terminal-green)]">aariz@dev:~$</span>
              <span
                className="inline-block w-2 h-4 md:h-5 ml-1 bg-[var(--terminal-green)]"
                style={{
                  boxShadow: glowEnabled
                    ? "0 0 8px var(--terminal-green)"
                    : "none",
                }}
              />
            </div>
          )}

          {/* ASCII art decoration */}
          <div className="absolute bottom-4 right-4 text-[var(--terminal-green)]/10 font-mono text-[8px] md:text-[10px] leading-tight select-none">
            <pre>{`
    ╔══════════════╗
    ║  < / >  { }  ║
    ║   CODING...  ║
    ╚══════════════╝
            `}</pre>
          </div>
        </div>
      </div>

      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes flicker {
          0%,
          100% {
            opacity: 0.02;
          }
          50% {
            opacity: 0.04;
          }
        }
        .animate-flicker {
          animation: flicker 0.1s infinite;
        }
      `}</style>
    </div>
  );
}
