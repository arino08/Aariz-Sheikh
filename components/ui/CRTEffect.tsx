"use client";

import { useEffect, useState, useRef } from "react";

interface CRTEffectProps {
  enabled?: boolean;
  intensity?: "subtle" | "medium" | "strong";
  enableScanlines?: boolean;
  enableGlow?: boolean;
  enableFlicker?: boolean;
  enableCurvature?: boolean;
  enableVignette?: boolean;
  enableNoise?: boolean;
}

export default function CRTEffect({
  enabled = true,
  intensity = "subtle",
  enableScanlines = true,
  enableGlow = true,
  enableFlicker = true,
  enableCurvature = false,
  enableVignette = true,
  enableNoise = true,
}: CRTEffectProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Check performance settings
    try {
      const savedSettings = localStorage.getItem(
        "portfolio-performance-settings",
      );
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.enableAnimations === false) {
          setPerformanceMode(true);
        }
      }
    } catch {
      // Ignore
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Pause animations when tab is not visible for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!enabled || reducedMotion || performanceMode) {
    return null;
  }

  // Intensity multipliers - reduced for better performance
  const intensityValues = {
    subtle: { scanline: 0.02, glow: 0.1, flicker: 0.003, noise: 0.015 },
    medium: { scanline: 0.04, glow: 0.18, flicker: 0.006, noise: 0.03 },
    strong: { scanline: 0.08, glow: 0.3, flicker: 0.012, noise: 0.05 },
  };

  const values = intensityValues[intensity];

  return (
    <>
      {/* CRT Effect Layers */}
      <div
        ref={containerRef}
        className="crt-effect-container"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "hidden",
          willChange: "auto",
          contain: "strict",
        }}
        aria-hidden="true"
      >
        {/* Scanlines */}
        {enableScanlines && (
          <div
            className="crt-scanlines"
            style={{
              position: "absolute",
              inset: 0,
              background: `repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, ${values.scanline}) 0px,
                rgba(0, 0, 0, ${values.scanline}) 1px,
                transparent 1px,
                transparent 2px
              )`,
              backgroundSize: "100% 2px",
              animation:
                enableFlicker && isVisible
                  ? "scanlineMove 12s linear infinite"
                  : "none",
              animationPlayState: isVisible ? "running" : "paused",
            }}
          />
        )}

        {/* RGB Sub-pixel effect (subtle) */}
        {enableScanlines && intensity !== "subtle" && (
          <div
            className="crt-rgb"
            style={{
              position: "absolute",
              inset: 0,
              background: `repeating-linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.02) 0px,
                rgba(0, 255, 0, 0.02) 1px,
                rgba(0, 0, 255, 0.02) 2px,
                transparent 3px
              )`,
              backgroundSize: "3px 100%",
              opacity: 0.5,
            }}
          />
        )}

        {/* Screen glow / bloom effect */}
        {enableGlow && (
          <div
            className="crt-glow"
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: `
                inset 0 0 ${40 * values.glow}px rgba(0, 255, 136, ${values.glow * 0.25}),
                inset 0 0 ${80 * values.glow}px rgba(0, 255, 136, ${values.glow * 0.1})
              `,
              animation:
                enableFlicker && isVisible
                  ? "glowPulse 6s ease-in-out infinite"
                  : "none",
              animationPlayState: isVisible ? "running" : "paused",
            }}
          />
        )}

        {/* Vignette effect */}
        {enableVignette && (
          <div
            className="crt-vignette"
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(
                ellipse at center,
                transparent 0%,
                transparent 50%,
                rgba(0, 0, 0, 0.15) 80%,
                rgba(0, 0, 0, 0.4) 100%
              )`,
            }}
          />
        )}

        {/* Screen curvature effect */}
        {enableCurvature && (
          <div
            className="crt-curvature"
            style={{
              position: "absolute",
              inset: "-5%",
              background: "transparent",
              borderRadius: "50% / 10%",
              boxShadow: `
                inset 0 0 100px rgba(0, 0, 0, 0.5),
                inset 0 0 200px rgba(0, 0, 0, 0.3)
              `,
            }}
          />
        )}

        {/* Static noise overlay */}
        {enableNoise && isVisible && (
          <div
            className="crt-noise"
            style={{
              position: "absolute",
              inset: 0,
              opacity: values.noise,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              animation: enableFlicker
                ? "noiseShift 0.5s steps(5) infinite"
                : "none",
              animationPlayState: isVisible ? "running" : "paused",
            }}
          />
        )}

        {/* Flicker overlay */}
        {enableFlicker && isVisible && (
          <div
            className="crt-flicker"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(18, 16, 16, 0)",
              animation: `flicker 0.3s infinite`,
              opacity: values.flicker * 8,
              animationPlayState: isVisible ? "running" : "paused",
            }}
          />
        )}

        {/* Occasional screen glitch line - only when visible and not subtle */}
        {enableFlicker && intensity !== "subtle" && isVisible && (
          <div
            className="crt-glitch-line"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background: "rgba(0, 255, 136, 0.3)",
              boxShadow: "0 0 8px rgba(0, 255, 136, 0.4)",
              animation: "glitchLine 12s linear infinite",
              opacity: 0,
              animationPlayState: isVisible ? "running" : "paused",
            }}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes scanlineMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.97;
          }
        }

        /* Simplified flicker animation for better performance */
        @keyframes flicker {
          0%,
          100% {
            opacity: 0.3;
          }
          25% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
          75% {
            opacity: 0.6;
          }
        }

        /* Simplified noise shift for better performance */
        @keyframes noiseShift {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-0.5%, -0.5%);
          }
        }

        @keyframes glitchLine {
          0%,
          94%,
          100% {
            opacity: 0;
            top: 0;
          }
          95% {
            opacity: 1;
            top: 10%;
          }
          96% {
            opacity: 1;
            top: 35%;
          }
          97% {
            opacity: 0;
            top: 60%;
          }
          98% {
            opacity: 1;
            top: 85%;
          }
          99% {
            opacity: 0;
            top: 100%;
          }
        }

        /* Global phosphor glow enhancement for terminal text */
        .crt-text-glow {
          text-shadow:
            0 0 2px rgba(0, 255, 136, 0.8),
            0 0 4px rgba(0, 255, 136, 0.6),
            0 0 8px rgba(0, 255, 136, 0.4),
            0 0 16px rgba(0, 255, 136, 0.2);
        }

        /* Chromatic aberration on hover */
        .crt-chromatic:hover {
          text-shadow:
            -1px 0 rgba(255, 0, 0, 0.3),
            1px 0 rgba(0, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}

// Export a hook to toggle CRT effects
export function useCRTEffect() {
  const [enabled, setEnabled] = useState(true);
  const [intensity, setIntensity] = useState<"subtle" | "medium" | "strong">(
    "subtle",
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("crt-effect-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setEnabled(parsed.enabled ?? true);
        setIntensity(parsed.intensity ?? "subtle");
      }
    } catch {
      // Ignore
    }
  }, []);

  const updateSettings = (
    newEnabled: boolean,
    newIntensity: "subtle" | "medium" | "strong",
  ) => {
    setEnabled(newEnabled);
    setIntensity(newIntensity);
    try {
      localStorage.setItem(
        "crt-effect-settings",
        JSON.stringify({ enabled: newEnabled, intensity: newIntensity }),
      );
    } catch {
      // Ignore
    }
  };

  return {
    enabled,
    intensity,
    setEnabled: (e: boolean) => updateSettings(e, intensity),
    setIntensity: (i: "subtle" | "medium" | "strong") =>
      updateSettings(enabled, i),
  };
}
