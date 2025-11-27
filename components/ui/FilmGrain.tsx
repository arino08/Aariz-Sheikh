"use client";

import { useEffect, useRef, useState } from "react";

interface FilmGrainProps {
  opacity?: number;
  blendMode?: "overlay" | "soft-light" | "multiply" | "screen";
  animated?: boolean;
  intensity?: "subtle" | "medium" | "strong";
  scanlines?: boolean;
  vignette?: boolean;
  respectReducedMotion?: boolean;
}

export default function FilmGrain({
  opacity = 0.05,
  blendMode = "overlay",
  animated = true,
  intensity = "subtle",
  scanlines = true,
  vignette = true,
  respectReducedMotion = true,
}: FilmGrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intensity settings
  const intensitySettings = {
    subtle: { grainSize: 1, noiseAmount: 25 },
    medium: { grainSize: 1.5, noiseAmount: 40 },
    strong: { grainSize: 2, noiseAmount: 60 },
  };

  const settings = intensitySettings[intensity];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate noise
    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * settings.noiseAmount;
        data[i] = noise; // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = 255; // A
      }

      ctx.putImageData(imageData, 0, 0);
    };

    // Initial render
    generateNoise();

    // Start animation if enabled
    if (animated && !(respectReducedMotion && prefersReducedMotion)) {
      // Throttle animation to ~15fps for performance
      const throttledAnimate = () => {
        generateNoise();
        animationRef.current = setTimeout(() => {
          requestAnimationFrame(throttledAnimate);
        }, 66) as unknown as number; // ~15fps
      };
      throttledAnimate();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        if (typeof animationRef.current === "number") {
          clearTimeout(animationRef.current);
          cancelAnimationFrame(animationRef.current);
        }
      }
    };
  }, [
    animated,
    settings.noiseAmount,
    prefersReducedMotion,
    respectReducedMotion,
  ]);

  // Don't render effects if user prefers reduced motion
  if (respectReducedMotion && prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    >
      {/* Film grain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity,
          mixBlendMode: blendMode,
        }}
      />

      {/* Scanlines overlay */}
      {scanlines && (
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            )`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vignette effect */}
      {vignette && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 0%,
              transparent 50%,
              rgba(0, 0, 0, 0.3) 100%
            )`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Subtle color aberration on edges */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: `
            linear-gradient(90deg,
              rgba(255, 0, 0, 0.1) 0%,
              transparent 5%,
              transparent 95%,
              rgba(0, 255, 255, 0.1) 100%
            )
          `,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// Lighter version for better performance
export function FilmGrainLite({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
}

// Static grain using CSS - most performant
export function StaticGrain({
  opacity = 0.04,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] ${className}`}
      aria-hidden="true"
    >
      {/* Noise texture using SVG filter */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity }}>
        <filter id="static-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#static-noise)" />
      </svg>

      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.02) 2px,
            rgba(0, 0, 0, 0.02) 4px
          )`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 60%,
            rgba(0, 0, 0, 0.25) 100%
          )`,
        }}
      />
    </div>
  );
}
