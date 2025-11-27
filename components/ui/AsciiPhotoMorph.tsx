"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";

interface AsciiPhotoMorphProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  asciiDensity?: "low" | "medium" | "high";
  animationDuration?: number;
  triggerOnHover?: boolean;
  triggerOnScroll?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  colorMode?: "green" | "multicolor" | "grayscale";
  onMorphStart?: () => void;
  onMorphComplete?: () => void;
}

// ASCII characters from dark to light
const ASCII_CHARS_DENSE = "@%#*+=-:. ";
const ASCII_CHARS_MEDIUM = "@#S%?*+;:,. ";
const ASCII_CHARS_SPARSE = "█▓▒░ ";

export default function AsciiPhotoMorph({
  src,
  alt,
  width = 300,
  height = 300,
  className = "",
  asciiDensity = "medium",
  animationDuration = 2,
  triggerOnHover = true,
  triggerOnScroll = false,
  autoPlay = false,
  autoPlayDelay = 1,
  colorMode = "green",
  onMorphStart,
  onMorphComplete,
}: AsciiPhotoMorphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLPreElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [asciiArt, setAsciiArt] = useState<string[][]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [morphProgress, setMorphProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Get ASCII character set based on density
  const getAsciiChars = () => {
    switch (asciiDensity) {
      case "low":
        return ASCII_CHARS_SPARSE;
      case "high":
        return ASCII_CHARS_DENSE;
      default:
        return ASCII_CHARS_MEDIUM;
    }
  };

  // Convert image to ASCII
  const generateAscii = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;

    // Calculate cell size for ASCII grid
    const cellWidth = asciiDensity === "high" ? 4 : asciiDensity === "low" ? 8 : 6;
    const cellHeight = cellWidth * 2; // ASCII characters are taller than wide

    const cols = Math.floor(width / cellWidth);
    const rows = Math.floor(height / cellHeight);

    // Set canvas size to match
    canvas.width = width;
    canvas.height = height;

    // Draw image to canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const asciiChars = getAsciiChars();
    const ascii: string[][] = [];

    for (let y = 0; y < rows; y++) {
      const row: string[] = [];
      for (let x = 0; x < cols; x++) {
        // Sample pixel from center of cell
        const pixelX = Math.floor(x * cellWidth + cellWidth / 2);
        const pixelY = Math.floor(y * cellHeight + cellHeight / 2);
        const i = (pixelY * width + pixelX) * 4;

        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Calculate brightness
        const brightness = (r + g + b) / 3;

        // Map brightness to ASCII character
        const charIndex = Math.floor(
          (brightness / 255) * (asciiChars.length - 1)
        );
        row.push(asciiChars[charIndex]);
      }
      ascii.push(row);
    }

    setAsciiArt(ascii);
  }, [width, height, asciiDensity]);

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      generateAscii();
    };
    img.src = src;
  }, [src, generateAscii]);

  // Morph animation
  const startMorph = useCallback(() => {
    if (isRevealed || !imageLoaded) return;

    onMorphStart?.();

    gsap.to(
      { progress: 0 },
      {
        progress: 1,
        duration: animationDuration,
        ease: "power2.inOut",
        onUpdate: function () {
          setMorphProgress(this.targets()[0].progress);
        },
        onComplete: () => {
          setIsRevealed(true);
          setHasAnimated(true);
          onMorphComplete?.();
        },
      }
    );
  }, [isRevealed, imageLoaded, animationDuration, onMorphStart, onMorphComplete]);

  // Reverse morph
  const reverseMorph = useCallback(() => {
    if (!isRevealed) return;

    gsap.to(
      { progress: 1 },
      {
        progress: 0,
        duration: animationDuration * 0.7,
        ease: "power2.inOut",
        onUpdate: function () {
          setMorphProgress(this.targets()[0].progress);
        },
        onComplete: () => {
          setIsRevealed(false);
        },
      }
    );
  }, [isRevealed, animationDuration]);

  // Auto-play trigger
  useEffect(() => {
    if (autoPlay && imageLoaded && !hasAnimated) {
      const timer = setTimeout(() => {
        startMorph();
      }, autoPlayDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, autoPlayDelay, imageLoaded, hasAnimated, startMorph]);

  // Scroll trigger
  useEffect(() => {
    if (!triggerOnScroll || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startMorph();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [triggerOnScroll, hasAnimated, startMorph]);

  // Handle hover
  const handleMouseEnter = () => {
    if (triggerOnHover && !isRevealed) {
      startMorph();
    }
  };

  const handleMouseLeave = () => {
    if (triggerOnHover && isRevealed) {
      reverseMorph();
    }
  };

  // Get color for ASCII character based on mode and position
  const getCharColor = (
    row: number,
    col: number,
    char: string,
    totalRows: number,
    totalCols: number
  ) => {
    if (colorMode === "green") {
      const intensity = 0.5 + (1 - row / totalRows) * 0.5;
      return `rgba(0, 255, 136, ${intensity})`;
    }

    if (colorMode === "multicolor") {
      // Sample color from original image
      if (canvasRef.current && imageRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          const cellWidth = width / totalCols;
          const cellHeight = height / totalRows;
          const pixelX = Math.floor(col * cellWidth + cellWidth / 2);
          const pixelY = Math.floor(row * cellHeight + cellHeight / 2);
          const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
          return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        }
      }
    }

    // Grayscale
    const charBrightness = char === " " ? 1 : 0.3 + Math.random() * 0.4;
    const gray = Math.floor(charBrightness * 200);
    return `rgb(${gray}, ${gray}, ${gray})`;
  };

  // Calculate which characters should be revealed based on progress
  const shouldRevealChar = (row: number, col: number, totalRows: number, totalCols: number) => {
    // Create a wave effect from center
    const centerX = totalCols / 2;
    const centerY = totalRows / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const dist = Math.sqrt(
      Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
    );
    const normalizedDist = dist / maxDist;

    // Add some randomness for organic feel
    const randomOffset = Math.random() * 0.1;
    const threshold = morphProgress * 1.3 - normalizedDist + randomOffset;

    return threshold > 0.3;
  };

  // Render scrambled character during transition
  const getTransitionChar = (originalChar: string, progress: number) => {
    if (progress > 0.8) return originalChar;

    const glitchChars = "█▓▒░@#$%&*+=-~^";
    if (Math.random() > progress + 0.3) {
      return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    return originalChar;
  };

  return (
    <div
      ref={containerRef}
      className={`ascii-photo-morph relative overflow-hidden ${className}`}
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ASCII Layer */}
      <pre
        ref={asciiRef}
        className="absolute inset-0 font-mono leading-none overflow-hidden select-none"
        style={{
          fontSize: asciiDensity === "high" ? "4px" : asciiDensity === "low" ? "8px" : "6px",
          opacity: 1 - morphProgress * 0.7,
          filter: `blur(${morphProgress * 2}px)`,
          transition: "opacity 0.1s, filter 0.1s",
        }}
        aria-hidden="true"
      >
        {asciiArt.map((row, rowIndex) => (
          <div key={rowIndex} className="whitespace-pre flex justify-center">
            {row.map((char, colIndex) => {
              const isRevealing = shouldRevealChar(
                rowIndex,
                colIndex,
                asciiArt.length,
                row.length
              );
              const displayChar =
                morphProgress > 0 && morphProgress < 1
                  ? getTransitionChar(char, morphProgress)
                  : char;

              return (
                <span
                  key={colIndex}
                  style={{
                    color: getCharColor(
                      rowIndex,
                      colIndex,
                      char,
                      asciiArt.length,
                      row.length
                    ),
                    opacity: isRevealing ? 1 - morphProgress : 1,
                    textShadow:
                      morphProgress < 0.5
                        ? `0 0 ${4 - morphProgress * 8}px rgba(0, 255, 136, 0.5)`
                        : "none",
                    transition: "opacity 0.05s",
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
          </div>
        ))}
      </pre>

      {/* Real Photo Layer */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: morphProgress,
          transform: `scale(${0.95 + morphProgress * 0.05})`,
          filter: `blur(${(1 - morphProgress) * 4}px) brightness(${0.8 + morphProgress * 0.2})`,
          transition: "transform 0.1s, filter 0.1s",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover rounded-lg"
          style={{
            clipPath:
              morphProgress < 1
                ? `circle(${morphProgress * 75}% at 50% 50%)`
                : "none",
          }}
        />
      </div>

      {/* Glitch lines during transition */}
      {morphProgress > 0 && morphProgress < 1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-[#00ff88]"
              style={{
                top: `${20 + i * 15 + Math.sin(morphProgress * 10 + i) * 5}%`,
                opacity: Math.random() * 0.5,
                transform: `translateX(${Math.sin(morphProgress * 20 + i) * 10}px)`,
                boxShadow: "0 0 10px rgba(0, 255, 136, 0.8)",
              }}
            />
          ))}
        </div>
      )}

      {/* Border glow effect */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 ${20 + morphProgress * 10}px rgba(0, 255, 136, ${0.2 - morphProgress * 0.15}),
            0 0 ${30 - morphProgress * 20}px rgba(0, 255, 136, ${0.3 - morphProgress * 0.25})
          `,
          border: `1px solid rgba(0, 255, 136, ${0.5 - morphProgress * 0.4})`,
        }}
      />

      {/* Loading state */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117]">
          <div className="font-mono text-[#00ff88] text-sm animate-pulse">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}

// Export a simpler version for section headings
export function AsciiText({
  text,
  className = "",
  animate = true,
  glowColor = "var(--terminal-green)",
}: {
  text: string;
  className?: string;
  animate?: boolean;
  glowColor?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`█▓▒░";

  const scramble = useCallback(() => {
    if (!animate || isAnimating) return;

    setIsAnimating(true);
    let iterations = 0;
    const maxIterations = text.length * 3;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations / 3) {
              return text[index];
            }
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, animate, isAnimating, chars]);

  return (
    <span
      className={`font-mono cursor-default ${className}`}
      onMouseEnter={scramble}
      style={{
        textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
      }}
    >
      {displayText}
    </span>
  );
}
