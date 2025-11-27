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
}

export default function SpriteGuide({
  enabled = true,
  position = "right",
  size = 120,
}: SpriteGuideProps) {
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
  const lastSectionChange = useRef<number>(Date.now());

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;
  const glowEnabled = performanceSettings.enableGlow;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  // Matrix spawn effect
  useEffect(() => {
    if (!isSpawning || !animationsEnabled) {
      setIsSpawning(false);
      setSpawnProgress(100);
      return;
    }

    // Generate random matrix characters
    const generateMatrixChars = () => {
      const chars: string[] = [];
      for (let i = 0; i < 50; i++) {
        chars.push(
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
        );
      }
      return chars;
    };

    setMatrixChars(generateMatrixChars());

    // Animate spawn progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setSpawnProgress(progress);
      setMatrixChars(generateMatrixChars());

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSpawning(false);
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isSpawning, animationsEnabled]);

  // Idle animation loop (subtle breathing effect) - more stable
  useEffect(() => {
    if (!animationsEnabled || isMinimized || isPlayingAnimation || isSpawning)
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
    }, 400); // Slower idle animation for stability

    return () => clearInterval(interval);
  }, [animationsEnabled, isMinimized, isPlayingAnimation, isSpawning]);

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
      }, 180); // Slightly slower animation speed

      return () => clearInterval(interval);
    },
    [animationsEnabled, isSpawning],
  );

  // Typing effect for messages
  const typeMessage = useCallback(
    (message: string) => {
      if (!animationsEnabled) {
        setCurrentMessage(message);
        return;
      }

      setIsTyping(true);
      setCurrentMessage("");

      let index = 0;
      const interval = setInterval(() => {
        if (index < message.length) {
          setCurrentMessage(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);

      return () => clearInterval(interval);
    },
    [animationsEnabled],
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

  // Cycle through messages - slower
  useEffect(() => {
    if (isMinimized || isSpawning) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => prev + 1);
    }, 8000); // Slower message cycling

    return () => clearInterval(interval);
  }, [isMinimized, currentSection, isSpawning]);

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

  if (!enabled || !isVisible) return null;

  // Get current sprite
  const currentSprites = SPRITES[currentAnimation];
  const currentSprite = currentSprites[currentFrame % currentSprites.length];

  const spriteSize = isMobile ? size * 0.7 : size;

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
      } ${isMobile ? "bottom-20" : "bottom-24"}`}
      style={{ opacity: 0 }}
    >
      {/* Main container */}
      <div
        className={`relative ${isMinimized ? "cursor-pointer" : ""}`}
        onClick={isMinimized ? toggleMinimize : undefined}
      >
        {/* Speech bubble - only show when not minimized */}
        {!isMinimized && (
          <div
            className={`absolute ${
              position === "right" ? "right-full mr-3" : "left-full ml-3"
            } bottom-1/2 translate-y-1/2`}
          >
            <div
              className="relative bg-[#0D1117]/95 backdrop-blur-md border border-[var(--terminal-green)]/30 rounded-lg p-3 min-w-[180px] max-w-[220px] md:max-w-[260px]"
              style={{
                boxShadow: glowEnabled
                  ? "0 0 10px rgba(0,255,136,0.1), inset 0 0 10px rgba(0,255,136,0.02)"
                  : "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              {/* Message */}
              <p className="font-mono text-xs md:text-sm text-[var(--terminal-green)]">
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

              {/* Next message button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextMessage();
                }}
                className="absolute -bottom-2 right-2 font-mono text-[10px] text-[var(--terminal-green)]/60 hover:text-[var(--terminal-green)] transition-colors"
              >
                [next →]
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

        {/* Sprite container */}
        <div
          className={`relative overflow-hidden cursor-pointer transition-all duration-500 ${
            isMinimized ? "opacity-60 hover:opacity-100" : ""
          }`}
          onClick={!isMinimized ? toggleMinimize : undefined}
          style={{
            width: isMinimized ? spriteSize * 0.5 : spriteSize,
            height: isMinimized ? spriteSize * 0.5 : spriteSize,
            filter: glowEnabled
              ? "drop-shadow(0 0 8px rgba(0,255,136,0.15))"
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

          {/* Minimize/maximize indicator */}
          <div
            className="absolute bottom-1 right-1 font-mono text-[8px] text-[var(--terminal-green)]/60 bg-[#0D1117]/80 px-1 rounded"
            style={{
              textShadow: glowEnabled ? "0 0 3px rgba(0,255,136,0.3)" : "none",
            }}
          >
            {isMinimized ? "[+]" : "[−]"}
          </div>
        </div>

        {/* Section indicator */}
        {!isMinimized && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[var(--terminal-green)]/60 whitespace-nowrap bg-[#0D1117]/80 px-2 py-0.5 rounded">
            ⟨ {currentSection.toUpperCase()} ⟩
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!isMinimized && !isMobile && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-gray-600 whitespace-nowrap">
          Press G to toggle guide
        </div>
      )}
    </div>
  );
}

// Export sprite configuration for use elsewhere
export { SPRITES, SECTION_CONFIG };
