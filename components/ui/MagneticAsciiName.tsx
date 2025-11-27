"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

// Large ASCII art name
// ASCII art name - same for all screen sizes
const ASCII_NAME = [
  " █████╗  █████╗ ██████╗ ██╗███████╗",
  "██╔══██╗██╔══██╗██╔══██╗██║╚══███╔╝",
  "███████║███████║██████╔╝██║  ███╔╝ ",
  "██╔══██║██╔══██║██╔══██╗██║ ███╔╝  ",
  "██║  ██║██║  ██║██║  ██║██║███████╗",
  "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝",
];

// Glitch characters for effect
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`█▓▒░▀▄╔╗╚╝║═";

interface MagneticAsciiNameProps {
  className?: string;
  color?: string;
  glowColor?: string;
  enableGlow?: boolean;
  enableMagnetic?: boolean;
  enableGlitch?: boolean;
  magneticStrength?: number;
  glitchIntensity?: "low" | "medium" | "high";
}

export default function MagneticAsciiName({
  className = "",
  color = "var(--terminal-green)",
  glowColor = "var(--terminal-green)",
  enableGlow = true,
  enableMagnetic = true,
  enableGlitch = true,
  magneticStrength = 0.3,
  glitchIntensity = "medium",
}: MagneticAsciiNameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[][]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchChars, setGlitchChars] = useState<Map<string, string>>(
    new Map(),
  );
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use same ASCII art for all screen sizes
  const asciiLines = ASCII_NAME;

  // Glitch intensity settings
  const intensitySettings = {
    low: { chance: 0.02, interval: 100, maxGlitched: 3 },
    medium: { chance: 0.05, interval: 50, maxGlitched: 8 },
    high: { chance: 0.1, interval: 30, maxGlitched: 15 },
  };

  const settings = intensitySettings[glitchIntensity];

  // Handle mouse move for magnetic effect
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || !enableMagnetic) return;

      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Apply magnetic effect to each character
      charsRef.current.forEach((row, rowIndex) => {
        row.forEach((char, colIndex) => {
          if (!char) return;

          const charRect = char.getBoundingClientRect();
          const charCenterX = charRect.left - rect.left + charRect.width / 2;
          const charCenterY = charRect.top - rect.top + charRect.height / 2;

          const deltaX = mousePos.current.x - charCenterX;
          const deltaY = mousePos.current.y - charCenterY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // Magnetic attraction based on distance
          const maxDistance = 150;
          if (distance < maxDistance) {
            const strength = (1 - distance / maxDistance) * magneticStrength;
            const moveX = deltaX * strength * 0.5;
            const moveY = deltaY * strength * 0.5;

            gsap.to(char, {
              x: moveX,
              y: moveY,
              scale: 1 + strength * 0.3,
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            gsap.to(char, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        });
      });
    },
    [enableMagnetic, magneticStrength],
  );

  // Handle mouse leave - reset all characters
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    charsRef.current.forEach((row) => {
      row.forEach((char) => {
        if (!char) return;
        gsap.to(char, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });

    // Clear glitch
    if (glitchIntervalRef.current) {
      clearInterval(glitchIntervalRef.current);
      glitchIntervalRef.current = null;
    }
    setGlitchChars(new Map());
  }, []);

  // Start glitch effect on hover
  useEffect(() => {
    if (!isHovered || !enableGlitch) return;

    glitchIntervalRef.current = setInterval(() => {
      const newGlitchChars = new Map<string, string>();
      let glitchedCount = 0;

      asciiLines.forEach((line, rowIndex) => {
        line.split("").forEach((char, colIndex) => {
          if (
            char !== " " &&
            Math.random() < settings.chance &&
            glitchedCount < settings.maxGlitched
          ) {
            const key = `${rowIndex}-${colIndex}`;
            newGlitchChars.set(
              key,
              GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
            );
            glitchedCount++;
          }
        });
      });

      setGlitchChars(newGlitchChars);
    }, settings.interval);

    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
    };
  }, [isHovered, enableGlitch, asciiLines, settings]);

  // Add mouse event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Get character color based on position and hover state
  const getCharStyle = (rowIndex: number, colIndex: number, char: string) => {
    const isGlitched = glitchChars.has(`${rowIndex}-${colIndex}`);
    const baseColor = color;

    // RGB split colors for glitch effect
    if (isGlitched && isHovered) {
      const colors = ["#ff0000", "#00ffff", color, "#ff00ff", "#ffff00"];
      return {
        color: colors[Math.floor(Math.random() * colors.length)],
        textShadow: `
          -2px 0 #ff0000,
          2px 0 #00ffff,
          0 0 10px ${glowColor}
        `,
      };
    }

    return {
      color: baseColor,
      textShadow: enableGlow ? `0 0 3px ${glowColor}` : "none",
    };
  };

  // Initialize refs array
  useEffect(() => {
    charsRef.current = asciiLines.map(() => []);
  }, [asciiLines]);

  return (
    <div
      ref={containerRef}
      className={`magnetic-ascii-name relative cursor-pointer select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        perspective: "1000px",
        overflow: "hidden",
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {/* Main ASCII art */}
      <pre
        className="font-mono leading-tight text-center"
        style={{
          fontSize: isMobile
            ? "clamp(0.45rem, 2.8vw, 0.65rem)"
            : "clamp(0.7rem, 2.5vw, 1.4rem)",
          letterSpacing: isMobile ? "-0.01em" : "0.08em",
          lineHeight: isMobile ? 1.1 : 1.2,
          whiteSpace: "pre",
          overflow: "hidden",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "geometricPrecision",
        }}
      >
        {asciiLines.map((line, rowIndex) => (
          <div key={rowIndex} className="whitespace-pre flex justify-center">
            {line.split("").map((char, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const glitchedChar = glitchChars.get(key);
              const displayChar = glitchedChar || char;
              const style = getCharStyle(rowIndex, colIndex, char);

              return (
                <span
                  key={colIndex}
                  ref={(el) => {
                    if (!charsRef.current[rowIndex]) {
                      charsRef.current[rowIndex] = [];
                    }
                    charsRef.current[rowIndex][colIndex] = el;
                  }}
                  className="inline-block transition-colors duration-100"
                  style={{
                    color: style.color,
                    textShadow: style.textShadow,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
          </div>
        ))}
      </pre>

      {/* Glitch overlay layers */}
      {isHovered && enableGlitch && (
        <>
          {/* Red channel offset */}
          <pre
            className="absolute inset-0 font-mono leading-tight text-center pointer-events-none"
            style={{
              fontSize: isMobile
                ? "clamp(0.35rem, 2.5vw, 0.55rem)"
                : "clamp(0.5rem, 1.5vw, 0.9rem)",
              letterSpacing: isMobile ? "-0.03em" : "0.05em",
              lineHeight: isMobile ? 1.05 : 1.2,
              color: "#ff0000",
              opacity: 0.3,
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)`,
              clipPath: `inset(${Math.random() * 30}% 0 ${Math.random() * 30}% 0)`,
              mixBlendMode: "screen",
              whiteSpace: "pre",
            }}
            aria-hidden="true"
          >
            {asciiLines.map((line, i) => (
              <div key={i} className="whitespace-pre flex justify-center">
                {line}
              </div>
            ))}
          </pre>

          {/* Cyan channel offset */}
          <pre
            className="absolute inset-0 font-mono leading-tight text-center pointer-events-none"
            style={{
              fontSize: isMobile
                ? "clamp(0.35rem, 2.5vw, 0.55rem)"
                : "clamp(0.5rem, 1.5vw, 0.9rem)",
              letterSpacing: isMobile ? "-0.03em" : "0.05em",
              lineHeight: isMobile ? 1.05 : 1.2,
              color: "#00ffff",
              opacity: 0.3,
              transform: `translate(${Math.random() * -4 + 2}px, ${Math.random() * 2 - 1}px)`,
              clipPath: `inset(${Math.random() * 30}% 0 ${Math.random() * 30}% 0)`,
              mixBlendMode: "screen",
              whiteSpace: "pre",
            }}
            aria-hidden="true"
          >
            {asciiLines.map((line, i) => (
              <div key={i} className="whitespace-pre flex justify-center">
                {line}
              </div>
            ))}
          </pre>

          {/* Scanline on hover */}
          <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity: 0.6,
              animation: "scanlineMove 0.3s linear infinite",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Interaction hint - hidden on mobile */}
      {!isMobile && (
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs transition-opacity duration-300"
          style={{
            color: "var(--code-comment)",
            opacity: isHovered ? 0 : 0.5,
          }}
        >
          hover to interact
        </div>
      )}

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes scanlineMove {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(10px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
