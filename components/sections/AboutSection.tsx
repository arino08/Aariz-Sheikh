"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ParallaxBackground, FloatingElement } from "../ui/ParallaxSection";
import {
  FolderIcon,
  LightningIcon,
  GraduationIcon,
  CoffeeIcon,
  RocketIcon,
} from "../ui/TerminalIcons";

gsap.registerPlugin(ScrollTrigger);

// Hook to check performance settings
function usePerformanceSettings() {
  const [settings, setSettings] = useState({
    enableAnimations: true,
    enableParallax: true,
    enableGlow: true,
    level: "high" as string,
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
            enableParallax: parsed.enableParallax !== false,
            enableGlow: parsed.enableGlow !== false,
            level: parsed.level || "high",
          });
        }
      } catch {
        // Use defaults
      }
    };

    checkSettings();

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

// ASCII Art for "ABOUT" - large decorative text
const ASCII_ABOUT = `
 █████╗ ██████╗  ██████╗ ██╗   ██╗████████╗
██╔══██╗██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝
███████║██████╔╝██║   ██║██║   ██║   ██║
██╔══██║██╔══██╗██║   ██║██║   ██║   ██║
██║  ██║██████╔╝╚██████╔╝╚██████╔╝   ██║
╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝    ╚═╝
`;

// Interactive ASCII Heading Component with hover effects
function AsciiAboutHeading({
  onHover,
}: {
  onHover?: (isHovered: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchText, setGlitchText] = useState(ASCII_ABOUT);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const glitchChars = "█▓▒░╔╗╚╝║═╬╣╠╩╦@#$%&*";

  // Glitch effect on hover
  useEffect(() => {
    if (!isHovered) {
      setGlitchText(ASCII_ABOUT);
      return;
    }

    const glitchInterval = setInterval(() => {
      const lines = ASCII_ABOUT.split("\n");
      const glitchedLines = lines.map((line) => {
        return line
          .split("")
          .map((char) => {
            if (char !== " " && char !== "\n" && Math.random() < 0.03) {
              return glitchChars[
                Math.floor(Math.random() * glitchChars.length)
              ];
            }
            return char;
          })
          .join("");
      });
      setGlitchText(glitchedLines.join("\n"));
    }, 50);

    return () => clearInterval(glitchInterval);
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePos({ x, y });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
    onHover?.(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
        transition: isHovered ? "none" : "transform 0.5s ease-out",
      }}
    >
      {/* Glow effect behind */}
      <div
        className="absolute inset-0 blur-2xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center, var(--terminal-green) 0%, transparent 70%)`,
          opacity: isHovered ? 0.3 : 0.1,
        }}
      />

      {/* Shadow layers for 3D effect */}
      <pre
        className="absolute font-mono text-[0.35rem] sm:text-[0.45rem] md:text-[0.55rem] lg:text-[0.65rem] leading-none whitespace-pre pointer-events-none"
        style={{
          color: "var(--terminal-purple)",
          opacity: 0.3,
          transform: "translate(4px, 4px)",
          filter: "blur(1px)",
        }}
      >
        {ASCII_ABOUT}
      </pre>
      <pre
        className="absolute font-mono text-[0.35rem] sm:text-[0.45rem] md:text-[0.55rem] lg:text-[0.65rem] leading-none whitespace-pre pointer-events-none"
        style={{
          color: "var(--terminal-blue)",
          opacity: 0.5,
          transform: "translate(2px, 2px)",
        }}
      >
        {ASCII_ABOUT}
      </pre>

      {/* Main text */}
      <pre
        className="relative font-mono text-[0.35rem] sm:text-[0.45rem] md:text-[0.55rem] lg:text-[0.65rem] leading-none whitespace-pre transition-all duration-300"
        style={{
          color: isHovered ? "var(--terminal-cyan)" : "var(--terminal-green)",
          textShadow: isHovered
            ? "0 0 20px var(--terminal-green), 0 0 40px var(--terminal-green)"
            : "0 0 10px var(--terminal-green)",
        }}
      >
        {glitchText}
      </pre>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      {/* Subtitle */}
      <div className="mt-4 font-mono text-xs text-[var(--code-comment)] flex items-center gap-2">
        <span className="text-[var(--terminal-green)]">{">"}</span>
        <span
          className={`transition-all duration-300 ${isHovered ? "text-[var(--terminal-green)]" : ""}`}
        >
          get_to_know_me()
        </span>
        <span
          className={`inline-block w-2 h-4 bg-[var(--terminal-green)] ${isHovered ? "animate-pulse" : "animate-[blink_1s_step-end_infinite]"}`}
        />
      </div>
    </div>
  );
}

// Stat Card with awwwards-level effects
function StatCard({
  label,
  displayValue,
  icon,
  color,
  index,
  isVisible,
}: {
  label: string;
  displayValue: string;
  icon: React.ReactNode;
  color: string;
  index: number;
  isVisible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showValue, setShowValue] = useState(false);

  // Staggered reveal
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowValue(true), index * 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, index]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`stat-item group relative rounded-xl cursor-default transition-all duration-700 ${
        showValue ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      style={{
        transform: `perspective(800px) rotateX(${-mousePos.y * 8}deg) rotateY(${mousePos.x * 8}deg) ${showValue ? "translateY(0)" : "translateY(2rem)"}`,
        transition: isHovered
          ? "transform 0.1s ease-out, opacity 0.7s ease-out"
          : "transform 0.5s ease-out, opacity 0.7s ease-out",
      }}
    >
      {/* Background with gradient */}
      <div
        className="absolute inset-0 bg-[#161B22]/90 backdrop-blur-sm border border-gray-800 rounded-xl transition-all duration-500 overflow-hidden"
        style={{
          borderColor: isHovered ? color : "rgb(31, 41, 55)",
          boxShadow: isHovered
            ? `0 0 30px ${color}30, inset 0 0 30px ${color}10`
            : "none",
        }}
      >
        {/* Animated gradient overlay - moved inside background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, ${color}20, transparent 50%)`,
          }}
        />

        {/* Shine effect - moved inside background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(${135 + mousePos.x * 30}deg, transparent 40%, ${color}40 50%, transparent 60%)`,
          }}
        />

        {/* Corner accents - moved inside background */}
        <div
          className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${color}30 50%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75"
          style={{
            background: `linear-gradient(-45deg, transparent 50%, ${color}20 50%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 text-center">
        {/* Icon container - positioned to allow overflow */}
        <div
          className="text-2xl mb-3 transition-all duration-500 ease-out"
          style={{
            transform: isHovered
              ? "scale(1.4) rotate(12deg) translateY(-8px)"
              : "scale(1) rotate(0deg) translateY(0)",
            filter: isHovered ? `drop-shadow(0 0 10px ${color})` : "none",
          }}
        >
          {icon}
        </div>
        <div
          className="font-mono text-3xl font-bold mb-1 transition-all duration-300"
          style={{
            color: color,
            textShadow: isHovered ? `0 0 20px ${color}` : "none",
            letterSpacing: isHovered ? "0.1em" : "0",
          }}
        >
          {displayValue}
        </div>
        <div className="font-mono text-xs text-[var(--code-comment)] uppercase tracking-wider group-hover:text-gray-400 transition-colors duration-300">
          {label}
        </div>
      </div>
    </div>
  );
}

// Glitch Reveal Component - performant CSS-based effect
function GlitchRevealImage({
  src,
  alt,
  aspectRatio = "4608/2080",
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchFrame, setGlitchFrame] = useState(0);

  // Intersection observer for scroll trigger
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isRevealed) {
          // Start glitch sequence
          setIsGlitching(true);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isRevealed]);

  // Glitch animation sequence for initial reveal
  useEffect(() => {
    if (!isGlitching) return;

    let frame = 0;
    const totalFrames = 25;
    const interval = setInterval(() => {
      frame++;
      setGlitchFrame(frame);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setIsGlitching(false);
        setIsRevealed(true);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [isGlitching]);

  // Continuous glitch effect while hovering
  useEffect(() => {
    if (!isHovered || !isRevealed) return;

    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 30;
      setGlitchFrame(frame);
    }, 40);

    return () => clearInterval(interval);
  }, [isHovered, isRevealed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setGlitchFrame(0);
  };

  // Calculate glitch offsets based on frame - intensified
  const getGlitchStyles = () => {
    if (!isGlitching && isRevealed && !isHovered) {
      return {
        clipPath: "inset(0 0 0 0)",
        redOffset: 0,
        blueOffset: 0,
        greenOffset: 0,
        sliceOffsets: Array(15).fill(0),
        skewX: 0,
        brightness: 1,
      };
    }

    // Much higher intensity for more dramatic effect
    const intensity = isGlitching
      ? Math.sin((glitchFrame / 25) * Math.PI) * 1.5 // Peak in middle, 1.5x stronger
      : isHovered
        ? 0.8 + Math.sin(glitchFrame * 0.5) * 0.4 // Pulsing intensity while hovering
        : 0;

    // Stronger RGB split
    const redOffset = (Math.random() - 0.5) * 25 * intensity;
    const blueOffset = (Math.random() - 0.5) * 25 * intensity;
    const greenOffset = (Math.random() - 0.5) * 15 * intensity;

    // More slices with stronger displacement
    const sliceOffsets = Array(15)
      .fill(0)
      .map(() => (Math.random() - 0.5) * 60 * intensity);

    // Random skew for extra distortion
    const skewX = (Math.random() - 0.5) * 5 * intensity;

    // Flickering brightness
    const brightness = 1 + (Math.random() - 0.5) * 0.4 * intensity;

    return {
      clipPath: isGlitching
        ? `inset(0 ${100 - (glitchFrame / 25) * 100}% 0 0)`
        : "inset(0 0 0 0)",
      redOffset,
      blueOffset,
      greenOffset,
      sliceOffsets,
      skewX,
      brightness,
    };
  };

  const glitchStyles = getGlitchStyles();

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0D1117]" />

      {/* Glitch slices - horizontal displacement effect - more slices */}
      {(isGlitching || isHovered) && (
        <div
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
          style={{
            transform: `skewX(${glitchStyles.skewX}deg)`,
            filter: `brightness(${glitchStyles.brightness})`,
          }}
        >
          {glitchStyles.sliceOffsets.map((offset, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 overflow-hidden"
              style={{
                top: `${i * (100 / 15)}%`,
                height: `${100 / 15 + 0.5}%`,
                transform: `translateX(${offset}px) scaleX(${1 + Math.abs(offset) * 0.002})`,
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                style={{
                  objectPosition: `center ${i * (100 / 15)}%`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* RGB Split - Red channel */}
      <div
        className="absolute inset-0 z-10 mix-blend-lighten"
        style={{
          transform: `translateX(${glitchStyles.redOffset}px) translateY(${glitchStyles.redOffset * 0.3}px)`,
          opacity: isGlitching || isHovered ? 0.8 : 0,
          transition: "opacity 0.1s",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          style={{
            filter:
              "sepia(100%) saturate(5000%) hue-rotate(-30deg) brightness(1.1)",
          }}
        />
      </div>

      {/* RGB Split - Green channel */}
      <div
        className="absolute inset-0 z-10 mix-blend-lighten"
        style={{
          transform: `translateX(${glitchStyles.greenOffset}px)`,
          opacity: isGlitching || isHovered ? 0.6 : 0,
          transition: "opacity 0.1s",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          style={{
            filter:
              "sepia(100%) saturate(5000%) hue-rotate(90deg) brightness(1.1)",
          }}
        />
      </div>

      {/* RGB Split - Blue channel */}
      <div
        className="absolute inset-0 z-10 mix-blend-lighten"
        style={{
          transform: `translateX(${glitchStyles.blueOffset}px) translateY(${glitchStyles.blueOffset * -0.3}px)`,
          opacity: isGlitching || isHovered ? 0.8 : 0,
          transition: "opacity 0.1s",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          style={{
            filter:
              "sepia(100%) saturate(5000%) hue-rotate(180deg) brightness(1.1)",
          }}
        />
      </div>

      {/* Main image with reveal clip-path */}
      <div
        className="absolute inset-0 z-15 transition-all duration-100"
        style={{
          clipPath: glitchStyles.clipPath,
        }}
      >
        <Image src={src} alt={alt} fill className="object-cover" priority />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent opacity-50" />
      </div>

      {/* Glitch lines - more lines, varied colors */}
      {(isGlitching || isHovered) && (
        <div className="absolute inset-0 z-25 pointer-events-none">
          {[...Array(12)].map((_, i) => {
            const colors = ["#00ff88", "#ff0066", "#00d4ff", "#ffff00"];
            const color = colors[i % colors.length];
            return (
              <div
                key={i}
                className="absolute left-0 right-0"
                style={{
                  top: `${(i * 8 + Math.random() * 10) % 100}%`,
                  height: `${1 + Math.random() * 4}px`,
                  backgroundColor: color,
                  opacity: 0.5 + Math.random() * 0.5,
                  transform: `translateX(${(Math.random() - 0.5) * 80}px) scaleX(${0.5 + Math.random() * 1})`,
                  boxShadow: `0 0 15px ${color}`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Flicker overlay */}
      {(isGlitching || isHovered) && glitchFrame % 4 === 0 && (
        <div
          className="absolute inset-0 z-26 pointer-events-none bg-white mix-blend-overlay"
          style={{ opacity: 0.03 + Math.random() * 0.05 }}
        />
      )}

      {/* Static noise overlay during glitch - also on hover */}
      {(isGlitching || isHovered) && (
        <div
          className="absolute inset-0 z-25 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            opacity: isHovered ? 0.15 + Math.random() * 0.1 : 0.2,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Random block glitches */}
      {(isGlitching || isHovered) && (
        <div className="absolute inset-0 z-24 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#00ff88]"
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                width: `${20 + Math.random() * 60}px`,
                height: `${2 + Math.random() * 8}px`,
                opacity: Math.random() * 0.6,
                transform: `translateX(${(Math.random() - 0.5) * 100}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 z-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      {/* Border frame */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-35 border-2 transition-all duration-300"
        style={{
          borderColor: isHovered
            ? "rgba(0, 255, 136, 0.6)"
            : isRevealed
              ? "rgba(0, 255, 136, 0.2)"
              : "rgba(0, 255, 136, 0.5)",
          boxShadow: isHovered
            ? "inset 0 0 30px rgba(0, 255, 136, 0.2), 0 0 40px rgba(0, 255, 136, 0.3)"
            : isGlitching
              ? "inset 0 0 50px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.4)"
              : "none",
        }}
      />

      {/* Loading / Status indicator */}
      <div className="absolute bottom-4 left-4 font-mono text-xs z-40">
        <div
          className="flex items-center gap-2 text-[var(--terminal-green)] bg-[#0D1117]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border transition-all duration-300"
          style={{
            borderColor: isHovered
              ? "rgba(0, 255, 136, 0.6)"
              : "rgba(0, 255, 136, 0.3)",
            boxShadow: isHovered ? "0 0 15px rgba(0, 255, 136, 0.4)" : "none",
          }}
        >
          <span
            className={`w-2 h-2 bg-[var(--terminal-green)] rounded-full ${
              isGlitching ? "animate-ping" : "animate-pulse"
            }`}
          />
          <span className={isHovered ? "animate-pulse" : ""}>
            {isGlitching
              ? "D̷E̵C̸O̴D̵I̸N̵G̶.̷.̸.̵"
              : isHovered
                ? "< G̸L̵I̷T̶C̵H̷_̸M̵O̷D̸E̵ />"
                : "available for opportunities"}
          </span>
        </div>
      </div>

      {/* Location tag */}
      <div className="absolute bottom-4 right-4 font-mono text-xs text-[var(--code-comment)] bg-[#0D1117]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700 z-40">
        <span className="text-[var(--terminal-blue)]">📍</span> Mumbai, India
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-[#00ff88] z-35 transition-opacity duration-300"
        style={{ opacity: isHovered ? 0.8 : 0.4 }}
      />
      <div
        className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-[#00ff88] z-35 transition-opacity duration-300"
        style={{ opacity: isHovered ? 0.8 : 0.4 }}
      />
      <div
        className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-[#00ff88] z-35 transition-opacity duration-300"
        style={{ opacity: isHovered ? 0.8 : 0.4 }}
      />
      <div
        className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-[#00ff88] z-35 transition-opacity duration-300"
        style={{ opacity: isHovered ? 0.8 : 0.4 }}
      />

      {/* Initial loading state */}
      {!isRevealed && !isGlitching && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117] z-50">
          <div className="font-mono text-[#00ff88] text-sm flex flex-col items-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-[#00ff88]/30 animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${20 + Math.random() * 20}px`,
                  }}
                />
              ))}
            </div>
            <span className="animate-pulse">{">"} Awaiting signal...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [codeLines, setCodeLines] = useState<number>(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [headingHovered, setHeadingHovered] = useState(false);

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;

  // Stats with proper display values (no animation issues)
  const stats = [
    {
      label: "Projects",
      displayValue: "10+",
      icon: <FolderIcon size={20} color="var(--terminal-green)" />,
      color: "var(--terminal-green)",
    },
    {
      label: "Technologies",
      displayValue: "15+",
      icon: <LightningIcon size={20} color="var(--terminal-orange)" />,
      color: "var(--terminal-orange)",
    },
    {
      label: "Year",
      displayValue: "3rd",
      icon: <GraduationIcon size={20} color="var(--terminal-purple)" />,
      color: "var(--terminal-purple)",
    },
    {
      label: "Coffees",
      displayValue: "∞",
      icon: <CoffeeIcon size={20} color="var(--terminal-blue)" />,
      color: "var(--terminal-blue)",
    },
  ];

  const codeContent = [
    { type: "comment", text: "// Who am I?" },
    { type: "blank", text: "" },
    { type: "keyword", text: "pub struct ", append: "Developer {" },
    { type: "field", name: "name", value: '"Aariz Sheikh"' },
    { type: "field", name: "role", value: '"Full-Stack Developer"' },
    { type: "field", name: "education", value: '"3rd Year IT"' },
    { type: "array-start", name: "passions", text: "vec![" },
    { type: "array-item", value: '"Building scalable apps"' },
    { type: "array-item", value: '"Systems programming"' },
    { type: "array-item", value: '"Clean architecture"' },
    { type: "array-end", text: "]," },
    { type: "array-start", name: "current_focus", text: "vec![" },
    { type: "array-inline", values: ['"Rust"', '"Next.js"', '"GenAI"'] },
    { type: "array-end", text: "]," },
    { type: "close", text: "}" },
    { type: "blank", text: "" },
    { type: "comment-icon", text: "// Always learning, always building" },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;
    const codeBlock = codeBlockRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;

    if (!section || !animationsEnabled) {
      setCodeLines(codeContent.length);
      setStatsVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Left column slide in
      if (leftCol) {
        gsap.set(leftCol, { opacity: 0, x: -80 });
        tl.to(
          leftCol,
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            onComplete: () => setStatsVisible(true),
          },
          0.2,
        );
      }

      // Image container fade in
      if (imageContainer) {
        gsap.set(imageContainer, { opacity: 0, y: 40 });
        tl.to(
          imageContainer,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          0.4,
        );
      }

      // Code block slide in
      if (codeBlock) {
        gsap.set(codeBlock, { opacity: 0, x: 60, rotateY: -5 });
        tl.to(
          codeBlock,
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
              let lineIndex = 0;
              const typeInterval = setInterval(() => {
                lineIndex++;
                setCodeLines(lineIndex);
                if (lineIndex >= codeContent.length) {
                  clearInterval(typeInterval);
                }
              }, 80);
            },
          },
          0.7,
        );
      }

      // Parallax effect
      if (leftCol && rightCol) {
        gsap.to(leftCol, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(rightCol, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animationsEnabled, codeContent.length]);

  const renderCodeLine = (
    line: (typeof codeContent)[0],
    index: number,
    visible: boolean,
  ) => {
    if (!visible) return null;

    switch (line.type) {
      case "comment":
        return <div className="text-[var(--code-comment)]">{line.text}</div>;
      case "comment-icon":
        return (
          <div className="text-[var(--code-comment)] flex items-center gap-1">
            {line.text}
            <RocketIcon
              size={14}
              color="var(--terminal-green)"
              className="inline-block"
            />
          </div>
        );
      case "blank":
        return <div className="h-4" />;
      case "keyword":
        return (
          <div>
            <span className="text-[var(--code-keyword)]">{line.text}</span>
            <span className="text-[var(--terminal-blue)]">Developer</span>
            <span className="text-white"> {"{"}</span>
          </div>
        );
      case "field":
        return (
          <div className="pl-4">
            <span className="text-[var(--terminal-purple)]">{line.name}</span>
            <span className="text-white">: </span>
            <span className="text-[var(--terminal-green)]">{line.value}</span>
            <span className="text-white">,</span>
          </div>
        );
      case "array-start":
        return (
          <div className="pl-4">
            <span className="text-[var(--terminal-purple)]">{line.name}</span>
            <span className="text-white">: </span>
            <span className="text-[var(--terminal-blue)]">{line.text}</span>
          </div>
        );
      case "array-item":
        return (
          <div className="pl-8">
            <span className="text-[var(--terminal-green)]">{line.value}</span>
            <span className="text-white">,</span>
          </div>
        );
      case "array-inline":
        return (
          <div className="pl-8">
            {line.values?.map((v, i) => (
              <span key={i}>
                <span className="text-[var(--terminal-green)]">{v}</span>
                {i < (line.values?.length || 0) - 1 && (
                  <span className="text-white">, </span>
                )}
              </span>
            ))}
          </div>
        );
      case "array-end":
        return (
          <div className="pl-4">
            <span className="text-white">{line.text}</span>
          </div>
        );
      case "close":
        return <div className="text-white">{line.text}</div>;
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 py-20 md:py-32 relative overflow-hidden"
      id="about"
    >
      {/* Background Effects */}
      <ParallaxBackground variant="dots" speed={0.15} opacity={0.03} />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement
          className="absolute top-20 right-10 opacity-10"
          floatSpeed={0.8}
          rotateAmount={10}
        >
          <div className="text-[var(--terminal-green)] font-mono text-6xl">
            {"</>"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute bottom-32 left-10 opacity-10"
          floatSpeed={0.6}
          rotateAmount={8}
        >
          <div className="text-[var(--terminal-purple)] font-mono text-4xl">
            {"fn()"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute top-1/3 right-1/4 opacity-5"
          floatSpeed={0.4}
          rotateAmount={5}
        >
          <div className="text-[var(--terminal-blue)] font-mono text-8xl">
            {"{}"}
          </div>
        </FloatingElement>
      </div>

      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl transition-all duration-1000"
          style={{
            background: headingHovered
              ? "rgba(0, 255, 136, 0.15)"
              : "rgba(0, 255, 136, 0.05)",
          }}
        />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--terminal-purple)]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--terminal-blue)]/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Main Grid - ASCII Heading + Stats Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column - ASCII Heading + Stats */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 lg:sticky lg:top-32 space-y-8"
          >
            {/* ASCII Art Heading */}
            <AsciiAboutHeading onHover={setHeadingHovered} />

            {/* Brief Description */}
            <div className="bg-[#161B22]/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[var(--terminal-green)]/50 transition-all duration-500 group">
              <div className="font-mono text-xs text-[var(--terminal-green)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-pulse" />
                <span>README.md</span>
              </div>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                A passionate developer crafting digital experiences with clean
                code and creative solutions. Currently exploring the depths of
                systems programming and modern web technologies.
              </p>
            </div>

            {/* Stats Grid - with padding to allow icon overflow */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  label={stat.label}
                  displayValue={stat.displayValue}
                  icon={stat.icon}
                  color={stat.color}
                  index={index}
                  isVisible={statsVisible}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Image & Code */}
          <div ref={rightColRef} className="lg:col-span-7 space-y-8">
            {/* Image Section with Glitch Reveal Effect */}
            <div ref={imageContainerRef} className="relative group">
              {/* Animated border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--terminal-green)] via-[var(--terminal-blue)] to-[var(--terminal-purple)] rounded-2xl opacity-40 blur-sm group-hover:opacity-60 transition-opacity duration-500" />

              {/* Glitch Reveal Image Component */}
              <GlitchRevealImage
                src="/assets/THEdev.jpg"
                alt="Aariz Sheikh - Developer"
                aspectRatio="4608/2080"
              />

              {/* Floating file tag */}
              <div className="absolute -top-3 -right-3 font-mono text-xs text-[var(--code-comment)] bg-[#161B22] px-3 py-1.5 border border-[var(--terminal-purple)]/50 rounded-lg shadow-lg hover:border-[var(--terminal-purple)] transition-colors duration-300 z-40">
                <span className="text-[var(--terminal-purple)]">📄</span>{" "}
                THEdev.jpg
              </div>
            </div>

            {/* Code Block */}
            <div
              ref={codeBlockRef}
              className="bg-[#161B22]/90 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors duration-300"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Code header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#21262D] border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_#ff5f56] hover:shadow-[0_0_10px_#ff5f56] transition-shadow cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_#ffbd2e] hover:shadow-[0_0_10px_#ffbd2e] transition-shadow cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-[#27ca3f] shadow-[0_0_6px_#27ca3f] hover:shadow-[0_0_10px_#27ca3f] transition-shadow cursor-pointer" />
                  </div>
                  <span className="font-mono text-xs text-[var(--code-comment)]">
                    about.rs
                  </span>
                </div>
                <div className="font-mono text-xs text-[var(--code-comment)]">
                  rust
                </div>
              </div>

              {/* Code content with typewriter effect */}
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto min-h-[300px]">
                {codeContent.map((line, index) => (
                  <div
                    key={index}
                    className={`transition-opacity duration-150 ${
                      index < codeLines ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {renderCodeLine(line, index, index < codeLines)}
                  </div>
                ))}

                {/* Blinking cursor */}
                {codeLines < codeContent.length && codeLines > 0 && (
                  <span className="inline-block w-2 h-4 bg-[var(--terminal-green)] animate-pulse ml-1" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
