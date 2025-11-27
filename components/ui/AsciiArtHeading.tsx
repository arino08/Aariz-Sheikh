"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Bold block-style ASCII art font - chunky terminal aesthetic
// Each letter is 5 lines tall with solid block characters
const ASCII_FONT_SLIM: Record<string, string[]> = {
  A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║"],
  B: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██████╔╝"],
  C: [" ██████╗", "██╔════╝", "██║     ", "██║     ", "╚██████╗"],
  D: ["██████╗ ", "██╔══██╗", "██║  ██║", "██║  ██║", "██████╔╝"],
  E: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "███████╗"],
  F: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "██║     "],
  G: [" ██████╗ ", "██╔════╝ ", "██║  ███╗", "██║   ██║", "╚██████╔╝"],
  H: ["██╗  ██╗", "██║  ██║", "███████║", "██╔══██║", "██║  ██║"],
  I: ["██╗", "██║", "██║", "██║", "██║"],
  J: ["     ██╗", "     ██║", "     ██║", "██   ██║", "╚█████╔╝"],
  K: ["██╗  ██╗", "██║ ██╔╝", "█████╔╝ ", "██╔═██╗ ", "██║  ██╗"],
  L: ["██╗     ", "██║     ", "██║     ", "██║     ", "███████╗"],
  M: [
    "███╗   ███╗",
    "████╗ ████║",
    "██╔████╔██║",
    "██║╚██╔╝██║",
    "██║ ╚═╝ ██║",
  ],
  N: ["███╗   ██╗", "████╗  ██║", "██╔██╗ ██║", "██║╚██╗██║", "██║ ╚████║"],
  O: [" ██████╗ ", "██╔═══██╗", "██║   ██║", "██║   ██║", "╚██████╔╝"],
  P: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔═══╝ ", "██║     "],
  Q: [" ██████╗ ", "██╔═══██╗", "██║   ██║", "██║▄▄ ██║", "╚██████╔╝"],
  R: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██║  ██╗"],
  S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║"],
  T: ["████████╗", "╚══██╔══╝", "   ██║   ", "   ██║   ", "   ██║   "],
  U: ["██╗   ██╗", "██║   ██║", "██║   ██║", "██║   ██║", "╚██████╔╝"],
  V: ["██╗   ██╗", "██║   ██║", "██║   ██║", "╚██╗ ██╔╝", " ╚████╔╝ "],
  W: ["██╗    ██╗", "██║    ██║", "██║ █╗ ██║", "██║███╗██║", "╚███╔███╔╝"],
  X: ["██╗  ██╗", "╚██╗██╔╝", " ╚███╔╝ ", " ██╔██╗ ", "██╔╝ ██╗"],
  Y: ["██╗   ██╗", "╚██╗ ██╔╝", " ╚████╔╝ ", "  ╚██╔╝  ", "   ██║   "],
  Z: ["███████╗", "╚══███╔╝", "  ███╔╝ ", " ███╔╝  ", "███████╗"],
  " ": ["   ", "   ", "   ", "   ", "   "],
  "0": [" ██████╗ ", "██╔═████╗", "██║██╔██║", "████╔╝██║", "╚██████╔╝"],
  "1": [" ██╗", "███║", "╚██║", " ██║", " ██║"],
  "2": ["██████╗ ", "╚════██╗", " █████╔╝", "██╔═══╝ ", "███████╗"],
  "3": ["██████╗ ", "╚════██╗", " █████╔╝", "╚════██╗", "██████╔╝"],
  "4": ["██╗  ██╗", "██║  ██║", "███████║", "╚════██║", "     ██║"],
  "5": ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║"],
  "6": [" ██████╗", "██╔════╝", "███████╗", "██╔══██║", "╚█████╔╝"],
  "7": ["███████╗", "╚════██║", "    ██╔╝", "   ██╔╝ ", "   ██║  "],
  "8": [" █████╗ ", "██╔══██╗", "╚█████╔╝", "██╔══██╗", "╚█████╔╝"],
  "9": [" █████╗ ", "██╔══██╗", "╚██████║", " ╚═══██║", " █████╔╝"],
  ".": ["   ", "   ", "   ", "   ", "██╗"],
  "!": ["██╗", "██║", "██║", "╚═╝", "██╗"],
  "?": ["██████╗ ", "╚════██╗", "  ▄███╔╝", "  ▀▀═╝  ", "  ██╗   "],
  "-": ["      ", "      ", "█████╗", "╚════╝", "      "],
  ":": ["   ", "██╗", "╚═╝", "██╗", "╚═╝"],
  "/": ["    ██╗", "   ██╔╝", "  ██╔╝ ", " ██╔╝  ", "██╔╝   "],
  "&": [" ████╗  ", "██╔═██╗ ", "╚████╔╝ ", "██╔══██╗", "╚█████╔╝"],
  "'": ["██╗", "╚█╔╝", " ╚╝", "   ", "   "],
};

// Matrix characters for loading effect
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン日月火水木金土0123456789";
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~█▓▒░▀▄▐▌";

// Utility functions
const randomChar = (chars: string) =>
  chars[Math.floor(Math.random() * chars.length)];
const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// Convert text to ASCII art lines
function textToAsciiArt(text: string): string[] {
  const upperText = text.toUpperCase();
  const lines: string[] = ["", "", "", "", ""];

  for (const char of upperText) {
    const asciiChar = ASCII_FONT_SLIM[char] || ASCII_FONT_SLIM[" "];
    for (let i = 0; i < 5; i++) {
      lines[i] += asciiChar[i] + " ";
    }
  }

  return lines;
}

// Variants for different visual styles
type HeadingVariant =
  | "matrixRain"
  | "glitchMorph"
  | "wavePropagate"
  | "hologramProject"
  | "cyberPunk"
  | "typewriter"
  | "pixelReveal"
  | "scanline"
  | "neonFlicker"
  | "dataCorrupt";

interface AsciiArtHeadingProps {
  children: string;
  variant?: HeadingVariant;
  subtitle?: string;
  className?: string;
  color?: string;
  accentColor?: string;
  animate?: boolean;
  animateOnScroll?: boolean;
  delay?: number;
  scale?: "sm" | "md" | "lg";
  onAnimationComplete?: () => void;
}

// ============================================
// SHARED MATRIX LOAD COMPONENT
// ============================================
interface MatrixLoadProps {
  asciiLines: string[];
  color: string;
  onComplete: () => void;
  duration?: number;
}

function MatrixLoadEffect({
  asciiLines,
  color,
  onComplete,
  duration = 1500,
}: MatrixLoadProps) {
  const [displayLines, setDisplayLines] = useState<string[]>(
    asciiLines.map((line) =>
      line
        .split("")
        .map(() => randomChar(MATRIX_CHARS))
        .join(""),
    ),
  );
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(elapsed / duration, 1);
      setProgress(currentProgress);

      // Update display with matrix effect transitioning to real text
      setDisplayLines(
        asciiLines.map((line) =>
          line
            .split("")
            .map((char, i) => {
              const charThreshold = i / line.length;
              // Add some randomness to the reveal
              const revealPoint = charThreshold * 0.7 + Math.random() * 0.15;

              if (currentProgress > revealPoint + 0.15) {
                return char;
              } else if (currentProgress > revealPoint) {
                // Transitioning - show glitch chars
                return Math.random() > 0.5 ? char : randomChar(GLITCH_CHARS);
              }
              // Still in matrix mode
              return randomChar(MATRIX_CHARS);
            })
            .join(""),
        ),
      );

      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayLines(asciiLines);
        onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [asciiLines, duration, onComplete]);

  return (
    <pre
      className="font-mono leading-tight text-center whitespace-pre"
      style={{
        fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
        letterSpacing: "0.05em",
        color,
        textShadow:
          progress > 0.8
            ? `0 0 10px ${color}, 0 0 20px ${color}40`
            : `0 0 5px ${color}60`,
        transition: "text-shadow 0.3s",
      }}
    >
      {displayLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </pre>
  );
}

// ============================================
// VARIANT PROPS INTERFACE
// ============================================
interface VariantProps {
  asciiLines: string[];
  children: string;
  subtitle?: string;
  color: string;
  accentColor: string;
  isVisible: boolean;
  reducedMotion: boolean;
  onAnimationComplete?: () => void;
}

// ============================================
// MATRIX RAIN VARIANT
// ============================================
function MatrixRainVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [rainColumns, setRainColumns] = useState<
    Array<{ chars: string[]; y: number; speed: number }>
  >([]);
  const [showRain, setShowRain] = useState(true);
  const animationRef = useRef<number | null>(null);

  // Matrix load completion handler
  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
    // Fade out rain after matrix load completes
    setTimeout(() => {
      setShowRain(false);
      onAnimationComplete?.();
    }, 500);
  }, [onAnimationComplete]);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setMatrixComplete(true);
      setShowRain(false);
      onAnimationComplete?.();
      return;
    }

    // Create rain columns
    const width = asciiLines[0]?.length || 0;
    const cols = Array.from({ length: Math.ceil(width / 2) }, () => ({
      chars: Array.from({ length: 12 }, () => randomChar(MATRIX_CHARS)),
      y: randomBetween(-80, 0),
      speed: randomBetween(2, 5),
    }));
    setRainColumns(cols);

    // Animate rain
    const animateRain = () => {
      setRainColumns((prev) =>
        prev.map((col) => ({
          ...col,
          y: col.y > 120 ? randomBetween(-50, -20) : col.y + col.speed,
          chars: col.chars.map((c) =>
            Math.random() > 0.9 ? randomChar(MATRIX_CHARS) : c,
          ),
        })),
      );
      animationRef.current = requestAnimationFrame(animateRain);
    };

    animationRef.current = requestAnimationFrame(animateRain);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, reducedMotion, asciiLines, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden py-6">
      {/* Matrix rain background */}
      {showRain && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            opacity: matrixComplete ? 0.3 : 0.7,
            transition: "opacity 0.5s",
          }}
        >
          {rainColumns.map((col, i) => (
            <div
              key={i}
              className="absolute font-mono text-xs"
              style={{
                left: `${(i / rainColumns.length) * 100}%`,
                top: `${col.y}%`,
                color,
                textShadow: `0 0 8px ${color}`,
                writingMode: "vertical-rl",
                opacity: 0.7,
              }}
            >
              {col.chars.map((char, j) => (
                <span
                  key={j}
                  style={{
                    opacity: 1 - j * 0.07,
                    color: j === 0 ? "#fff" : color,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Matrix load effect then final text */}
      {reducedMotion ? (
        <pre
          className="font-mono leading-tight text-center whitespace-pre"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
            color,
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}40`,
          }}
        >
          {asciiLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </pre>
      ) : (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1800}
        />
      )}

      {subtitle && matrixComplete && (
        <div
          className="mt-4 font-mono text-sm text-center opacity-80"
          style={{ color: accentColor }}
        >
          <span className="opacity-50">&gt;</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// GLITCH MORPH VARIANT
// ============================================
interface GlitchMorphProps extends VariantProps {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

function GlitchMorphVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  isHovered,
  setIsHovered,
  reducedMotion,
  onAnimationComplete,
}: GlitchMorphProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [displayLines, setDisplayLines] = useState<string[]>(asciiLines);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  // Hover glitch effect
  useEffect(() => {
    if (!isHovered || reducedMotion || !matrixComplete) {
      setGlitchActive(false);
      setDisplayLines(asciiLines);
      return;
    }

    setGlitchActive(true);
    const interval = setInterval(() => {
      setDisplayLines(
        asciiLines.map((line) =>
          line
            .split("")
            .map((char) =>
              Math.random() > 0.92 ? randomChar(GLITCH_CHARS) : char,
            )
            .join(""),
        ),
      );
    }, 50);

    return () => {
      clearInterval(interval);
      setDisplayLines(asciiLines);
    };
  }, [isHovered, reducedMotion, matrixComplete, asciiLines]);

  if (!isVisible) return null;

  return (
    <div
      className="relative py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glitch RGB layers */}
      {glitchActive && (
        <>
          <pre
            className="absolute inset-0 font-mono leading-tight text-center whitespace-pre pointer-events-none"
            style={{
              fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
              color: "#ff0000",
              transform: `translate(${Math.random() * 3 - 1.5}px, ${Math.random() * 2 - 1}px)`,
              clipPath: `inset(${Math.random() * 30}% 0 ${Math.random() * 30}% 0)`,
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
          >
            {displayLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </pre>
          <pre
            className="absolute inset-0 font-mono leading-tight text-center whitespace-pre pointer-events-none"
            style={{
              fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
              color: "#00ffff",
              transform: `translate(${Math.random() * -3 + 1.5}px, ${Math.random() * 2 - 1}px)`,
              clipPath: `inset(${Math.random() * 30}% 0 ${Math.random() * 30}% 0)`,
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
          >
            {displayLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </pre>
        </>
      )}

      {/* Matrix load or final display */}
      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1500}
        />
      ) : (
        <pre
          className="relative font-mono leading-tight text-center whitespace-pre"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
            color,
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}40`,
          }}
        >
          {displayLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </pre>
      )}

      {/* Scanline on hover */}
      {glitchActive && (
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      )}

      {subtitle && matrixComplete && (
        <div
          className="mt-4 font-mono text-sm text-center"
          style={{ color: accentColor }}
        >
          <span className="opacity-50">[</span>
          <span className="text-green-400">OK</span>
          <span className="opacity-50">]</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// WAVE PROPAGATE VARIANT
// ============================================
interface WaveProps extends VariantProps {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  mousePos: { x: number; y: number };
  handleMouseMove: (e: React.MouseEvent) => void;
}

function WavePropagateVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  isHovered,
  setIsHovered,
  mousePos,
  handleMouseMove,
  reducedMotion,
  onAnimationComplete,
}: WaveProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [wavePosition, setWavePosition] = useState(-10);
  const [waveComplete, setWaveComplete] = useState(false);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
  }, []);

  // Wave animation after matrix load
  useEffect(() => {
    if (!matrixComplete || reducedMotion) {
      if (matrixComplete) {
        setWaveComplete(true);
        onAnimationComplete?.();
      }
      return;
    }

    const width = asciiLines[0]?.length || 0;
    let pos = -10;
    const interval = setInterval(() => {
      pos += 2;
      setWavePosition(pos);

      if (pos > width + 10) {
        clearInterval(interval);
        setWaveComplete(true);
        onAnimationComplete?.();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [matrixComplete, reducedMotion, asciiLines, onAnimationComplete]);

  if (!isVisible) return null;

  // Render with wave effect
  const renderWithWave = () => {
    return asciiLines.map((line, lineIndex) => {
      const chars = line.split("");
      return (
        <div key={lineIndex} className="whitespace-pre">
          {chars.map((char, charIndex) => {
            const distanceFromWave = Math.abs(charIndex - wavePosition);
            const isInWave = distanceFromWave < 4;
            const waveIntensity = isInWave ? 1 - distanceFromWave / 4 : 0;
            const isRevealed = charIndex < wavePosition;

            const hoverWave = isHovered
              ? Math.sin((mousePos.x * chars.length - charIndex) * 0.3) * 0.5 +
                0.5
              : 0;

            return (
              <span
                key={charIndex}
                style={{
                  color: isInWave || isRevealed ? color : `${color}30`,
                  textShadow:
                    waveIntensity > 0
                      ? `0 0 ${12 * waveIntensity}px ${color}, 0 0 ${24 * waveIntensity}px ${color}`
                      : waveComplete
                        ? `0 0 5px ${color}50`
                        : "none",
                  transform: `translateY(${isInWave ? -waveIntensity * 2 : isHovered ? -hoverWave * 2 : 0}px)`,
                  display: "inline-block",
                  transition: isInWave ? "none" : "transform 0.15s, color 0.1s",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      className="relative py-6"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1400}
        />
      ) : (
        <pre
          className="font-mono leading-tight text-center"
          style={{ fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)" }}
        >
          {renderWithWave()}
        </pre>
      )}

      {subtitle && waveComplete && (
        <div
          className="mt-4 font-mono text-sm text-center"
          style={{ color: accentColor }}
        >
          <span className="opacity-50">~</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// HOLOGRAM PROJECT VARIANT
// ============================================
interface HologramProps extends VariantProps {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  mousePos: { x: number; y: number };
  handleMouseMove: (e: React.MouseEvent) => void;
}

function HologramProjectVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  isHovered,
  setIsHovered,
  mousePos,
  handleMouseMove,
  reducedMotion,
  onAnimationComplete,
}: HologramProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [scanY, setScanY] = useState(0);
  const [intensity, setIntensity] = useState(0);
  const animationRef = useRef<number | null>(null);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
  }, []);

  // Hologram scan effect after matrix load
  useEffect(() => {
    if (!matrixComplete) return;
    if (reducedMotion) {
      setIntensity(1);
      onAnimationComplete?.();
      return;
    }

    let frame = 0;
    const animate = () => {
      frame++;
      const progress = Math.min(frame / 45, 1);
      setScanY(progress * 100);
      setIntensity(progress);

      if (frame < 45) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [matrixComplete, reducedMotion, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="relative py-8"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hologram base */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
          opacity: matrixComplete ? intensity : 0,
        }}
      />

      {/* Projection beam */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{
          height: "110%",
          background: `linear-gradient(to top, ${color}25 0%, transparent 100%)`,
          clipPath: "polygon(32% 100%, 68% 100%, 82% 0%, 18% 0%)",
          opacity: matrixComplete ? intensity * 0.25 : 0,
        }}
      />

      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1500}
        />
      ) : (
        <div
          className="relative"
          style={{
            transform: `
              perspective(1000px)
              rotateX(${isHovered ? (mousePos.y - 0.5) * 6 : 2}deg)
              rotateY(${isHovered ? (mousePos.x - 0.5) * 6 : 0}deg)
            `,
            transition: isHovered ? "transform 0.1s" : "transform 0.3s",
          }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 2px,
                ${color}06 2px,
                ${color}06 4px
              )`,
              opacity: 0.6,
            }}
          />

          {/* Scan line */}
          {intensity < 1 && (
            <div
              className="absolute left-0 right-0 h-0.5 pointer-events-none z-20"
              style={{
                top: `${scanY}%`,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                boxShadow: `0 0 12px ${color}`,
              }}
            />
          )}

          {/* Depth layers */}
          {[0, 1, 2].map((layer) => (
            <pre
              key={layer}
              className={`${layer > 0 ? "absolute inset-0" : ""} font-mono leading-tight text-center whitespace-pre`}
              style={{
                fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
                color: layer === 0 ? color : "transparent",
                WebkitTextStroke:
                  layer > 0 ? `${layer * 0.4}px ${color}` : undefined,
                opacity:
                  layer === 0 ? intensity : intensity * (0.25 - layer * 0.08),
                transform: `translateZ(${-layer * 4}px)`,
                filter: layer > 0 ? `blur(${layer * 0.25}px)` : undefined,
                textShadow:
                  layer === 0
                    ? `0 0 5px ${color}, 0 0 12px ${color}, 0 0 25px ${color}50`
                    : undefined,
              }}
            >
              {asciiLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          ))}

          {/* Flicker */}
          {isHovered && Math.random() > 0.92 && (
            <pre
              className="absolute inset-0 font-mono leading-tight text-center whitespace-pre pointer-events-none"
              style={{
                fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
                color,
                opacity: 0.4,
                transform: `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`,
              }}
            >
              {asciiLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          )}
        </div>
      )}

      {subtitle && intensity >= 1 && (
        <div
          className="mt-5 text-center font-mono text-sm"
          style={{ color: accentColor, textShadow: `0 0 8px ${accentColor}` }}
        >
          ◇ {subtitle} ◇
        </div>
      )}
    </div>
  );
}

// ============================================
// CYBERPUNK VARIANT
// ============================================
interface CyberPunkProps extends VariantProps {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

function CyberPunkVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  isHovered,
  setIsHovered,
  reducedMotion,
  onAnimationComplete,
}: CyberPunkProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [clipPaths, setClipPaths] = useState<string[]>([]);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  // Glitch effect
  useEffect(() => {
    if (!matrixComplete || reducedMotion) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.75) {
        setGlitchOffset({
          x: randomBetween(-2, 2),
          y: randomBetween(-1, 1),
        });
        setClipPaths([
          `inset(${randomBetween(0, 25)}% 0 ${randomBetween(55, 100)}% 0)`,
          `inset(${randomBetween(35, 55)}% 0 ${randomBetween(25, 45)}% 0)`,
          `inset(${randomBetween(65, 85)}% 0 ${randomBetween(0, 15)}% 0)`,
        ]);

        setTimeout(() => {
          setGlitchOffset({ x: 0, y: 0 });
          setClipPaths([]);
        }, 70);
      }
    }, 120);

    return () => clearInterval(glitchInterval);
  }, [matrixComplete, reducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      className="relative py-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Neon border frame */}
      <div
        className="absolute inset-0 border"
        style={{
          borderColor: color,
          boxShadow: `inset 0 0 15px ${color}30, 0 0 15px ${color}30, 0 0 30px ${color}15`,
          clipPath:
            "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
          opacity: matrixComplete ? 1 : 0.3,
          transition: "opacity 0.3s",
        }}
      />

      {/* Corner accents */}
      {[
        "top-0 left-0",
        "top-0 right-0",
        "bottom-0 left-0",
        "bottom-0 right-0",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-2.5 h-2.5 ${pos}`}
          style={{
            borderTop: pos.includes("top")
              ? `2px solid ${accentColor}`
              : "none",
            borderBottom: pos.includes("bottom")
              ? `2px solid ${accentColor}`
              : "none",
            borderLeft: pos.includes("left")
              ? `2px solid ${accentColor}`
              : "none",
            borderRight: pos.includes("right")
              ? `2px solid ${accentColor}`
              : "none",
            boxShadow: `0 0 6px ${accentColor}`,
            opacity: matrixComplete ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      ))}

      {/* Glitch layers */}
      {clipPaths.map((clip, i) => (
        <pre
          key={i}
          className="absolute inset-0 font-mono leading-tight text-center whitespace-pre pointer-events-none flex items-center justify-center"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
            color: i === 0 ? "#ff0000" : i === 1 ? "#00ff00" : "#0000ff",
            transform: `translate(${glitchOffset.x * (i + 1)}px, ${glitchOffset.y}px)`,
            clipPath: clip,
            mixBlendMode: "screen",
            opacity: 0.75,
          }}
        >
          <div>
            {asciiLines.map((line, j) => (
              <div key={j}>{line}</div>
            ))}
          </div>
        </pre>
      ))}

      {/* Main content */}
      <div className="relative z-10 px-5 py-4">
        <div
          className="text-xs font-mono mb-2 opacity-50 text-center"
          style={{
            color: accentColor,
            opacity: matrixComplete ? 0.6 : 0,
            transition: "opacity 0.3s",
          }}
        >
          ▸ SECTOR_7G // {new Date().toISOString().split("T")[0]}
        </div>

        {!matrixComplete && !reducedMotion ? (
          <MatrixLoadEffect
            asciiLines={asciiLines}
            color={color}
            onComplete={handleMatrixComplete}
            duration={1400}
          />
        ) : (
          <pre
            className="font-mono leading-tight text-center whitespace-pre"
            style={{
              fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
              color,
              textShadow: `0 0 8px ${color}, 0 0 16px ${color}${isHovered ? ", 0 0 30px " + color : ""}`,
              transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
            }}
          >
            {asciiLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </pre>
        )}

        {subtitle && matrixComplete && (
          <div
            className="mt-4 text-sm font-mono flex items-center justify-center gap-2"
            style={{ color: accentColor }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            {subtitle}
          </div>
        )}
      </div>

      {/* Animated border sweep */}
      {isHovered && matrixComplete && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${color}00, ${color}30, ${color}00)`,
            backgroundSize: "200% 100%",
            animation: "borderSweep 1.5s linear infinite",
            mixBlendMode: "overlay",
          }}
        />
      )}

      <style jsx>{`
        @keyframes borderSweep {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// NEON FLICKER VARIANT
// ============================================
interface NeonFlickerProps extends VariantProps {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

function NeonFlickerVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  isHovered,
  setIsHovered,
  reducedMotion,
  onAnimationComplete,
}: NeonFlickerProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [flickerIntensity, setFlickerIntensity] = useState(0);
  const [flickerReady, setFlickerReady] = useState(false);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
  }, []);

  // Power-on flicker effect after matrix load
  useEffect(() => {
    if (!matrixComplete) return;
    if (reducedMotion) {
      setFlickerIntensity(1);
      setFlickerReady(true);
      onAnimationComplete?.();
      return;
    }

    const flickerSequence = [0, 0.4, 0, 0.6, 0.2, 0.9, 0.5, 1, 0.8, 1];
    let index = 0;

    const interval = setInterval(() => {
      if (index < flickerSequence.length) {
        setFlickerIntensity(flickerSequence[index]);
        index++;
      } else {
        clearInterval(interval);
        setFlickerReady(true);
        onAnimationComplete?.();
      }
    }, 80);

    return () => clearInterval(interval);
  }, [matrixComplete, reducedMotion, onAnimationComplete]);

  // Subtle ongoing flicker
  useEffect(() => {
    if (!flickerReady || reducedMotion) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.94) {
        setFlickerIntensity(0.85 + Math.random() * 0.15);
        setTimeout(() => setFlickerIntensity(1), 40);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [flickerReady, reducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      className="relative py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${color}35 0%, transparent 65%)`,
          opacity: matrixComplete
            ? flickerIntensity * (isHovered ? 1.1 : 0.7)
            : 0,
          transition: "opacity 0.1s",
        }}
      />

      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1500}
        />
      ) : (
        <pre
          className="relative font-mono leading-tight text-center whitespace-pre"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
            color,
            opacity: flickerIntensity,
            textShadow: `
              0 0 4px ${color},
              0 0 8px ${color},
              0 0 16px ${color},
              0 0 32px ${color}${isHovered ? ", 0 0 48px " + color + ", 0 0 64px " + color : ""}
            `,
            transition: "text-shadow 0.2s",
          }}
        >
          {asciiLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </pre>
      )}

      {subtitle && flickerReady && (
        <div
          className="mt-4 font-mono text-sm text-center"
          style={{
            color: accentColor,
            textShadow: `0 0 8px ${accentColor}`,
            opacity: flickerIntensity,
          }}
        >
          ⚡ {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// TYPEWRITER VARIANT
// ============================================
function TypewriterVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [displayLines, setDisplayLines] = useState<string[]>(
    asciiLines.map(() => ""),
  );
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typeComplete, setTypeComplete] = useState(false);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
  }, []);

  // Typewriter effect after matrix load
  useEffect(() => {
    if (!matrixComplete) return;
    if (reducedMotion) {
      setDisplayLines(asciiLines);
      setTypeComplete(true);
      onAnimationComplete?.();
      return;
    }

    const typeInterval = setInterval(() => {
      if (currentLine >= asciiLines.length) {
        clearInterval(typeInterval);
        setTypeComplete(true);
        onAnimationComplete?.();
        return;
      }

      const line = asciiLines[currentLine];
      if (currentChar < line.length) {
        setDisplayLines((prev) => {
          const newLines = [...prev];
          newLines[currentLine] = line.substring(0, currentChar + 1);
          return newLines;
        });
        setCurrentChar((prev) => prev + 1);
      } else {
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }
    }, 4);

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 350);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, [
    matrixComplete,
    reducedMotion,
    asciiLines,
    currentLine,
    currentChar,
    onAnimationComplete,
  ]);

  if (!isVisible) return null;

  return (
    <div className="relative py-6">
      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1200}
        />
      ) : (
        <pre
          className="font-mono leading-tight text-center whitespace-pre"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
            color,
            textShadow: typeComplete
              ? `0 0 8px ${color}, 0 0 16px ${color}40`
              : `0 0 4px ${color}`,
          }}
        >
          {displayLines.map((line, i) => (
            <div key={i} className="relative">
              {line}
              {i === currentLine && !typeComplete && (
                <span
                  className="inline-block"
                  style={{
                    opacity: cursorVisible ? 1 : 0,
                    color,
                  }}
                >
                  █
                </span>
              )}
            </div>
          ))}
        </pre>
      )}

      {subtitle && typeComplete && (
        <div
          className="mt-4 font-mono text-sm text-center"
          style={{ color: accentColor }}
        >
          <span className="animate-pulse">▋</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// PIXEL REVEAL VARIANT
// ============================================
function PixelRevealVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [revealMask, setRevealMask] = useState<boolean[][]>(
    asciiLines.map((line) => line.split("").map(() => false)),
  );
  const [revealComplete, setRevealComplete] = useState(false);
  const animationRef = useRef<number | null>(null);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
  }, []);

  // Pixel reveal after matrix load
  useEffect(() => {
    if (!matrixComplete) return;
    if (reducedMotion) {
      setRevealMask(asciiLines.map((line) => line.split("").map(() => true)));
      setRevealComplete(true);
      onAnimationComplete?.();
      return;
    }

    const totalChars = asciiLines.reduce((sum, line) => sum + line.length, 0);
    let revealed = 0;
    const charsPerFrame = Math.ceil(totalChars / 40);

    const animate = () => {
      setRevealMask((prev) => {
        const newMask = prev.map((row) => [...row]);
        let count = 0;

        while (count < charsPerFrame && revealed < totalChars) {
          const lineIndex = Math.floor(Math.random() * asciiLines.length);
          const charIndex = Math.floor(
            Math.random() * asciiLines[lineIndex].length,
          );

          if (!newMask[lineIndex][charIndex]) {
            newMask[lineIndex][charIndex] = true;
            revealed++;
            count++;
          }
        }

        return newMask;
      });

      revealed += charsPerFrame;

      if (revealed < totalChars * 1.3) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRevealMask(asciiLines.map((line) => line.split("").map(() => true)));
        setRevealComplete(true);
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [matrixComplete, reducedMotion, asciiLines, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="relative py-6">
      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1300}
        />
      ) : (
        <pre
          className="font-mono leading-tight text-center whitespace-pre"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
            textShadow: revealComplete
              ? `0 0 8px ${color}, 0 0 16px ${color}40`
              : "none",
          }}
        >
          {asciiLines.map((line, lineIndex) => (
            <div key={lineIndex}>
              {line.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  style={{
                    color: revealMask[lineIndex]?.[charIndex]
                      ? color
                      : "transparent",
                    transition: "color 0.08s",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </pre>
      )}

      {subtitle && revealComplete && (
        <div
          className="mt-4 font-mono text-sm text-center"
          style={{ color: accentColor }}
        >
          <span className="inline-block animate-pulse">▪</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// SCANLINE VARIANT
// ============================================
function ScanlineVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [scanPosition, setScanPosition] = useState(-1);
  const [scanComplete, setScanComplete] = useState(false);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
  }, []);

  // Scanline effect after matrix load
  useEffect(() => {
    if (!matrixComplete) return;
    if (reducedMotion) {
      setScanComplete(true);
      onAnimationComplete?.();
      return;
    }

    let pos = -1;
    const interval = setInterval(() => {
      pos++;
      setScanPosition(pos);

      if (pos > asciiLines.length + 1) {
        clearInterval(interval);
        setScanComplete(true);
        onAnimationComplete?.();
      }
    }, 80);

    return () => clearInterval(interval);
  }, [matrixComplete, reducedMotion, asciiLines.length, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="relative py-6 overflow-hidden">
      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1400}
        />
      ) : (
        <>
          {/* Scanline */}
          {scanPosition >= 0 && scanPosition <= asciiLines.length && (
            <div
              className="absolute left-0 right-0 h-3 pointer-events-none z-10"
              style={{
                top: `${(scanPosition / asciiLines.length) * 100}%`,
                background: `linear-gradient(180deg, transparent, ${color}70, ${color}, ${color}70, transparent)`,
                boxShadow: `0 0 20px ${color}`,
              }}
            />
          )}

          <pre
            className="font-mono leading-tight text-center whitespace-pre"
            style={{
              fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
              textShadow: scanComplete
                ? `0 0 8px ${color}, 0 0 16px ${color}40`
                : "none",
            }}
          >
            {asciiLines.map((line, i) => (
              <div
                key={i}
                style={{
                  color: i < scanPosition ? color : `${color}25`,
                  transition: "color 0.15s",
                  textShadow:
                    i === scanPosition - 1 ? `0 0 15px ${color}` : "none",
                }}
              >
                {line}
              </div>
            ))}
          </pre>
        </>
      )}

      {subtitle && scanComplete && (
        <div
          className="mt-4 font-mono text-sm text-center"
          style={{ color: accentColor }}
        >
          <span className="opacity-50">▶</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// DATA CORRUPT VARIANT
// ============================================
function DataCorruptVariant({
  asciiLines,
  subtitle,
  color,
  accentColor,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [matrixComplete, setMatrixComplete] = useState(false);
  const [displayLines, setDisplayLines] = useState<string[]>(asciiLines);
  const [corruptionLevel, setCorruptionLevel] = useState(1);
  const [recoveryComplete, setRecoveryComplete] = useState(false);

  const handleMatrixComplete = useCallback(() => {
    setMatrixComplete(true);
  }, []);

  // Corruption recovery after matrix load
  useEffect(() => {
    if (!matrixComplete) return;
    if (reducedMotion) {
      setCorruptionLevel(0);
      setRecoveryComplete(true);
      onAnimationComplete?.();
      return;
    }

    let level = 1;
    const interval = setInterval(() => {
      level -= 0.025;
      setCorruptionLevel(Math.max(0, level));

      setDisplayLines(
        asciiLines.map((line) =>
          line
            .split("")
            .map((char) =>
              Math.random() < level ? randomChar(GLITCH_CHARS) : char,
            )
            .join(""),
        ),
      );

      if (level <= 0) {
        clearInterval(interval);
        setDisplayLines(asciiLines);
        setRecoveryComplete(true);
        onAnimationComplete?.();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [matrixComplete, reducedMotion, asciiLines, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="relative py-6">
      {/* Integrity indicator */}
      {matrixComplete && corruptionLevel > 0 && (
        <div
          className="absolute top-0 right-0 font-mono text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: `${color}15`,
            color:
              corruptionLevel > 0.5
                ? "#ff4444"
                : corruptionLevel > 0.2
                  ? "#ffaa00"
                  : "#44ff44",
          }}
        >
          INTEGRITY: {Math.round((1 - corruptionLevel) * 100)}%
        </div>
      )}

      {!matrixComplete && !reducedMotion ? (
        <MatrixLoadEffect
          asciiLines={asciiLines}
          color={color}
          onComplete={handleMatrixComplete}
          duration={1300}
        />
      ) : (
        <pre
          className="font-mono leading-tight text-center whitespace-pre"
          style={{
            fontSize: "clamp(0.4rem, 1.2vw, 0.7rem)",
            color,
            textShadow: recoveryComplete
              ? `0 0 8px ${color}, 0 0 16px ${color}40`
              : `0 0 4px ${corruptionLevel > 0.5 ? "#ff4444" : color}`,
            filter:
              corruptionLevel > 0
                ? `hue-rotate(${corruptionLevel * 25}deg)`
                : "none",
          }}
        >
          {displayLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </pre>
      )}

      {subtitle && recoveryComplete && (
        <div
          className="mt-4 font-mono text-sm text-center"
          style={{ color: accentColor }}
        >
          <span className="text-green-400">[RESTORED]</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AsciiArtHeading({
  children,
  variant = "glitchMorph",
  subtitle,
  className = "",
  color = "var(--terminal-green)",
  accentColor = "var(--terminal-orange)",
  animate = true,
  animateOnScroll = true,
  delay = 0,
  scale = "md",
  onAnimationComplete,
}: AsciiArtHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Generate ASCII art from text
  const asciiLines = useMemo(() => textToAsciiArt(children), [children]);

  // Check for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Intersection observer for scroll-triggered animation
  useEffect(() => {
    if (!animateOnScroll || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOnScroll, delay]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // Props for variants
  const variantProps: VariantProps = {
    asciiLines,
    children,
    subtitle,
    color,
    accentColor,
    isVisible,
    reducedMotion,
    onAnimationComplete,
  };

  const renderVariant = () => {
    if (!animate && !isVisible) {
      setIsVisible(true);
    }

    switch (variant) {
      case "matrixRain":
        return <MatrixRainVariant {...variantProps} />;
      case "glitchMorph":
        return (
          <GlitchMorphVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        );
      case "wavePropagate":
        return (
          <WavePropagateVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            mousePos={mousePos}
            handleMouseMove={handleMouseMove}
          />
        );
      case "hologramProject":
        return (
          <HologramProjectVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            mousePos={mousePos}
            handleMouseMove={handleMouseMove}
          />
        );
      case "cyberPunk":
        return (
          <CyberPunkVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        );
      case "typewriter":
        return <TypewriterVariant {...variantProps} />;
      case "pixelReveal":
        return <PixelRevealVariant {...variantProps} />;
      case "scanline":
        return <ScanlineVariant {...variantProps} />;
      case "neonFlicker":
        return (
          <NeonFlickerVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        );
      case "dataCorrupt":
        return <DataCorruptVariant {...variantProps} />;
      default:
        return (
          <GlitchMorphVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        );
    }
  };

  // Scale classes for responsive sizing
  const scaleClasses = {
    sm: "transform scale-75 md:scale-90",
    md: "transform scale-90 md:scale-100",
    lg: "transform scale-100 md:scale-110 lg:scale-125",
  };

  return (
    <div
      ref={containerRef}
      className={`ascii-art-heading relative ${scaleClasses[scale]} ${className}`}
      style={{
        opacity: isVisible || !animateOnScroll ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    >
      {renderVariant()}
    </div>
  );
}

// Export preset configurations
export const AsciiArtHeadingPresets = {
  hero: {
    scale: "lg" as const,
    animate: true,
    animateOnScroll: false,
  },
  section: {
    scale: "md" as const,
    animate: true,
    animateOnScroll: true,
  },
  subsection: {
    scale: "sm" as const,
    animate: true,
    animateOnScroll: true,
    delay: 200,
  },
};
