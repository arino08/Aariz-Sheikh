"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Matrix characters for spawn effect
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

// Sprite paths configuration
const SPRITES = {
  idle: [
    "/assets/sprites/idle/idle1.png",
    "/assets/sprites/idle/idle2.png",
    "/assets/sprites/idle/idle3.png",
    "/assets/sprites/idle/idle4.png",
  ],
  wave: [
    "/assets/sprites/wave/wave1.png",
    "/assets/sprites/wave/wave2.png",
    "/assets/sprites/wave/wave3.png",
    "/assets/sprites/wave/wave4.png",
  ],
  point: [
    "/assets/sprites/point/point1.png",
    "/assets/sprites/point/point2.png",
    "/assets/sprites/point/pont3.png", // Note: typo in filename
  ],
  excited: [
    "/assets/sprites/excited/excited1.png",
    "/assets/sprites/excited/excited2.png",
  ],
  think: ["/assets/sprites/think/think.png"],
  smug: ["/assets/sprites/smug/smug.png"],
};

type SpriteAnimation = keyof typeof SPRITES;

// Section-specific messages and animations
const SECTION_CONFIG: Record<
  string,
  { messages: string[]; animation: SpriteAnimation }
> = {
  hero: {
    messages: [
      "Hey there! Welcome!",
      "I'm your guide today!",
      "Scroll down to explore!",
      "Use Ctrl+Space for commands!",
    ],
    animation: "wave",
  },
  about: {
    messages: [
      "This is me!",
      "I'm Aariz - a developer!",
      "I love building cool stuff!",
      "Rust is my jam!",
    ],
    animation: "think",
  },
  skills: {
    messages: [
      "Check out my skills!",
      "Always learning new things!",
      "Full-stack and beyond!",
      "Hover to see more!",
    ],
    animation: "point",
  },
  projects: {
    messages: [
      "My projects!",
      "Each one taught me something!",
      "Click for details!",
      "Pretty cool, right?",
    ],
    animation: "excited",
  },
  contact: {
    messages: [
      "Let's connect!",
      "Always open to chat!",
      "Drop me a message!",
      "Let's build together!",
    ],
    animation: "wave",
  },
};

// Hook to check performance settings
function usePerformanceSettings() {
  const [settings, setSettings] = useState({
    enableAnimations: true,
    enableGlow: true,
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
            enableGlow: parsed.enableGlow !== false,
          });
        }
      } catch {
        // Use defaults
      }
    };

    checkSettings();
    window.addEventListener("storage", checkSettings);
    return () => window.removeEventListener("storage", checkSettings);
  }, []);

  return settings;
}

interface SpriteGuideProps {
  enabled?: boolean;
  position?: "left" | "right";
  size?: number;
  onOpenCommandPalette?: () => void;
}

export default function SpriteGuide({
  enabled = true,
  position = "right",
  size = 120,
  onOpenCommandPalette,
}: SpriteGuideProps) {
  // Scroll progress state for pedestal
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPedestal, setShowPedestal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentAnimation, setCurrentAnimation] =
    useState<SpriteAnimation>("idle");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSpawning, setIsSpawning] = useState(true);
  const [spawnProgress, setSpawnProgress] = useState(0);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [isSmugActive, setIsSmugActive] = useState(false);
  const lastSectionChange = useRef<number>(Date.now());

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;
  const glowEnabled = performanceSettings.enableGlow;

  // Track tab visibility for pausing animations
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Check if mobile - debounced for performance
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const checkMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    setIsMobile(window.innerWidth < 768); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Track scroll progress for pedestal - throttled for performance
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThrottle = 100; // Only update every 100ms

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < scrollThrottle) return;
      lastScrollTime = now;

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      setShowPedestal(scrollTop > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Cursor blink - only when tab is visible
  useEffect(() => {
    if (!isTabVisible) return;
    const interval = setInterval(() => setCursorVisible((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, [isTabVisible]);

  // Matrix spawn effect - optimized with fewer updates
  useEffect(() => {
    if (!isSpawning || !animationsEnabled) {
      setIsSpawning(false);
      setSpawnProgress(100);
      return;
    }

    // Generate random matrix characters - reduced count for performance
    const generateMatrixChars = () => {
      const chars: string[] = [];
      for (let i = 0; i < 30; i++) {
        chars.push(
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
        );
      }
      return chars;
    };

    setMatrixChars(generateMatrixChars());

    // Animate spawn progress - slower updates for performance
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4; // Faster increments, fewer updates
      setSpawnProgress(progress);
      if (progress % 12 === 0) {
        setMatrixChars(generateMatrixChars()); // Update chars less frequently
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSpawning(false);
        }, 200);
      }
    }, 80); // Slower interval

    return () => clearInterval(interval);
  }, [isSpawning, animationsEnabled]);

  // Idle animation loop (subtle breathing effect) - paused when tab not visible
  useEffect(() => {
    if (
      !animationsEnabled ||
      isMinimized ||
      isPlayingAnimation ||
      isSpawning ||
      !isTabVisible
    )
      return;

    const frames = SPRITES.idle;
    let frameIndex = 0;
    let direction = 1;

    const interval = setInterval(() => {
      setCurrentFrame(frameIndex);
      frameIndex += direction;

      // Ping-pong through frames
      if (frameIndex >= frames.length - 1) direction = -1;
      if (frameIndex <= 0) direction = 1;
    }, 300); // Even slower idle animation for better performance

    return () => clearInterval(interval);
  }, [
    animationsEnabled,
    isMinimized,
    isPlayingAnimation,
    isSpawning,
    isTabVisible,
  ]);

  // Play specific animation when section changes
  const playAnimation = useCallback(
    (animation: SpriteAnimation) => {
      if (!animationsEnabled || isSpawning) {
        setCurrentFrame(0);
        return;
      }

      const frames = SPRITES[animation];
      if (frames.length === 1) {
        // Static frame
        setCurrentAnimation(animation);
        setCurrentFrame(0);
        setIsPlayingAnimation(true);

        // Return to idle after delay
        setTimeout(() => {
          setIsPlayingAnimation(false);
          setCurrentAnimation("idle");
        }, 4000);
        return;
      }

      setIsPlayingAnimation(true);
      setCurrentAnimation(animation);

      let frameIndex = 0;
      let loops = 0;
      const maxLoops = animation === "wave" ? 2 : 1;

      const interval = setInterval(() => {
        if (!isTabVisible) return; // Skip updates when tab not visible
        setCurrentFrame(frameIndex);
        frameIndex++;

        if (frameIndex >= frames.length) {
          frameIndex = 0;
          loops++;

          if (loops >= maxLoops) {
            clearInterval(interval);
            setIsPlayingAnimation(false);
            setCurrentAnimation("idle");
            setCurrentFrame(0);
          }
        }
      }, 200); // Slightly slower animation speed for performance

      return () => clearInterval(interval);
    },
    [animationsEnabled, isSpawning, isTabVisible],
  );

  // Typing effect for messages - optimized typing speed
  const typeMessage = useCallback(
    (message: string) => {
      if (!animationsEnabled || !isTabVisible) {
        setCurrentMessage(message);
        setIsTyping(false);
        return;
      }

      setIsTyping(true);
      setCurrentMessage("");

      let index = 0;
      const interval = setInterval(() => {
        if (!isTabVisible) {
          // Complete immediately if tab becomes hidden
          setCurrentMessage(message);
          clearInterval(interval);
          setIsTyping(false);
          return;
        }
        if (index < message.length) {
          setCurrentMessage(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 35); // Slightly slower typing for performance

      return () => clearInterval(interval);
    },
    [animationsEnabled, isTabVisible],
  );

  // Update message and animation when section changes
  useEffect(() => {
    if (isSpawning) return;

    const config = SECTION_CONFIG[currentSection];
    if (config) {
      playAnimation(config.animation);
      const msg = config.messages[messageIndex % config.messages.length];
      typeMessage(msg);
    }
  }, [currentSection, messageIndex, playAnimation, typeMessage, isSpawning]);

  // Cycle through messages - paused when tab not visible
  useEffect(() => {
    if (isMinimized || isSpawning || !isTabVisible) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => prev + 1);
    }, 10000); // Even slower message cycling for less updates

    return () => clearInterval(interval);
  }, [isMinimized, currentSection, isSpawning, isTabVisible]);

  // Set up scroll triggers for each section - with debounce for stability
  useEffect(() => {
    if (typeof window === "undefined" || !enabled) return;

    // Initial delay before showing
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    const sections = ["hero", "about", "skills", "projects", "contact"];

    // Debounced section change to prevent rapid switching
    const handleSectionChange = (section: string) => {
      const now = Date.now();
      // Only change section if at least 800ms has passed since last change
      if (now - lastSectionChange.current > 800) {
        lastSectionChange.current = now;
        setCurrentSection(section);
        setMessageIndex(0);
      }
    };

    const triggers = sections.map((section) => {
      const element = document.getElementById(section);
      if (!element) return null;

      return ScrollTrigger.create({
        trigger: element,
        start: "top 40%", // Trigger a bit later
        end: "bottom 40%",
        onEnter: () => handleSectionChange(section),
        onEnterBack: () => handleSectionChange(section),
      });
    });

    return () => {
      clearTimeout(showTimeout);
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, [enabled]);

  // GSAP entrance animation
  useEffect(() => {
    if (!isVisible || !containerRef.current || !animationsEnabled) return;

    // Skip animation if tab is not visible
    if (!isTabVisible) {
      gsap.set(containerRef.current, { opacity: 1, x: 0, scale: 1 });
      return;
    }

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        x: position === "right" ? 100 : -100,
        scale: 0.8,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
    );
  }, [isVisible, position, animationsEnabled]);

  // Handle minimize/maximize
  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // Handle next message
  const nextMessage = useCallback(() => {
    setMessageIndex((prev) => prev + 1);
    const config = SECTION_CONFIG[currentSection];
    if (config) {
      playAnimation(config.animation);
    }
  }, [currentSection, playAnimation]);

  // Handle sprite click - play smug animation then open command palette
  const handleSpriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // If already in smug mode or spawning, ignore
      if (isSmugActive || isSpawning) return;

      // Set smug animation
      setIsSmugActive(true);
      setCurrentAnimation("smug");
      setCurrentFrame(0);
      setIsPlayingAnimation(true);

      // After smug animation, open command palette
      setTimeout(() => {
        setIsSmugActive(false);
        setIsPlayingAnimation(false);
        setCurrentAnimation("idle");

        // Open command palette via Ctrl+Space event or callback
        if (onOpenCommandPalette) {
          onOpenCommandPalette();
        } else {
          // Dispatch keyboard event to trigger command bar
          const event = new KeyboardEvent("keydown", {
            key: " ",
            code: "Space",
            ctrlKey: true,
            metaKey: false,
            bubbles: true,
          });
          window.dispatchEvent(event);
        }
      }, 800); // Show smug for 800ms
    },
    [isSmugActive, isSpawning, onOpenCommandPalette],
  );

  if (!enabled || !isVisible) return null;

  // Get current sprite
  const currentSprites = SPRITES[currentAnimation];
  const currentSprite = currentSprites[currentFrame % currentSprites.length];

  const spriteSize = isMobile ? size * 0.7 : size;
  const pedestalWidth = spriteSize * 1.2;
  const pedestalHeight = 24;
  const progressStrokeWidth = 3;

  // Render matrix spawn effect
  const renderMatrixSpawn = () => {
    if (!isSpawning) return null;

    return (
      <div
        className="absolute inset-0 flex flex-wrap justify-center items-center overflow-hidden bg-[#0D1117]/90 rounded-lg z-10"
        style={{
          clipPath: `inset(${100 - spawnProgress}% 0 0 0)`,
        }}
      >
        <div className="font-mono text-[8px] text-[var(--terminal-green)] leading-none opacity-60 select-none">
          {matrixChars.map((char, i) => (
            <span
              key={i}
              style={{
                opacity: Math.random() * 0.8 + 0.2,
                textShadow: "0 0 5px rgba(0,255,136,0.5)",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`fixed z-40 transition-all duration-300 ${
        position === "right" ? "right-4" : "left-4"
      } bottom-4`}
      style={{ opacity: 0 }}
    >
      {/* Section indicator - shows current section above everything */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[var(--terminal-green)]/60 whitespace-nowrap bg-[#0D1117]/80 px-2 py-0.5 rounded border border-[var(--terminal-green)]/20">
        ⟨ {currentSection.toUpperCase()} ⟩
      </div>

      {/* Speech bubble - positioned to the side */}
      {currentMessage && (
        <div
          className={`absolute ${
            position === "right" ? "right-full mr-3" : "left-full ml-3"
          } bottom-16`}
        >
          <div
            className="relative bg-[#0D1117]/95 backdrop-blur-md border border-[var(--terminal-green)]/30 rounded-lg p-3 min-w-[160px] max-w-[200px]"
            style={{
              boxShadow: glowEnabled
                ? "0 0 10px rgba(0,255,136,0.1), inset 0 0 10px rgba(0,255,136,0.02)"
                : "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* Message */}
            <p className="font-mono text-xs text-[var(--terminal-green)]">
              {currentMessage}
              {isTyping && (
                <span
                  className="inline-block w-[2px] h-[1em] ml-0.5 align-middle"
                  style={{
                    backgroundColor: "var(--terminal-green)",
                    opacity: cursorVisible ? 1 : 0,
                    boxShadow: glowEnabled
                      ? "0 0 3px var(--terminal-green)"
                      : "none",
                  }}
                />
              )}
            </p>

            {/* Next message arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextMessage();
              }}
              className="absolute top-1/2 -translate-y-1/2 -right-6 text-[var(--terminal-green)]/40 hover:text-[var(--terminal-green)] transition-colors text-sm"
              title="Next message"
            >
              ›
            </button>

            {/* Speech bubble tail */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#0D1117] border-[var(--terminal-green)]/30 ${
                position === "right"
                  ? "right-[-7px] border-r border-t"
                  : "left-[-7px] border-l border-b"
              }`}
            />
          </div>
        </div>
      )}

      {/* Main wrapper - positions sprite on pedestal */}
      <div className="flex flex-col items-center">
        {/* Sprite container - click to open command palette */}
        <div
          className={`relative cursor-pointer transition-all duration-300 ${
            isSmugActive ? "scale-110" : "hover:scale-105"
          }`}
          onClick={handleSpriteClick}
          title={
            isMobile ? "Tap to open commands" : "Click to open command palette"
          }
          style={{
            width: spriteSize,
            height: spriteSize,
            marginBottom: showPedestal ? -16 : 0, // Overlap so feet touch pedestal
            zIndex: 10,
            filter: glowEnabled
              ? isSmugActive
                ? "drop-shadow(0 0 15px rgba(0,255,136,0.4))"
                : "drop-shadow(0 0 8px rgba(0,255,136,0.15))"
              : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          {/* Matrix spawn effect overlay */}
          {renderMatrixSpawn()}

          {/* Sprite image */}
          <Image
            src={currentSprite}
            alt="Guide avatar"
            fill
            className="object-contain transition-opacity duration-200"
            style={{
              imageRendering: "auto",
              transform: "scaleX(-1)",
              opacity: isSpawning ? spawnProgress / 100 : 1,
            }}
            priority
          />

          {/* Smug indicator when active */}
          {isSmugActive && (
            <div
              className="absolute top-1 right-1 font-mono text-sm"
              style={{
                textShadow: "0 0 8px rgba(0,255,136,0.8)",
              }}
            >
              😏
            </div>
          )}
        </div>

        {/* Pedestal / Scroll-to-top button - sprite stands on this */}
        {showPedestal && (
          <button
            onClick={scrollToTop}
            className="relative cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Scroll to top"
            title={`${Math.round(scrollProgress)}% - Click to scroll to top`}
            style={{ zIndex: 5 }}
          >
            {/* Pedestal SVG */}
            <svg
              width={pedestalWidth}
              height={pedestalHeight + 8}
              viewBox={`0 0 ${pedestalWidth} ${pedestalHeight + 8}`}
              className="overflow-visible"
            >
              {/* Pedestal base shape - trapezoid */}
              <defs>
                <linearGradient
                  id="pedestalGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#1a1f26" />
                  <stop offset="50%" stopColor="#0d1117" />
                  <stop offset="100%" stopColor="#060809" />
                </linearGradient>
                <filter id="pedestalGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background track */}
              <rect
                x={4}
                y={4}
                width={pedestalWidth - 8}
                height={pedestalHeight}
                rx={4}
                fill="url(#pedestalGradient)"
                stroke="rgba(107, 114, 128, 0.3)"
                strokeWidth={1}
              />

              {/* Progress fill */}
              <rect
                x={4}
                y={4}
                width={(pedestalWidth - 8) * (scrollProgress / 100)}
                height={pedestalHeight}
                rx={4}
                fill="var(--terminal-green)"
                opacity={0.2}
                className="transition-all duration-150"
              />

              {/* Top edge highlight */}
              <line
                x1={6}
                y1={5}
                x2={pedestalWidth - 6}
                y2={5}
                stroke="var(--terminal-green)"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.6}
                filter="url(#pedestalGlow)"
              />

              {/* Progress bar on top */}
              <line
                x1={6}
                y1={5}
                x2={6 + (pedestalWidth - 12) * (scrollProgress / 100)}
                y2={5}
                stroke="var(--terminal-green)"
                strokeWidth={2}
                strokeLinecap="round"
                className="transition-all duration-150"
                filter="url(#pedestalGlow)"
              />

              {/* Corner accents */}
              <path
                d={`M 2 8 L 2 4 L 6 4`}
                fill="none"
                stroke="var(--terminal-green)"
                strokeWidth={1.5}
                opacity={0.8}
              />
              <path
                d={`M ${pedestalWidth - 2} 8 L ${pedestalWidth - 2} 4 L ${pedestalWidth - 6} 4`}
                fill="none"
                stroke="var(--terminal-green)"
                strokeWidth={1.5}
                opacity={0.8}
              />
            </svg>

            {/* Up arrow / percentage indicator */}
            <div
              className="absolute inset-0 flex items-center justify-center font-mono text-[10px] transition-all duration-300"
              style={{
                color: "var(--terminal-green)",
                textShadow: glowEnabled
                  ? "0 0 8px var(--terminal-green)"
                  : "none",
              }}
            >
              <span className="group-hover:hidden">
                {Math.round(scrollProgress)}%
              </span>
              <span className="hidden group-hover:inline">↑ TOP</span>
            </div>
          </button>
        )}

        {/* Hint text when no pedestal */}
        {!showPedestal && (
          <div className="font-mono text-[9px] text-gray-600 whitespace-nowrap text-center mt-2">
            {isMobile ? "Tap me!" : "Click or Ctrl+Space"}
          </div>
        )}
      </div>
    </div>
  );
}

// Export sprite configuration for use elsewhere
export { SPRITES, SECTION_CONFIG };
