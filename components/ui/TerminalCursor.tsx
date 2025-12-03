"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type CursorMode = "default" | "pointer" | "text" | "link" | "button" | "hidden";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

export default function TerminalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const particleIdRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastParticleTime = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Theme color tracking for trail particles
  const themeColorRef = useRef({ r: 0, g: 255, b: 136 }); // Default green #00ff88

  // Helper function to parse hex color to RGB
  const hexToRgb = useCallback(
    (hex: string): { r: number; g: number; b: number } => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        return {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        };
      }
      return { r: 0, g: 255, b: 136 }; // Default green
    },
    [],
  );

  // Update theme color from CSS variable
  const updateThemeColor = useCallback(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    const themeColor = computedStyle
      .getPropertyValue("--terminal-green")
      .trim();
    if (themeColor) {
      themeColorRef.current = hexToRgb(themeColor);
    }
  }, [hexToRgb]);

  // Listen for theme changes
  useEffect(() => {
    updateThemeColor();

    // Create a MutationObserver to watch for style changes on the root element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          updateThemeColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Also listen for class changes that might affect theme
    window.addEventListener("themechange", updateThemeColor);

    // Poll for changes as a fallback (some theme changes might not trigger mutation)
    const intervalId = setInterval(updateThemeColor, 500);

    return () => {
      observer.disconnect();
      window.removeEventListener("themechange", updateThemeColor);
      clearInterval(intervalId);
    };
  }, [updateThemeColor]);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia("(pointer: coarse)").matches,
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // Hide default cursor globally (except for settings panel and modals)
  useEffect(() => {
    if (isTouchDevice) return;

    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
      /* Restore cursor for settings panel and modals */
      [data-cursor-restore],
      [data-cursor-restore] *,
      [role="dialog"],
      [role="dialog"] *,
      .cursor-auto,
      .cursor-auto * {
        cursor: auto !important;
      }
      [data-cursor-restore] button,
      [role="dialog"] button,
      .cursor-auto button {
        cursor: pointer !important;
      }
      [data-cursor-restore] input,
      [role="dialog"] input,
      .cursor-auto input {
        cursor: text !important;
      }
      [data-cursor-restore] input[type="range"],
      [role="dialog"] input[type="range"],
      .cursor-auto input[type="range"] {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById("custom-cursor-style");
      if (existingStyle) existingStyle.remove();
    };
  }, [isTouchDevice]);

  // Create pixelated particle with retro disintegration effect
  const createParticle = useCallback(
    (x: number, y: number, velocityMultiplier: number = 1) => {
      // Particles move outward from cursor in a dispersing pattern
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 3 + 1.5) * velocityMultiplier;

      // Pixel sizes: 2, 3, 4, or 5 (snapped to integers for pixelated look)
      const sizeOptions = [2, 3, 4, 5, 6];
      const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];

      const maxLife = Math.random() * 25 + 15; // 15-40 frames for faster decay

      particleIdRef.current++;

      return {
        id: particleIdRef.current,
        x: Math.floor(x + (Math.random() - 0.5) * 8), // Snap to pixel grid
        y: Math.floor(y + (Math.random() - 0.5) * 8),
        size,
        opacity: 0.9 + Math.random() * 0.1,
        velocityX: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
        velocityY: Math.sin(angle) * speed * (0.8 + Math.random() * 0.4) + 0.3,
        rotation: Math.floor(Math.random() * 4) * 90, // Only 0, 90, 180, 270 for pixelated feel
        rotationSpeed: Math.floor(Math.random() * 3 - 1) * 5, // -5, 0, or 5
        life: maxLife,
        maxLife,
      };
    },
    [],
  );

  // Main animation loop
  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      const cursor = cursorRef.current;
      const glow = glowRef.current;

      // Smooth cursor interpolation
      positionRef.current.x +=
        (targetRef.current.x - positionRef.current.x) * 0.15;
      positionRef.current.y +=
        (targetRef.current.y - positionRef.current.y) * 0.15;

      if (cursor) {
        cursor.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
      }

      if (glow) {
        const glowX =
          positionRef.current.x +
          (targetRef.current.x - positionRef.current.x) * 0.3;
        const glowY =
          positionRef.current.y +
          (targetRef.current.y - positionRef.current.y) * 0.3;
        glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      }

      // Calculate movement for particle spawning
      const dx = positionRef.current.x - lastPosition.current.x;
      const dy = positionRef.current.y - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Spawn particles based on movement
      const now = Date.now();
      if (distance > 3 && now - lastParticleTime.current > 18) {
        // Spawn 2-4 particles for subtle trail
        const particleCount = Math.min(Math.floor(distance / 3) + 1, 4);
        for (let i = 0; i < particleCount; i++) {
          // Spawn particles slightly behind cursor for trailing effect
          const trailOffset = i * 0.15;
          const spawnX = positionRef.current.x - dx * trailOffset;
          const spawnY = positionRef.current.y - dy * trailOffset;
          particlesRef.current.push(
            createParticle(spawnX, spawnY, distance * 0.08),
          );
        }
        lastParticleTime.current = now;
      }

      lastPosition.current = { ...positionRef.current };

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles with pixelated disintegration
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update particle physics
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityX *= 0.96; // More friction for floaty feel
        particle.velocityY *= 0.96;
        particle.velocityY += 0.08; // Slightly stronger gravity
        particle.rotation += particle.rotationSpeed;
        particle.life -= 1;

        // Calculate life ratio for fading
        const lifeRatio = particle.life / particle.maxLife;

        // Stepped opacity for retro feel (not smooth fade)
        const opacitySteps = [1, 0.8, 0.6, 0.4, 0.2, 0];
        const opacityIndex = Math.floor(
          (1 - lifeRatio) * (opacitySteps.length - 1),
        );
        particle.opacity =
          opacitySteps[Math.min(opacityIndex, opacitySteps.length - 1)];

        // Size decreases in steps (pixelated shrinking)
        const sizeSteps = [1, 0.8, 0.6, 0.4, 0.2];
        const sizeIndex = Math.floor((1 - lifeRatio) * (sizeSteps.length - 1));
        const sizeMultiplier =
          sizeSteps[Math.min(sizeIndex, sizeSteps.length - 1)];
        const currentSize = Math.max(
          1,
          Math.floor(particle.size * sizeMultiplier),
        );

        if (particle.life <= 0 || particle.opacity <= 0) {
          return false;
        }

        // Snap position to pixel grid for retro effect
        const pixelX = Math.floor(particle.x);
        const pixelY = Math.floor(particle.y);

        ctx.save();
        ctx.imageSmoothingEnabled = false; // Crisp pixels

        // Draw main pixel square - use theme color
        const { r: baseR, g: baseG, b: baseB } = themeColorRef.current;
        // Interpolate color intensity based on particle life
        const r = Math.floor(baseR * (0.5 + 0.5 * lifeRatio));
        const g = Math.floor(baseG * (0.5 + 0.5 * lifeRatio));
        const b = Math.floor(baseB * (0.5 + 0.5 * lifeRatio));
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;

        // Main pixel block
        ctx.fillRect(pixelX, pixelY, currentSize, currentSize);

        // Add scanline effect on larger particles
        if (currentSize >= 3 && lifeRatio > 0.3) {
          ctx.fillStyle = `rgba(0, 0, 0, 0.3)`;
          for (let line = 0; line < currentSize; line += 2) {
            ctx.fillRect(pixelX, pixelY + line, currentSize, 1);
          }
        }

        // Glow effect (subtle) - use theme color
        ctx.shadowColor = `rgba(${baseR}, ${baseG}, ${baseB}, ${particle.opacity * 0.4})`;
        ctx.shadowBlur = currentSize + 2;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.3})`;
        ctx.fillRect(pixelX - 1, pixelY - 1, currentSize + 2, currentSize + 2);

        // Add "breaking apart" sub-pixels around dying particles
        if (lifeRatio < 0.5 && currentSize > 2) {
          const subPixelCount = Math.floor((1 - lifeRatio) * 4);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.5})`;
          for (let i = 0; i < subPixelCount; i++) {
            const offsetX = Math.floor((Math.random() - 0.5) * 6);
            const offsetY = Math.floor((Math.random() - 0.5) * 6);
            ctx.fillRect(pixelX + offsetX, pixelY + offsetY, 1, 1);
          }
        }

        // Bright core on newer particles - blend with white for brightness
        if (lifeRatio > 0.7) {
          const coreR = Math.min(255, baseR + 100);
          const coreG = Math.min(255, baseG + 50);
          const coreB = Math.min(255, baseB + 64);
          ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${particle.opacity * 0.6})`;
          const coreSize = Math.max(1, Math.floor(currentSize * 0.4));
          ctx.fillRect(
            pixelX + Math.floor((currentSize - coreSize) / 2),
            pixelY + Math.floor((currentSize - coreSize) / 2),
            coreSize,
            coreSize,
          );
        }

        ctx.restore();

        return true;
      });

      // Limit particles
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isTouchDevice, createParticle]);

  // Mouse event handlers
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.closest('button, [role="button"], [data-magnetic]') ||
        target.tagName === "BUTTON"
      ) {
        setCursorMode("button");
      } else if (target.closest("a") || target.closest("[data-link]")) {
        setCursorMode("link");
      } else if (
        target.closest(
          'input, textarea, [contenteditable="true"], [data-text]',
        ) ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        setCursorMode("text");
      } else if (target.closest("[data-cursor-hidden]")) {
        setCursorMode("hidden");
      } else if (
        target.closest("[data-pointer], [onclick], [data-command], select") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setCursorMode("pointer");
      } else {
        setCursorMode("default");
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);

      // Burst of particles on click - explosion effect
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push(
          createParticle(
            targetRef.current.x,
            targetRef.current.y,
            2.5 + Math.random(),
          ),
        );
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );
    };
  }, [isTouchDevice, createParticle]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  const getCursorContent = () => {
    switch (cursorMode) {
      case "pointer":
        return "▶";
      case "text":
        return "│";
      case "link":
        return "◈";
      case "button":
        return "◉";
      case "hidden":
        return "";
      default:
        return "█";
    }
  };

  const getCursorSize = () => {
    switch (cursorMode) {
      case "button":
        return "text-2xl";
      case "link":
        return "text-xl";
      case "text":
        return "text-lg";
      case "pointer":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <>
      {/* Canvas for particle trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9996]"
        style={{ imageRendering: "pixelated" }}
        aria-hidden="true"
      />

      {/* Glow effect */}
      <div
        ref={glowRef}
        className={`fixed pointer-events-none z-[9998] transition-opacity duration-200 ${
          isVisible && cursorMode !== "hidden" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: 0,
          top: 0,
          width: "80px",
          height: "80px",
          marginLeft: "-40px",
          marginTop: "-40px",
          background: `radial-gradient(circle, color-mix(in srgb, var(--terminal-green) ${isClicking ? 35 : 20}%, transparent) 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
        aria-hidden="true"
      />

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] transition-opacity duration-150 ${
          isVisible && cursorMode !== "hidden" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: 0,
          top: 0,
          marginLeft: "-0.5em",
          marginTop: "-0.5em",
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      >
        {/* Glitch layers */}
        {isGlitching && (
          <>
            <span
              className={`absolute font-mono ${getCursorSize()} text-[var(--terminal-blue)]`}
              style={{
                transform: "translate(-3px, 2px)",
                opacity: 0.8,
                clipPath: "inset(0 0 50% 0)",
              }}
            >
              {getCursorContent()}
            </span>
            <span
              className={`absolute font-mono ${getCursorSize()} text-[var(--terminal-purple)]`}
              style={{
                transform: "translate(3px, -2px)",
                opacity: 0.8,
                clipPath: "inset(50% 0 0 0)",
              }}
            >
              {getCursorContent()}
            </span>
          </>
        )}

        {/* Main cursor character */}
        <span
          className={`font-mono ${getCursorSize()} transition-all duration-150 ${
            cursorMode === "default" ? "animate-cursor-blink" : ""
          }`}
          style={{
            color: "var(--terminal-green)",
            textShadow: `
              0 0 5px var(--terminal-green),
              0 0 10px var(--terminal-green),
              0 0 20px color-mix(in srgb, var(--terminal-green) 50%, transparent)
            `,
            display: "inline-block",
            transform: `scale(${isClicking ? 0.7 : 1}) ${cursorMode === "pointer" ? "rotate(-45deg)" : ""}`,
            transition: "transform 0.1s ease-out",
            imageRendering: "pixelated",
          }}
        >
          {getCursorContent()}
        </span>

        {/* Pixelated ring for button/link modes */}
        {(cursorMode === "button" || cursorMode === "link") && (
          <div
            className="absolute"
            style={{
              width: cursorMode === "button" ? "50px" : "40px",
              height: cursorMode === "button" ? "50px" : "40px",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
              border: "2px solid var(--terminal-green)",
              opacity: 0.5,
              boxShadow:
                "0 0 15px color-mix(in srgb, var(--terminal-green) 30%, transparent)",
              transition: "all 0.2s ease-out",
              animation: "cursorRingPulse 2s ease-in-out infinite",
              imageRendering: "pixelated",
            }}
          />
        )}

        {/* Scan line effect for text mode */}
        {cursorMode === "text" && (
          <div
            className="absolute w-4 h-6 overflow-hidden"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="absolute w-full h-[2px] bg-[var(--terminal-green)]/30"
              style={{
                animation: "cursorScan 1s linear infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* Cursor-specific animations */}
      <style jsx global>{`
        @keyframes cursorRingPulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.3;
          }
        }

        @keyframes cursorScan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }

        @keyframes cursor-blink-custom {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        .animate-cursor-blink {
          animation: cursor-blink-custom 1s step-end infinite;
        }
      `}</style>
    </>
  );
}
