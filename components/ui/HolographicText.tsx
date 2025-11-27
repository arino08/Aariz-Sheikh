"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

interface HolographicTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  color?: string;
  layers?: number;
  depth?: number;
  enableRGBSplit?: boolean;
  enableGlow?: boolean;
  enableScanlines?: boolean;
  animateOnScroll?: boolean;
  intensity?: "subtle" | "medium" | "strong";
  onAnimationComplete?: () => void;
}

export default function HolographicText({
  children,
  as: Component = "h2",
  className = "",
  size = "lg",
  color = "var(--terminal-green)",
  layers = 6,
  depth = 8,
  enableRGBSplit = true,
  enableGlow = true,
  enableScanlines = true,
  animateOnScroll = true,
  intensity = "medium",
  onAnimationComplete,
}: HolographicTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Intensity multipliers
  const intensityValues = {
    subtle: { depth: 0.5, rgb: 0.5, glow: 0.5 },
    medium: { depth: 1, rgb: 1, glow: 1 },
    strong: { depth: 1.5, rgb: 1.5, glow: 1.5 },
  };

  const multiplier = intensityValues[intensity];

  // Size classes
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl lg:text-5xl",
    xl: "text-4xl md:text-5xl lg:text-6xl",
    "2xl": "text-5xl md:text-6xl lg:text-7xl",
  };

  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Mouse tracking for parallax effect
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || reducedMotion) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate position relative to center (-1 to 1)
      const x = ((e.clientX - centerX) / (rect.width / 2)) * multiplier.depth;
      const y = ((e.clientY - centerY) / (rect.height / 2)) * multiplier.depth;

      setMousePosition({ x, y });
    },
    [reducedMotion, multiplier.depth]
  );

  // Global mouse tracking
  useEffect(() => {
    if (reducedMotion) return;

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, reducedMotion]);

  // Scroll trigger for entrance animation
  useEffect(() => {
    if (!animateOnScroll || !containerRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            playEntranceAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [animateOnScroll, hasAnimated]);

  // Entrance animation
  const playEntranceAnimation = useCallback(() => {
    if (!containerRef.current || reducedMotion) {
      setHasAnimated(true);
      onAnimationComplete?.();
      return;
    }

    const layerElements = containerRef.current.querySelectorAll(".holo-layer");
    const rgbElements = containerRef.current.querySelectorAll(".rgb-layer");

    animationRef.current = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true);
        onAnimationComplete?.();
      },
    });

    // Animate layers from scattered to position
    animationRef.current.fromTo(
      layerElements,
      {
        opacity: 0,
        y: (i) => -50 + i * 20,
        x: (i) => (i % 2 === 0 ? -30 : 30),
        rotateX: -20,
        scale: 0.8,
      },
      {
        opacity: (i) => 1 - i * 0.12,
        y: 0,
        x: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
      }
    );

    // Animate RGB split
    if (enableRGBSplit) {
      animationRef.current.fromTo(
        rgbElements,
        {
          opacity: 0,
          x: (i) => (i === 0 ? -20 : 20),
        },
        {
          opacity: 0.7,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );
    }
  }, [reducedMotion, enableRGBSplit, onAnimationComplete]);

  // Initial animation without scroll trigger
  useEffect(() => {
    if (!animateOnScroll && !hasAnimated) {
      setIsVisible(true);
      playEntranceAnimation();
    }
  }, [animateOnScroll, hasAnimated, playEntranceAnimation]);

  // Generate layer styles
  const getLayerStyle = (index: number) => {
    const layerDepth = (index / layers) * depth * multiplier.depth;
    const opacity = 1 - index * 0.15;

    // Parallax offset based on mouse position
    const offsetX = mousePosition.x * layerDepth * (isHovered ? 1.5 : 1);
    const offsetY = mousePosition.y * layerDepth * (isHovered ? 1.5 : 1);

    return {
      transform: `translate3d(${offsetX}px, ${offsetY}px, ${-layerDepth}px)`,
      opacity: isVisible ? opacity : 0,
      color: index === 0 ? color : undefined,
      WebkitTextStroke: index > 0 ? `${0.5 + index * 0.3}px ${color}` : undefined,
      WebkitTextFillColor: index > 0 ? "transparent" : undefined,
      filter: index > 0 ? `blur(${index * 0.3}px)` : undefined,
      textShadow:
        index === 0 && enableGlow
          ? `0 0 ${10 * multiplier.glow}px ${color},
             0 0 ${20 * multiplier.glow}px ${color},
             0 0 ${40 * multiplier.glow}px ${color}`
          : undefined,
      transition: reducedMotion ? "none" : "transform 0.1s ease-out",
    };
  };

  // RGB split styles
  const getRGBStyle = (type: "red" | "cyan") => {
    const offset = (isHovered ? 4 : 2) * multiplier.rgb;
    const x = type === "red" ? -offset : offset;
    const rgbColor = type === "red" ? "#ff0000" : "#00ffff";

    return {
      transform: `translate3d(${x + mousePosition.x * 2}px, ${mousePosition.y}px, -2px)`,
      color: rgbColor,
      opacity: isVisible ? 0.4 : 0,
      mixBlendMode: "screen" as const,
      transition: reducedMotion ? "none" : "transform 0.15s ease-out, opacity 0.3s",
    };
  };

  return (
    <div
      ref={containerRef}
      className={`holographic-text relative inline-block ${className}`}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "50% 50%",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scanlines overlay */}
      {enableScanlines && (
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            )`,
            opacity: isHovered ? 0.5 : 0.3,
            transition: "opacity 0.3s",
          }}
          aria-hidden="true"
        />
      )}

      {/* Main text container with 3D transform */}
      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${-mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
          transition: reducedMotion ? "none" : "transform 0.1s ease-out",
        }}
      >
        {/* Depth layers */}
        {Array.from({ length: layers }).map((_, index) => (
          <Component
            key={`layer-${index}`}
            className={`holo-layer font-mono font-bold tracking-wider select-none ${sizeClasses[size]} ${
              index > 0 ? "absolute inset-0" : "relative"
            }`}
            style={getLayerStyle(index)}
            aria-hidden={index > 0}
          >
            {children}
          </Component>
        ))}

        {/* RGB split layers */}
        {enableRGBSplit && (
          <>
            <Component
              className={`rgb-layer absolute inset-0 font-mono font-bold tracking-wider select-none pointer-events-none ${sizeClasses[size]}`}
              style={getRGBStyle("red")}
              aria-hidden="true"
            >
              {children}
            </Component>
            <Component
              className={`rgb-layer absolute inset-0 font-mono font-bold tracking-wider select-none pointer-events-none ${sizeClasses[size]}`}
              style={getRGBStyle("cyan")}
              aria-hidden="true"
            >
              {children}
            </Component>
          </>
        )}

        {/* Glitch line on hover */}
        {isHovered && !reducedMotion && (
          <div
            className="absolute left-0 right-0 h-px bg-white z-30 pointer-events-none"
            style={{
              top: `${50 + Math.sin(Date.now() / 100) * 20}%`,
              opacity: 0.6,
              boxShadow: `0 0 10px ${color}`,
              animation: "glitchLineMove 0.5s linear infinite",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Reflection effect */}
      <div
        className="absolute left-0 right-0 overflow-hidden pointer-events-none"
        style={{
          top: "100%",
          height: "50%",
          transform: "scaleY(-1)",
          opacity: isHovered ? 0.15 : 0.08,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 80%)",
          filter: "blur(2px)",
          transition: "opacity 0.3s",
        }}
        aria-hidden="true"
      >
        <Component
          className={`font-mono font-bold tracking-wider ${sizeClasses[size]}`}
          style={{ color }}
        >
          {children}
        </Component>
      </div>

      {/* Inline styles for animation */}
      <style jsx>{`
        @keyframes glitchLineMove {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(10px) scaleX(0.95);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(20px) scaleX(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Preset configurations for different use cases
export const HolographicPresets = {
  hero: {
    size: "2xl" as const,
    layers: 8,
    depth: 12,
    intensity: "strong" as const,
    enableRGBSplit: true,
    enableGlow: true,
    enableScanlines: true,
  },
  section: {
    size: "xl" as const,
    layers: 6,
    depth: 8,
    intensity: "medium" as const,
    enableRGBSplit: true,
    enableGlow: true,
    enableScanlines: false,
  },
  subsection: {
    size: "lg" as const,
    layers: 4,
    depth: 5,
    intensity: "subtle" as const,
    enableRGBSplit: false,
    enableGlow: true,
    enableScanlines: false,
  },
  minimal: {
    size: "md" as const,
    layers: 3,
    depth: 3,
    intensity: "subtle" as const,
    enableRGBSplit: false,
    enableGlow: false,
    enableScanlines: false,
  },
};
