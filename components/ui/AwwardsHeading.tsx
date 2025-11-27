"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Variants for different visual styles
type HeadingVariant =
  | "matrixRain"
  | "glitchMorph"
  | "neuralNetwork"
  | "pixelDissolve"
  | "wavePropagate"
  | "terminalBoot"
  | "hologramProject"
  | "dataStream"
  | "cyberPunk"
  | "quantumFlux";

interface AwwardsHeadingProps {
  children: string;
  variant?: HeadingVariant;
  subtitle?: string;
  className?: string;
  color?: string;
  accentColor?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animate?: boolean;
  animateOnScroll?: boolean;
  delay?: number;
  onAnimationComplete?: () => void;
}

// Matrix rain characters
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~█▓▒░▀▄╔╗╚╝║═╬╣╠╩╦";
const HEX_CHARS = "0123456789ABCDEF";

// Utility functions
const randomChar = (chars: string) =>
  chars[Math.floor(Math.random() * chars.length)];
const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// Size configurations
const sizeClasses = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl lg:text-6xl",
  xl: "text-5xl md:text-6xl lg:text-7xl",
  "2xl": "text-6xl md:text-7xl lg:text-8xl",
};

// ============================================
// MATRIX RAIN VARIANT
// ============================================
interface VariantProps {
  children: string;
  subtitle?: string;
  color: string;
  accentColor: string;
  size: keyof typeof sizeClasses;
  isVisible: boolean;
  reducedMotion: boolean;
  onAnimationComplete?: () => void;
}

function MatrixRainVariant({
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [columns, setColumns] = useState<
    Array<{ chars: string[]; y: number; speed: number }>
  >([]);
  const [revealed, setRevealed] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible || reducedMotion) {
      setRevealed(true);
      onAnimationComplete?.();
      return;
    }

    // Initialize rain columns
    const cols: typeof columns = [];
    const numCols = children.length * 3;

    for (let i = 0; i < numCols; i++) {
      const chars: string[] = [];
      for (let j = 0; j < 20; j++) {
        chars.push(randomChar(MATRIX_CHARS));
      }
      cols.push({
        chars,
        y: randomBetween(-100, 0),
        speed: randomBetween(2, 5),
      });
    }
    setColumns(cols);

    // Animate rain falling
    let frame = 0;
    const animate = () => {
      frame++;
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          y: col.y + col.speed,
          chars: col.chars.map((c) =>
            Math.random() > 0.9 ? randomChar(MATRIX_CHARS) : c,
          ),
        })),
      );

      if (frame < 60) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRevealed(true);
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, reducedMotion, children.length, onAnimationComplete]);

  return (
    <div className="relative overflow-hidden py-8">
      {/* Matrix rain background */}
      {!revealed && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {columns.map((col, i) => (
            <div
              key={i}
              className="absolute text-xs font-mono opacity-60"
              style={{
                left: `${(i / columns.length) * 100}%`,
                top: `${col.y}%`,
                color,
                textShadow: `0 0 10px ${color}`,
                transform: "translateY(-100%)",
                writingMode: "vertical-rl",
              }}
            >
              {col.chars.map((char, j) => (
                <span
                  key={j}
                  style={{
                    opacity: 1 - j * 0.05,
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

      {/* Main text */}
      <div
        className={`relative z-10 font-mono font-black tracking-tight ${sizeClasses[size]}`}
        style={{
          color,
          textShadow: revealed
            ? `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`
            : "none",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </div>

      {subtitle && revealed && (
        <div
          className="mt-4 font-mono text-sm opacity-70"
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
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  isHovered,
  setIsHovered,
  reducedMotion,
  onAnimationComplete,
}: GlitchMorphProps) {
  const [chars, setChars] = useState(
    children.split("").map(() => randomChar(GLITCH_CHARS)),
  );
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible || reducedMotion) {
      setChars(children.split(""));
      setProgress(1);
      onAnimationComplete?.();
      return;
    }

    let frame = 0;
    const totalFrames = 60;
    const charDelay = totalFrames / children.length;

    const animate = () => {
      frame++;
      const currentProgress = frame / totalFrames;
      setProgress(currentProgress);

      setChars((prev) =>
        prev.map((char, i) => {
          const charFrame = i * charDelay;
          if (frame > charFrame + charDelay * 0.8) {
            return children[i];
          } else if (frame > charFrame) {
            return randomChar(GLITCH_CHARS);
          }
          return char;
        }),
      );

      if (frame < totalFrames) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, reducedMotion, children, onAnimationComplete]);

  // Hover glitch effect
  useEffect(() => {
    if (!isHovered || reducedMotion) {
      setGlitchActive(false);
      return;
    }

    setGlitchActive(true);
    const interval = setInterval(() => {
      setChars((prev) =>
        prev.map((char, i) =>
          Math.random() > 0.9 ? randomChar(GLITCH_CHARS) : children[i],
        ),
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isHovered, reducedMotion, children]);

  return (
    <div
      className="relative py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setChars(children.split(""));
      }}
    >
      {/* Glitch layers */}
      {glitchActive && (
        <>
          <div
            className={`absolute inset-0 font-mono font-black tracking-tight ${sizeClasses[size]}`}
            style={{
              color: "#ff0000",
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)`,
              clipPath: `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`,
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
          >
            {chars.join("")}
          </div>
          <div
            className={`absolute inset-0 font-mono font-black tracking-tight ${sizeClasses[size]}`}
            style={{
              color: "#00ffff",
              transform: `translate(${Math.random() * -4 + 2}px, ${Math.random() * 2 - 1}px)`,
              clipPath: `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`,
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
          >
            {chars.join("")}
          </div>
        </>
      )}

      {/* Main text */}
      <div
        className={`relative font-mono font-black tracking-tight ${sizeClasses[size]}`}
        style={{
          color,
          textShadow: `0 0 10px ${color}, 0 0 20px ${color}40`,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="inline-block transition-all duration-100"
            style={{
              transform:
                glitchActive && Math.random() > 0.9
                  ? `translateY(${Math.random() * 4 - 2}px)`
                  : "none",
              opacity: char === children[i] ? 1 : 0.8,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Scanline */}
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

      {subtitle && progress >= 1 && (
        <div className="mt-4 font-mono text-sm" style={{ color: accentColor }}>
          <span className="opacity-50">[</span>
          <span className="text-green-400">OK</span>
          <span className="opacity-50">]</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// NEURAL NETWORK VARIANT
// ============================================
function NeuralNetworkVariant({
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [nodes, setNodes] = useState<
    Array<{ x: number; y: number; connected: number[]; active: boolean }>
  >([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setRevealed(true);
      onAnimationComplete?.();
      return;
    }

    // Create neural network nodes
    const newNodes: typeof nodes = [];
    const gridSize = 8;

    for (let i = 0; i < gridSize * 4; i++) {
      newNodes.push({
        x: randomBetween(0, 100),
        y: randomBetween(0, 100),
        connected: [],
        active: false,
      });
    }

    // Connect nearby nodes
    newNodes.forEach((node, i) => {
      newNodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2),
          );
          if (dist < 30 && node.connected.length < 3) {
            node.connected.push(j);
          }
        }
      });
    });

    setNodes(newNodes);

    // Animate activation
    let activated = 0;
    const activateInterval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node, i) => ({
          ...node,
          active: i <= activated,
        })),
      );
      activated++;

      if (activated >= newNodes.length) {
        clearInterval(activateInterval);
        setTimeout(() => {
          setRevealed(true);
          onAnimationComplete?.();
        }, 300);
      }
    }, 30);

    return () => clearInterval(activateInterval);
  }, [isVisible, reducedMotion, onAnimationComplete]);

  return (
    <div className="relative py-12">
      {/* Neural network background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: revealed ? 0.2 : 0.6, transition: "opacity 0.5s" }}
      >
        {/* Connections */}
        {nodes.map((node, i) =>
          node.connected.map((j) => (
            <line
              key={`${i}-${j}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${nodes[j]?.x || 0}%`}
              y2={`${nodes[j]?.y || 0}%`}
              stroke={color}
              strokeWidth="1"
              strokeOpacity={node.active && nodes[j]?.active ? 0.6 : 0.1}
              style={{ transition: "stroke-opacity 0.3s" }}
            />
          )),
        )}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.active ? 4 : 2}
              fill={node.active ? color : "transparent"}
              stroke={color}
              strokeWidth="1"
              style={{
                filter: node.active ? `drop-shadow(0 0 6px ${color})` : "none",
                transition: "all 0.3s",
              }}
            />
            {node.active && (
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="8"
                fill="transparent"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.3"
              >
                <animate
                  attributeName="r"
                  from="4"
                  to="12"
                  dur="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  from="0.5"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}
      </svg>

      {/* Main text */}
      <div
        className={`relative z-10 font-mono font-black tracking-tight ${sizeClasses[size]}`}
        style={{
          color,
          textShadow: revealed
            ? `0 0 30px ${color}, 0 0 60px ${color}40`
            : "none",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(0.95)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </div>

      {subtitle && revealed && (
        <div className="mt-4 font-mono text-sm" style={{ color: accentColor }}>
          <span style={{ color }}>◉</span> Neural pathway established:{" "}
          {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// PIXEL DISSOLVE VARIANT
// ============================================
function PixelDissolveVariant({
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [pixels, setPixels] = useState<
    Array<{
      x: number;
      y: number;
      char: string;
      delay: number;
      revealed: boolean;
    }>
  >([]);
  const [allRevealed, setAllRevealed] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setAllRevealed(true);
      onAnimationComplete?.();
      return;
    }

    // Create pixel grid for each character
    const newPixels: typeof pixels = [];
    children.split("").forEach((char, charIndex) => {
      // Create a small grid for each character position
      for (let py = 0; py < 3; py++) {
        for (let px = 0; px < 2; px++) {
          newPixels.push({
            x: charIndex * 2 + px + randomBetween(-0.5, 0.5),
            y: py + randomBetween(-0.5, 0.5),
            char: char === " " ? " " : "█",
            delay: Math.random() * 800 + charIndex * 50,
            revealed: false,
          });
        }
      }
    });

    setPixels(newPixels);

    // Animate pixels gathering
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;

      setPixels((prev) =>
        prev.map((pixel) => ({
          ...pixel,
          revealed: elapsed > pixel.delay,
        })),
      );

      if (elapsed < 1500) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setAllRevealed(true);
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, reducedMotion, children, onAnimationComplete]);

  return (
    <div className="relative py-8">
      {/* Scattered pixels */}
      {!allRevealed && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {pixels.map((pixel, i) => (
            <div
              key={i}
              className="absolute font-mono text-xs"
              style={{
                left: pixel.revealed
                  ? `${(pixel.x / (children.length * 2)) * 100}%`
                  : `${randomBetween(0, 100)}%`,
                top: pixel.revealed
                  ? `${(pixel.y / 3) * 100}%`
                  : `${randomBetween(-50, 150)}%`,
                color,
                opacity: pixel.revealed ? 0.8 : 0.3,
                transform: pixel.revealed
                  ? "scale(1) rotate(0deg)"
                  : `scale(${randomBetween(0.5, 2)}) rotate(${randomBetween(-180, 180)}deg)`,
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                textShadow: pixel.revealed ? `0 0 5px ${color}` : "none",
              }}
            >
              {pixel.char}
            </div>
          ))}
        </div>
      )}

      {/* Main text (revealed state) */}
      <div
        className={`relative z-10 font-mono font-black tracking-tight ${sizeClasses[size]}`}
        style={{
          color,
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}40`,
          opacity: allRevealed ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        {children}
      </div>

      {subtitle && allRevealed && (
        <div className="mt-4 font-mono text-sm" style={{ color: accentColor }}>
          <span className="inline-block animate-pulse">▪</span> {subtitle}
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
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  isHovered,
  setIsHovered,
  mousePos,
  handleMouseMove,
  reducedMotion,
  onAnimationComplete,
}: WaveProps) {
  const [waveIndex, setWaveIndex] = useState(-1);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setComplete(true);
      onAnimationComplete?.();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setWaveIndex(index);
      index++;

      if (index > children.length + 5) {
        clearInterval(interval);
        setComplete(true);
        onAnimationComplete?.();
      }
    }, 60);

    return () => clearInterval(interval);
  }, [isVisible, reducedMotion, children.length, onAnimationComplete]);

  return (
    <div
      className="relative py-8"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`font-mono font-black tracking-tight ${sizeClasses[size]}`}
      >
        {children.split("").map((char, i) => {
          const distanceFromWave = Math.abs(i - waveIndex);
          const isInWave = distanceFromWave < 3;
          const waveIntensity = isInWave ? 1 - distanceFromWave / 3 : 0;

          // Hover wave effect
          const hoverWave = isHovered
            ? Math.sin((mousePos.x * children.length - i) * 0.5) * 0.5 + 0.5
            : 0;

          return (
            <span
              key={i}
              className="inline-block transition-all"
              style={{
                color: isInWave || waveIndex > i ? color : `${color}30`,
                textShadow:
                  waveIntensity > 0
                    ? `0 0 ${20 * waveIntensity}px ${color}, 0 0 ${40 * waveIntensity}px ${color}`
                    : complete
                      ? `0 0 10px ${color}40`
                      : "none",
                transform: `
                  translateY(${isInWave ? -waveIntensity * 10 : isHovered ? -hoverWave * 5 : 0}px)
                  scale(${isInWave ? 1 + waveIntensity * 0.2 : 1})
                `,
                transitionDuration: isInWave ? "0ms" : "200ms",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Ripple effect under text */}
      {waveIndex >= 0 && waveIndex <= children.length && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg,
              transparent ${Math.max(0, (waveIndex / children.length) * 100 - 20)}%,
              ${color} ${(waveIndex / children.length) * 100}%,
              transparent ${Math.min(100, (waveIndex / children.length) * 100 + 20)}%
            )`,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      )}

      {subtitle && complete && (
        <div className="mt-4 font-mono text-sm" style={{ color: accentColor }}>
          <span className="opacity-50">~</span> {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================
// TERMINAL BOOT VARIANT
// ============================================
function TerminalBootVariant({
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [showTitle, setShowTitle] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const bootSequence = useMemo(
    () => [
      { text: "BIOS v3.14.159 initializing...", delay: 100 },
      { text: "[OK] Memory check: 64GB DDR5 @ 6400MHz", delay: 200 },
      { text: "[OK] Storage: NVMe SSD detected", delay: 150 },
      { text: "[OK] Network: Connected to matrix.local", delay: 180 },
      {
        text: `Loading module: ${children.toLowerCase().replace(/\s+/g, "_")}.sys`,
        delay: 250,
      },
      { text: "[OK] Module loaded successfully", delay: 150 },
      { text: "Starting service...", delay: 300 },
      { text: "", delay: 200 },
    ],
    [children],
  );

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setShowTitle(true);
      onAnimationComplete?.();
      return;
    }

    let totalDelay = 0;

    bootSequence.forEach((line, i) => {
      totalDelay += line.delay;
      setTimeout(() => {
        setLines((prev) => [...prev, line.text]);
        if (i === bootSequence.length - 1) {
          setTimeout(() => {
            setShowTitle(true);
            onAnimationComplete?.();
          }, 300);
        }
      }, totalDelay);
    });

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isVisible, reducedMotion, bootSequence, onAnimationComplete]);

  return (
    <div className="relative py-6 font-mono">
      {/* Terminal window */}
      <div
        className="rounded-lg overflow-hidden border"
        style={{
          borderColor: `${color}40`,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        {/* Title bar */}
        <div
          className="px-4 py-2 flex items-center gap-2 border-b"
          style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
        >
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-sm opacity-60" style={{ color }}>
            system_boot.sh
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-4 min-h-[200px]">
          {/* Boot lines */}
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-sm leading-relaxed"
              style={{
                color: line.includes("[OK]")
                  ? "rgb(74, 222, 128)"
                  : line.includes("Loading")
                    ? accentColor
                    : `${color}cc`,
              }}
            >
              {line}
            </div>
          ))}

          {/* Cursor */}
          {!showTitle && (
            <span
              className="inline-block w-2 h-4 ml-1"
              style={{
                backgroundColor: color,
                opacity: cursorVisible ? 1 : 0,
              }}
            />
          )}

          {/* Main title reveal */}
          {showTitle && (
            <div className="mt-6">
              <div className="text-sm opacity-50 mb-2" style={{ color }}>
                ╔══════════════════════════════════════════╗
              </div>
              <div
                className={`${sizeClasses[size]} font-black tracking-tight`}
                style={{
                  color,
                  textShadow: `0 0 20px ${color}, 0 0 40px ${color}40`,
                }}
              >
                {children}
              </div>
              <div className="text-sm opacity-50 mt-2" style={{ color }}>
                ╚══════════════════════════════════════════╝
              </div>
              {subtitle && (
                <div className="mt-4 text-sm" style={{ color: accentColor }}>
                  $ echo &quot;{subtitle}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  isHovered,
  setIsHovered,
  mousePos,
  handleMouseMove,
  reducedMotion,
  onAnimationComplete,
}: HologramProps) {
  const [scanY, setScanY] = useState(0);
  const [intensity, setIntensity] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setIntensity(1);
      onAnimationComplete?.();
      return;
    }

    // Scan animation
    let frame = 0;
    const animate = () => {
      frame++;
      const progress = Math.min(frame / 60, 1);
      setScanY(progress * 100);
      setIntensity(progress);

      if (frame < 60) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, reducedMotion, onAnimationComplete]);

  return (
    <div
      className="relative py-12"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hologram base */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
          opacity: intensity,
        }}
      />

      {/* Projection beam */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{
          height: "150%",
          background: `linear-gradient(to top, ${color}40 0%, transparent 100%)`,
          clipPath: "polygon(35% 100%, 65% 100%, 80% 0%, 20% 0%)",
          opacity: intensity * 0.3,
        }}
      />

      {/* Main hologram text */}
      <div
        className="relative"
        style={{
          transform: `
            perspective(1000px)
            rotateX(${isHovered ? (mousePos.y - 0.5) * 10 : 5}deg)
            rotateY(${isHovered ? (mousePos.x - 0.5) * 10 : 0}deg)
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
              ${color}10 2px,
              ${color}10 4px
            )`,
            opacity: 0.5,
          }}
        />

        {/* Scan line */}
        {intensity < 1 && (
          <div
            className="absolute left-0 right-0 h-1 pointer-events-none z-20"
            style={{
              top: `${scanY}%`,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              boxShadow: `0 0 20px ${color}`,
            }}
          />
        )}

        {/* Multiple layers for depth */}
        {[0, 1, 2].map((layer) => (
          <div
            key={layer}
            className={`${layer > 0 ? "absolute inset-0" : ""} font-mono font-black tracking-tight ${sizeClasses[size]}`}
            style={{
              color: layer === 0 ? color : "transparent",
              WebkitTextStroke: layer > 0 ? `${layer}px ${color}` : undefined,
              opacity:
                layer === 0 ? intensity : intensity * (0.4 - layer * 0.1),
              transform: `translateZ(${-layer * 10}px)`,
              filter: layer > 0 ? `blur(${layer * 0.5}px)` : undefined,
              textShadow:
                layer === 0
                  ? `
                  0 0 10px ${color},
                  0 0 20px ${color},
                  0 0 40px ${color},
                  0 0 80px ${color}40
                `
                  : undefined,
            }}
          >
            {children}
          </div>
        ))}

        {/* Flicker effect */}
        {isHovered && (
          <div
            className={`absolute inset-0 font-mono font-black tracking-tight ${sizeClasses[size]}`}
            style={{
              color,
              opacity: Math.random() > 0.9 ? 0.5 : 0,
              transform: `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`,
            }}
          >
            {children}
          </div>
        )}
      </div>

      {subtitle && intensity >= 1 && (
        <div
          className="mt-6 text-center font-mono text-sm"
          style={{
            color: accentColor,
            textShadow: `0 0 10px ${accentColor}`,
          }}
        >
          ◇ {subtitle} ◇
        </div>
      )}
    </div>
  );
}

// ============================================
// DATA STREAM VARIANT
// ============================================
function DataStreamVariant({
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  reducedMotion,
  onAnimationComplete,
}: VariantProps) {
  const [streams, setStreams] = useState<
    Array<{ chars: string[]; position: number }>
  >([]);
  const [revealed, setRevealed] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setRevealed(true);
      onAnimationComplete?.();
      return;
    }

    // Create data streams for each character
    const newStreams = children.split("").map(() => ({
      chars: Array.from({ length: 8 }, () => randomChar(HEX_CHARS + "01")),
      position: -8,
    }));
    setStreams(newStreams);

    // Animate streams
    let frame = 0;
    const animate = () => {
      frame++;

      setStreams((prev) =>
        prev.map((stream) => ({
          ...stream,
          position: Math.min(stream.position + 0.3, 0),
          chars: stream.chars.map((c) =>
            Math.random() > 0.7 ? randomChar(HEX_CHARS + "01") : c,
          ),
        })),
      );

      if (frame < 80) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRevealed(true);
        onAnimationComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, reducedMotion, children, onAnimationComplete]);

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Data streams */}
      {!revealed && (
        <div className="absolute inset-0">
          {streams.map((stream, i) => (
            <div
              key={i}
              className="absolute font-mono text-xs"
              style={{
                left: `${(i / children.length) * 100}%`,
                top: `${stream.position * 15}%`,
                writingMode: "vertical-rl",
                color,
                opacity: 0.6,
              }}
            >
              {stream.chars.map((char, j) => (
                <span
                  key={j}
                  style={{
                    opacity: 1 - j * 0.1,
                    color: j === stream.chars.length - 1 ? "#fff" : color,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Main text */}
      <div
        className={`relative z-10 font-mono font-black tracking-tight ${sizeClasses[size]}`}
        style={{
          color,
          textShadow: revealed
            ? `0 0 10px ${color}, 0 0 30px ${color}40`
            : "none",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </div>

      {/* Hex decoration */}
      {revealed && (
        <div className="mt-2 font-mono text-xs opacity-40" style={{ color }}>
          {Array.from({ length: children.length * 2 }, () =>
            randomChar(HEX_CHARS),
          ).join(" ")}
        </div>
      )}

      {subtitle && revealed && (
        <div className="mt-4 font-mono text-sm" style={{ color: accentColor }}>
          <span className="opacity-50">0x</span>
          {Array.from({ length: 8 }, () => randomChar(HEX_CHARS)).join("")}
          <span className="opacity-50"> →</span> {subtitle}
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
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  isHovered,
  setIsHovered,
  reducedMotion,
  onAnimationComplete,
}: CyberPunkProps) {
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [clipPaths, setClipPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible || reducedMotion) {
      onAnimationComplete?.();
      return;
    }

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchOffset({
          x: randomBetween(-5, 5),
          y: randomBetween(-2, 2),
        });
        setClipPaths([
          `inset(${randomBetween(0, 30)}% 0 ${randomBetween(50, 100)}% 0)`,
          `inset(${randomBetween(30, 60)}% 0 ${randomBetween(20, 50)}% 0)`,
          `inset(${randomBetween(60, 90)}% 0 ${randomBetween(0, 20)}% 0)`,
        ]);

        setTimeout(() => {
          setGlitchOffset({ x: 0, y: 0 });
          setClipPaths([]);
        }, 100);
      }
    }, 200);

    onAnimationComplete?.();

    return () => clearInterval(glitchInterval);
  }, [isVisible, reducedMotion, onAnimationComplete]);

  return (
    <div
      className="relative py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Neon border frame */}
      <div
        className="absolute inset-0 border-2"
        style={{
          borderColor: color,
          boxShadow: `
            inset 0 0 20px ${color}40,
            0 0 20px ${color}40,
            0 0 40px ${color}20
          `,
          clipPath:
            "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
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
          className={`absolute w-4 h-4 ${pos}`}
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
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
      ))}

      {/* Glitch layers */}
      {clipPaths.map((clip, i) => (
        <div
          key={i}
          className={`absolute inset-0 font-mono font-black tracking-tight ${sizeClasses[size]} flex items-center justify-center`}
          style={{
            color: i === 0 ? "#ff0000" : i === 1 ? "#00ff00" : "#0000ff",
            transform: `translate(${glitchOffset.x * (i + 1)}px, ${glitchOffset.y}px)`,
            clipPath: clip,
            mixBlendMode: "screen",
            opacity: 0.8,
          }}
        >
          {children}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 px-8 py-6">
        <div
          className="text-xs font-mono mb-2 opacity-60"
          style={{ color: accentColor }}
        >
          ▸ SECTOR_7G // {new Date().toISOString().split("T")[0]}
        </div>

        <div
          className={`font-mono font-black tracking-tight ${sizeClasses[size]}`}
          style={{
            color,
            textShadow: `
              0 0 10px ${color},
              0 0 20px ${color},
              ${isHovered ? `0 0 40px ${color}, 0 0 60px ${color}` : ""}
            `,
            transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
          }}
        >
          {children}
        </div>

        {subtitle && (
          <div
            className="mt-4 text-sm font-mono flex items-center gap-2"
            style={{ color: accentColor }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            {subtitle}
          </div>
        )}
      </div>

      {/* Animated border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${color}00, ${color}40, ${color}00)`,
          backgroundSize: "200% 100%",
          animation: isHovered ? "borderSweep 2s linear infinite" : "none",
          mixBlendMode: "overlay",
        }}
      />

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
// QUANTUM FLUX VARIANT
// ============================================
interface QuantumProps extends VariantProps {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  mousePos: { x: number; y: number };
  handleMouseMove: (e: React.MouseEvent) => void;
}

function QuantumFluxVariant({
  children,
  subtitle,
  color,
  accentColor,
  size,
  isVisible,
  isHovered,
  setIsHovered,
  mousePos,
  handleMouseMove,
  reducedMotion,
  onAnimationComplete,
}: QuantumProps) {
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; vx: number; vy: number; char: string }>
  >([]);
  const [phase, setPhase] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setPhase(2);
      onAnimationComplete?.();
      return;
    }

    // Create quantum particles
    const newParticles = Array.from({ length: 50 }, () => ({
      x: randomBetween(0, 100),
      y: randomBetween(0, 100),
      vx: randomBetween(-1, 1),
      vy: randomBetween(-1, 1),
      char: randomChar("◦•○●◉◎⊙⊚"),
    }));
    setParticles(newParticles);

    let frame = 0;
    const animate = () => {
      frame++;

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + p.vx + 100) % 100,
          y: (p.y + p.vy + 100) % 100,
          char: Math.random() > 0.95 ? randomChar("◦•○●◉◎⊙⊚") : p.char,
        })),
      );

      if (frame === 30) setPhase(1);
      if (frame === 60) {
        setPhase(2);
        onAnimationComplete?.();
      }

      if (frame < 60) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, reducedMotion, onAnimationComplete]);

  return (
    <div
      className="relative py-12"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quantum field background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute text-xs transition-all duration-300"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              color,
              opacity: phase < 2 ? 0.6 : 0.2,
              transform: phase === 2 ? "scale(0.5)" : "scale(1)",
              textShadow: `0 0 5px ${color}`,
            }}
          >
            {p.char}
          </div>
        ))}
      </div>

      {/* Probability wave */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${color}20 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Main text with quantum uncertainty */}
      <div className="relative z-10">
        <div
          className={`font-mono font-black tracking-tight ${sizeClasses[size]}`}
          style={{
            color,
            textShadow: `
              0 0 10px ${color},
              0 0 30px ${color}60,
              0 0 60px ${color}30
            `,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(1.1)",
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {children.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                transform: isHovered
                  ? `translate(${Math.sin(Date.now() / 500 + i) * 2}px, ${Math.cos(Date.now() / 500 + i) * 2}px)`
                  : "none",
                transition: "transform 0.1s",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Quantum state indicator */}
        <div
          className="mt-4 flex items-center justify-center gap-3 font-mono text-xs"
          style={{
            color: accentColor,
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        >
          <span>ψ</span>
          <span className="opacity-50">|</span>
          <span>{isHovered ? "OBSERVED" : "SUPERPOSITION"}</span>
          <span className="opacity-50">|</span>
          <span>⟩</span>
        </div>

        {subtitle && phase >= 2 && (
          <div
            className="mt-4 text-center font-mono text-sm"
            style={{ color: accentColor }}
          >
            ∿ {subtitle} ∿
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AwwardsHeading({
  children,
  variant = "glitchMorph",
  subtitle,
  className = "",
  color = "var(--terminal-green)",
  accentColor = "var(--terminal-orange)",
  size = "xl",
  animate = true,
  animateOnScroll = true,
  delay = 0,
  onAnimationComplete,
}: AwwardsHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

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
    children,
    subtitle,
    color,
    accentColor,
    size,
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
      case "neuralNetwork":
        return <NeuralNetworkVariant {...variantProps} />;
      case "pixelDissolve":
        return <PixelDissolveVariant {...variantProps} />;
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
      case "terminalBoot":
        return <TerminalBootVariant {...variantProps} />;
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
      case "dataStream":
        return <DataStreamVariant {...variantProps} />;
      case "cyberPunk":
        return (
          <CyberPunkVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        );
      case "quantumFlux":
        return (
          <QuantumFluxVariant
            {...variantProps}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            mousePos={mousePos}
            handleMouseMove={handleMouseMove}
          />
        );
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

  return (
    <div
      ref={containerRef}
      className={`awwards-heading relative ${className}`}
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
export const AwwardsHeadingPresets = {
  hero: {
    size: "2xl" as const,
    animate: true,
    animateOnScroll: false,
  },
  section: {
    size: "xl" as const,
    animate: true,
    animateOnScroll: true,
  },
  subsection: {
    size: "lg" as const,
    animate: true,
    animateOnScroll: true,
    delay: 200,
  },
};
