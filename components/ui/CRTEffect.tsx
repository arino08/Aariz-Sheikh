"use client";

import { useEffect, useState } from "react";

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
      const savedSettings = localStorage.getItem("portfolio-performance-settings");
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

  if (!enabled || reducedMotion || performanceMode) {
    return null;
  }

  // Intensity multipliers
  const intensityValues = {
    subtle: { scanline: 0.03, glow: 0.15, flicker: 0.005, noise: 0.02 },
    medium: { scanline: 0.06, glow: 0.25, flicker: 0.01, noise: 0.04 },
    strong: { scanline: 0.1, glow: 0.4, flicker: 0.02, noise: 0.06 },
  };

  const values = intensityValues[intensity];

  return (
    <>
      {/* CRT Effect Layers */}
      <div
        className="crt-effect-container"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "hidden",
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
              animation: enableFlicker ? "scanlineMove 8s linear infinite" : "none",
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
                inset 0 0 ${60 * values.glow}px rgba(0, 255, 136, ${values.glow * 0.3}),
                inset 0 0 ${120 * values.glow}px rgba(0, 255, 136, ${values.glow * 0.15}),
                inset 0 0 ${200 * values.glow}px rgba(0, 212, 255, ${values.glow * 0.1})
              `,
              animation: enableFlicker ? "glowPulse 4s ease-in-out infinite" : "none",
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
        {enableNoise && (
          <div
            className="crt-noise"
            style={{
              position: "absolute",
              inset: 0,
              opacity: values.noise,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              animation: enableFlicker ? "noiseShift 0.2s steps(10) infinite" : "none",
            }}
          />
        )}

        {/* Flicker overlay */}
        {enableFlicker && (
          <div
            className="crt-flicker"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(18, 16, 16, 0)",
              animation: `flicker 0.15s infinite`,
              opacity: values.flicker * 10,
            }}
          />
        )}

        {/* Occasional screen glitch line */}
        {enableFlicker && intensity !== "subtle" && (
          <div
            className="crt-glitch-line"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background: "rgba(0, 255, 136, 0.3)",
              boxShadow: "0 0 10px rgba(0, 255, 136, 0.5)",
              animation: "glitchLine 8s linear infinite",
              opacity: 0,
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
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.95;
          }
        }

        @keyframes flicker {
          0% {
            opacity: 0.27861;
          }
          5% {
            opacity: 0.34769;
          }
          10% {
            opacity: 0.23604;
          }
          15% {
            opacity: 0.90626;
          }
          20% {
            opacity: 0.18128;
          }
          25% {
            opacity: 0.83891;
          }
          30% {
            opacity: 0.65583;
          }
          35% {
            opacity: 0.67807;
          }
          40% {
            opacity: 0.26559;
          }
          45% {
            opacity: 0.84693;
          }
          50% {
            opacity: 0.96019;
          }
          55% {
            opacity: 0.08594;
          }
          60% {
            opacity: 0.20313;
          }
          65% {
            opacity: 0.71988;
          }
          70% {
            opacity: 0.53455;
          }
          75% {
            opacity: 0.37288;
          }
          80% {
            opacity: 0.71428;
          }
          85% {
            opacity: 0.70419;
          }
          90% {
            opacity: 0.7003;
          }
          95% {
            opacity: 0.36108;
          }
          100% {
            opacity: 0.24387;
          }
        }

        @keyframes noiseShift {
          0% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-1%, -1%);
          }
          20% {
            transform: translate(1%, 1%);
          }
          30% {
            transform: translate(-1%, 1%);
          }
          40% {
            transform: translate(1%, -1%);
          }
          50% {
            transform: translate(-1%, 0);
          }
          60% {
            transform: translate(1%, 0);
          }
          70% {
            transform: translate(0, 1%);
          }
          80% {
            transform: translate(0, -1%);
          }
          90% {
            transform: translate(1%, 1%);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes glitchLine {
          0%, 94%, 100% {
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
  const [intensity, setIntensity] = useState<"subtle" | "medium" | "strong">("subtle");

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

  const updateSettings = (newEnabled: boolean, newIntensity: "subtle" | "medium" | "strong") => {
    setEnabled(newEnabled);
    setIntensity(newIntensity);
    try {
      localStorage.setItem(
        "crt-effect-settings",
        JSON.stringify({ enabled: newEnabled, intensity: newIntensity })
      );
    } catch {
      // Ignore
    }
  };

  return { enabled, intensity, setEnabled: (e: boolean) => updateSettings(e, intensity), setIntensity: (i: "subtle" | "medium" | "strong") => updateSettings(enabled, i) };
}
