"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";

interface HeroAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  enableMorph?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

// ASCII characters from dark to light for image conversion
const ASCII_CHARS = "@%#*+=-:. ";

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

export default function HeroAvatar({
  src = "/assets/devpfp.jpg",
  alt = "Developer Avatar",
  size = 280,
  className = "",
  enableMorph = true,
  autoPlay = true,
  autoPlayDelay = 1.5,
}: HeroAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [asciiArt, setAsciiArt] = useState<string[][]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [morphProgress, setMorphProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(true);

  const { enableAnimations, enableGlow } = usePerformanceSettings();

  // Generate ASCII art from image
  const generateAscii = useCallback(
    (img: HTMLImageElement) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cellWidth = 6;
      const cellHeight = 12;
      const cols = Math.floor(size / cellWidth);
      const rows = Math.floor(size / cellHeight);

      canvas.width = size;
      canvas.height = size;

      // Draw circular clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;

      const ascii: string[][] = [];

      for (let y = 0; y < rows; y++) {
        const row: string[] = [];
        for (let x = 0; x < cols; x++) {
          const pixelX = Math.floor(x * cellWidth + cellWidth / 2);
          const pixelY = Math.floor(y * cellHeight + cellHeight / 2);
          const i = (pixelY * size + pixelX) * 4;

          const r = pixels[i] || 0;
          const g = pixels[i + 1] || 0;
          const b = pixels[i + 2] || 0;
          const a = pixels[i + 3] || 0;

          // Check if pixel is within circle
          const distFromCenter = Math.sqrt(
            Math.pow(pixelX - size / 2, 2) + Math.pow(pixelY - size / 2, 2),
          );

          if (distFromCenter > size / 2 || a < 128) {
            row.push(" ");
            continue;
          }

          const brightness = (r + g + b) / 3;
          const charIndex = Math.floor(
            (brightness / 255) * (ASCII_CHARS.length - 1),
          );
          row.push(ASCII_CHARS[charIndex]);
        }
        ascii.push(row);
      }

      setAsciiArt(ascii);
    },
    [size],
  );

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      generateAscii(img);
      setImageLoaded(true);
    };
    img.src = src;
  }, [src, generateAscii]);

  // Terminal boot sequence
  useEffect(() => {
    if (!enableAnimations) {
      setShowTerminal(false);
      return;
    }

    const bootSequence = [
      "> Initializing avatar system...",
      "> Loading profile data...",
      "> Decoding image matrix...",
      "> Rendering ASCII representation...",
      "> System ready.",
    ];

    let lineIndex = 0;
    const lines: string[] = [];

    const addLine = () => {
      if (lineIndex < bootSequence.length) {
        lines.push(bootSequence[lineIndex]);
        setTerminalLines([...lines]);
        lineIndex++;
        setTimeout(addLine, 300);
      } else {
        setTimeout(() => {
          setShowTerminal(false);
        }, 500);
      }
    };

    addLine();
  }, [enableAnimations]);

  // Morph animation
  const startMorph = useCallback(() => {
    if (!enableAnimations || !enableMorph || hasAnimated) return;

    gsap.to(
      { progress: 0 },
      {
        progress: 1,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function () {
          setMorphProgress(this.targets()[0].progress);
        },
        onComplete: () => {
          setHasAnimated(true);
        },
      },
    );
  }, [enableAnimations, enableMorph, hasAnimated]);

  // Reverse morph on hover
  const reverseMorph = useCallback(() => {
    if (!enableAnimations || !hasAnimated) return;

    gsap.to(
      { progress: 1 },
      {
        progress: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: function () {
          setMorphProgress(this.targets()[0].progress);
        },
      },
    );
  }, [enableAnimations, hasAnimated]);

  // Forward morph after hover
  const forwardMorph = useCallback(() => {
    if (!enableAnimations || !hasAnimated) return;

    gsap.to(
      { progress: morphProgress },
      {
        progress: 1,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: function () {
          setMorphProgress(this.targets()[0].progress);
        },
      },
    );
  }, [enableAnimations, hasAnimated, morphProgress]);

  // Auto-play trigger
  useEffect(() => {
    if (autoPlay && imageLoaded && !showTerminal && !hasAnimated) {
      const timer = setTimeout(() => {
        startMorph();
      }, autoPlayDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [
    autoPlay,
    autoPlayDelay,
    imageLoaded,
    showTerminal,
    hasAnimated,
    startMorph,
  ]);

  // Handle hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasAnimated) {
      reverseMorph();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hasAnimated) {
      forwardMorph();
    }
  };

  // Get character color based on position
  const getCharColor = (row: number, totalRows: number) => {
    const intensity = 0.4 + (1 - row / totalRows) * 0.6;
    return `rgba(0, 255, 136, ${intensity})`;
  };

  // Get transition character during morph
  const getTransitionChar = (char: string) => {
    if (morphProgress > 0.8) return char;
    const glitchChars = "█▓▒░@#$%&*";
    if (Math.random() > morphProgress + 0.3) {
      return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    return char;
  };

  return (
    <div
      ref={containerRef}
      className={`hero-avatar relative ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Terminal Boot Sequence */}
      {showTerminal && enableAnimations && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30 rounded-full overflow-hidden"
          style={{
            background: "rgba(13, 17, 23, 0.95)",
            border: "2px solid rgba(0, 255, 136, 0.5)",
          }}
        >
          <div className="p-4 font-mono text-xs text-[#00ff88] max-w-full overflow-hidden">
            {terminalLines.map((line, i) => (
              <div
                key={i}
                className="whitespace-nowrap animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  textShadow: enableGlow
                    ? "0 0 10px rgba(0, 255, 136, 0.8)"
                    : "none",
                }}
              >
                {line}
              </div>
            ))}
            <span className="inline-block w-2 h-4 bg-[#00ff88] animate-pulse ml-1" />
          </div>
        </div>
      )}

      {/* ASCII Layer */}
      {imageLoaded && !showTerminal && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 rounded-full overflow-hidden"
          style={{
            opacity: 1 - morphProgress * 0.8,
            filter: `blur(${morphProgress * 2}px)`,
            background: "rgba(13, 17, 23, 0.9)",
          }}
        >
          <pre
            className="font-mono leading-none select-none text-center overflow-hidden"
            style={{
              fontSize: "6px",
              lineHeight: "6px",
            }}
            aria-hidden="true"
          >
            {asciiArt.map((row, rowIndex) => (
              <div key={rowIndex} className="whitespace-pre">
                {row.map((char, colIndex) => {
                  const displayChar =
                    morphProgress > 0 && morphProgress < 1
                      ? getTransitionChar(char)
                      : char;

                  return (
                    <span
                      key={colIndex}
                      style={{
                        color: getCharColor(rowIndex, asciiArt.length),
                        textShadow:
                          enableGlow && morphProgress < 0.5
                            ? `0 0 ${4 - morphProgress * 8}px rgba(0, 255, 136, 0.5)`
                            : "none",
                      }}
                    >
                      {displayChar}
                    </span>
                  );
                })}
              </div>
            ))}
          </pre>
        </div>
      )}

      {/* Real Photo Layer */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
        style={{
          opacity: morphProgress,
          transform: `scale(${0.9 + morphProgress * 0.1})`,
          filter: `blur(${(1 - morphProgress) * 4}px)`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-cover rounded-full"
          style={{
            clipPath:
              morphProgress < 1
                ? `circle(${morphProgress * 50}% at 50% 50%)`
                : "circle(50% at 50% 50%)",
          }}
          priority
        />
      </div>

      {/* Glitch lines during transition */}
      {morphProgress > 0 && morphProgress < 1 && enableAnimations && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-20">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-[#00ff88]"
              style={{
                top: `${25 + i * 15 + Math.sin(morphProgress * 10 + i) * 5}%`,
                opacity: 0.5 + Math.random() * 0.3,
                transform: `translateX(${Math.sin(morphProgress * 20 + i) * 10}px)`,
                boxShadow: "0 0 8px rgba(0, 255, 136, 0.8)",
              }}
            />
          ))}
        </div>
      )}

      {/* Border frame */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none z-30"
        style={{
          border: `2px solid rgba(0, 255, 136, ${0.6 - morphProgress * 0.3})`,
          boxShadow: enableGlow
            ? `
              inset 0 0 ${20 + morphProgress * 10}px rgba(0, 255, 136, ${0.15 - morphProgress * 0.1}),
              0 0 ${30 - morphProgress * 15}px rgba(0, 255, 136, ${0.25 - morphProgress * 0.2}),
              0 0 ${60 - morphProgress * 30}px rgba(0, 255, 136, ${0.1 - morphProgress * 0.08})
            `
            : `0 0 10px rgba(0, 255, 136, 0.1)`,
        }}
      />

      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-[#00ff88] opacity-60" />
      <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-[#00ff88] opacity-60" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-[#00ff88] opacity-60" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-[#00ff88] opacity-60" />

      {/* Status indicator */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#0D1117] px-2 py-0.5 rounded-full border border-[#00ff88]/30 z-40"
        style={{
          boxShadow: enableGlow ? "0 0 10px rgba(0, 255, 136, 0.3)" : "none",
        }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full bg-[#00ff88] ${enableAnimations ? "animate-pulse" : ""}`}
        />
        <span className="font-mono text-[6px] text-[#00ff88] uppercase tracking-wider">
          {isHovered ? "ASCII Mode" : hasAnimated ? "Online" : "Booting..."}
        </span>
      </div>

      {/* Loading state */}
      {!imageLoaded && !showTerminal && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117] rounded-full">
          <div className="font-mono text-[#00ff88] text-sm animate-pulse">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
