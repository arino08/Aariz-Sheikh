"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";

// ASCII Art variations for "AARIZ"
const ASCII_STYLES = {
  // Style 1: Block letters
  block: [
    "  █████╗  █████╗ ██████╗ ██╗███████╗",
    " ██╔══██╗██╔══██╗██╔══██╗██║╚══███╔╝",
    " ███████║███████║██████╔╝██║  ███╔╝ ",
    " ██╔══██║██╔══██║██╔══██╗██║ ███╔╝  ",
    " ██║  ██║██║  ██║██║  ██║██║███████╗",
    " ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝",
  ],

  // Style 2: Slant
  slant: [
    "    ___    ___    ____  ____ _____",
    "   /   |  /   |  / __ \\/  _/__  /",
    "  / /| | / /| | / /_/ // /   / / ",
    " / ___ |/ ___ |/ _, _// /   / /__",
    "/_/  |_/_/  |_/_/ |_/___/  /____/",
  ],

  // Style 3: Cyberpunk/Glitch style
  cyber: [
    "╔═╗╔═╗╦═╗╦╔═╗",
    "╠═╣╠═╣╠╦╝║╔═╝",
    "╩ ╩╩ ╩╩╚═╩╚═╝",
  ],

  // Style 4: Banner
  banner: [
    " █████  █████  ██████  ██ ███████ ",
    "██   ██ ██   ██ ██   ██ ██    ███  ",
    "███████ ███████ ██████  ██   ███   ",
    "██   ██ ██   ██ ██   ██ ██  ███    ",
    "██   ██ ██   ██ ██   ██ ██ ███████ ",
  ],

  // Style 5: Minimal/Clean
  minimal: [
    "┌─┐┌─┐┬─┐┬┌─┐",
    "├─┤├─┤├┬┘│┌─┘",
    "┴ ┴┴ ┴┴└─┴└─┘",
  ],

  // Style 6: DOS/Retro
  dos: [
    "  ▄▄▄       ▄▄▄       ██▀███   ██▓▒███████▒",
    " ▒████▄    ▒████▄    ▓██ ▒ ██▒▓██▒▒ ▒ ▒ ▄▀░",
    " ▒██  ▀█▄  ▒██  ▀█▄  ▓██ ░▄█ ▒▒██▒░ ▒ ▄▀▒░ ",
    " ░██▄▄▄▄██ ░██▄▄▄▄██ ▒██▀▀█▄  ░██░  ▄▀▒   ░",
    "  ▓█   ▓██▒ ▓█   ▓██▒░██▓ ▒██▒░██░▒███████▒",
    "  ▒▒   ▓▒█░ ▒▒   ▓▒█░░ ▒▓ ░▒▓░░▓  ░▒▒ ▓░▒░▒",
  ],

  // Style 7: Outline
  outline: [
    "╭━━━╮╭━━━╮╭━━━╮╭━━╮╭━━━━╮",
    "┃╭━╮┃┃╭━╮┃┃╭━╮┃╰┫┣╯┣━━━━╯",
    "┃┃ ┃┃┃┃ ┃┃┃╰━╯┃ ┃┃  ╭━━╯ ",
    "┃╰━╯┃┃╰━╯┃┃╭╮╭╯ ┃┃ ╭╯╭━━╮",
    "┃╭━╮┃┃╭━╮┃┃┃┃╰╮╭┫┣╮╰━╯━━┃",
    "╰╯ ╰╯╰╯ ╰╯╰╯╰━╯╰━━╯╰━━━━╯",
  ],

  // Style 8: Matrix/Hacker
  matrix: [
    "▄▀█ ▄▀█ █▀█ █ ▀█",
    "█▀█ █▀█ █▀▄ █ █▄",
  ],

  // Style 9: Big
  big: [
    "  ___   ___   ____  ___ _____",
    " / _ \\ / _ \\ |  _ \\|_ _|__  /",
    "| |_| | |_| || |_) || |  / / ",
    "|  _  |  _  ||  _ < | | / /_ ",
    "|_| |_|_| |_||_| \\_|___|/____|",
  ],

  // Style 10: Neon
  neon: [
    "░█▀▀█ ░█▀▀█ ░█▀▀█ ▀█▀ ░█▀▀▀█",
    "░█▄▄█ ░█▄▄█ ░█▄▄▀ ░█─ ─▄▄▄▀▀",
    "░█─░█ ░█─░█ ░█─░█ ▄█▄ ░█▄▄▄█",
  ],
};

type AsciiStyle = keyof typeof ASCII_STYLES;

// Animation types
type AnimationType =
  | "typewriter" // Classic typewriter effect
  | "glitch" // Glitch/corruption reveal
  | "matrix" // Matrix-style rain reveal
  | "scanline" // CRT scanline reveal
  | "decrypt" // Decryption/hack effect
  | "wave" // Wave animation
  | "pixelate" // Pixelate in
  | "terminal" // Terminal boot sequence
  | "cascade" // Cascade from top
  | "assemble"; // Characters fly in and assemble

interface AsciiNameProps {
  style?: AsciiStyle;
  animation?: AnimationType;
  className?: string;
  color?: string;
  glowColor?: string;
  enableGlow?: boolean;
  speed?: "slow" | "normal" | "fast";
  delay?: number;
  onComplete?: () => void;
}

// Hook to check if animations are enabled
function useAnimationsEnabled() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSettings = () => {
      try {
        const savedSettings = localStorage.getItem(
          "portfolio-performance-settings",
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setEnabled(parsed.enableAnimations !== false);
        }
      } catch {
        // Use default
      }
    };

    checkSettings();
  }, []);

  return enabled;
}

export default function AsciiName({
  style = "block",
  animation = "typewriter",
  className = "",
  color = "var(--terminal-green)",
  glowColor = "var(--terminal-green)",
  enableGlow = true,
  speed = "normal",
  delay = 0,
  onComplete,
}: AsciiNameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const animationsEnabled = useAnimationsEnabled();

  const asciiArt = useMemo(() => ASCII_STYLES[style], [style]);

  // Speed multipliers
  const speedMultiplier = useMemo(() => {
    switch (speed) {
      case "slow":
        return 1.5;
      case "fast":
        return 0.5;
      default:
        return 1;
    }
  }, [speed]);

  // Typewriter animation - character by character
  const animateTypewriter = () => {
    const lines = asciiArt;
    const totalChars = lines.reduce((acc, line) => acc + line.length, 0);
    let currentLine = 0;
    let currentChar = 0;
    const result: string[] = new Array(lines.length).fill("");

    setIsAnimating(true);

    const baseSpeed = 15 * speedMultiplier;

    const type = () => {
      if (currentLine >= lines.length) {
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      const line = lines[currentLine];
      if (currentChar < line.length) {
        result[currentLine] = line.slice(0, currentChar + 1);
        setDisplayLines([...result]);
        currentChar++;
        setTimeout(type, baseSpeed + Math.random() * 10);
      } else {
        currentLine++;
        currentChar = 0;
        setTimeout(type, baseSpeed * 2);
      }
    };

    setTimeout(type, delay);
  };

  // Glitch animation - corrupted reveal
  const animateGlitch = () => {
    const lines = asciiArt;
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`█▓▒░╔╗╚╝║═";
    let iteration = 0;
    const maxIterations = 20;
    const revealProgress = new Array(lines.length).fill(0);

    setIsAnimating(true);

    const baseSpeed = 80 * speedMultiplier;

    const glitch = () => {
      if (iteration >= maxIterations) {
        setDisplayLines([...lines]);
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      const result = lines.map((line, lineIndex) => {
        const progress = Math.min(1, (iteration / maxIterations) * 1.5);
        const revealedChars = Math.floor(line.length * progress);
        revealProgress[lineIndex] = revealedChars;

        return line
          .split("")
          .map((char, charIndex) => {
            if (charIndex < revealedChars) {
              // Revealed characters occasionally glitch
              if (Math.random() < 0.1) {
                return glitchChars[
                  Math.floor(Math.random() * glitchChars.length)
                ];
              }
              return char;
            } else if (charIndex < revealedChars + 5) {
              // Transition zone - heavy glitching
              return glitchChars[
                Math.floor(Math.random() * glitchChars.length)
              ];
            }
            return " ";
          })
          .join("");
      });

      setDisplayLines(result);
      iteration++;
      setTimeout(glitch, baseSpeed);
    };

    setTimeout(glitch, delay);
  };

  // Matrix rain reveal
  const animateMatrix = () => {
    const lines = asciiArt;
    const matrixChars =
      "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF";
    const columnStates = new Array(
      Math.max(...lines.map((l) => l.length)),
    ).fill(-5);

    setIsAnimating(true);

    const baseSpeed = 50 * speedMultiplier;

    const rain = () => {
      let allComplete = true;

      const result = lines.map((line, lineIndex) => {
        return line
          .split("")
          .map((char, charIndex) => {
            const columnProgress = columnStates[charIndex];

            if (lineIndex <= columnProgress) {
              return char;
            } else if (lineIndex <= columnProgress + 3) {
              allComplete = false;
              return matrixChars[
                Math.floor(Math.random() * matrixChars.length)
              ];
            }
            allComplete = false;
            return " ";
          })
          .join("");
      });

      // Advance columns
      columnStates.forEach((_, i) => {
        if (Math.random() < 0.3) {
          columnStates[i] += 1;
        }
      });

      setDisplayLines(result);

      if (allComplete && columnStates.every((c) => c >= lines.length)) {
        setDisplayLines([...lines]);
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
      } else {
        setTimeout(rain, baseSpeed);
      }
    };

    setTimeout(rain, delay);
  };

  // Scanline reveal - CRT style
  const animateScanline = () => {
    const lines = asciiArt;
    let currentLine = 0;

    setIsAnimating(true);

    const baseSpeed = 100 * speedMultiplier;

    const scan = () => {
      if (currentLine > lines.length) {
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      const result = lines.map((line, index) => {
        if (index < currentLine) {
          return line;
        } else if (index === currentLine) {
          // Current scanline - bright
          return line;
        }
        return "";
      });

      setDisplayLines(result);
      currentLine++;
      setTimeout(scan, baseSpeed);
    };

    setTimeout(scan, delay);
  };

  // Decrypt animation - hacking style
  const animateDecrypt = () => {
    const lines = asciiArt;
    const decryptChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    const revealed: boolean[][] = lines.map((line) =>
      new Array(line.length).fill(false),
    );
    let totalRevealed = 0;
    const totalChars = lines.reduce(
      (acc, line) => acc + line.replace(/\s/g, "").length,
      0,
    );

    setIsAnimating(true);

    const baseSpeed = 30 * speedMultiplier;

    const decrypt = () => {
      if (totalRevealed >= totalChars) {
        setDisplayLines([...lines]);
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      // Reveal random characters
      const revealCount = Math.ceil(totalChars / 15);
      for (let i = 0; i < revealCount && totalRevealed < totalChars; i++) {
        const lineIndex = Math.floor(Math.random() * lines.length);
        const charIndex = Math.floor(Math.random() * lines[lineIndex].length);
        if (
          !revealed[lineIndex][charIndex] &&
          lines[lineIndex][charIndex] !== " "
        ) {
          revealed[lineIndex][charIndex] = true;
          totalRevealed++;
        }
      }

      const result = lines.map((line, lineIndex) =>
        line
          .split("")
          .map((char, charIndex) => {
            if (char === " ") return " ";
            if (revealed[lineIndex][charIndex]) return char;
            return decryptChars[
              Math.floor(Math.random() * decryptChars.length)
            ];
          })
          .join(""),
      );

      setDisplayLines(result);
      setTimeout(decrypt, baseSpeed);
    };

    setTimeout(decrypt, delay);
  };

  // Wave animation
  const animateWave = () => {
    const lines = asciiArt;
    const maxWidth = Math.max(...lines.map((l) => l.length));
    let wavePosition = -10;

    setIsAnimating(true);

    const baseSpeed = 40 * speedMultiplier;

    const wave = () => {
      if (wavePosition > maxWidth + 10) {
        setDisplayLines([...lines]);
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      const result = lines.map((line, lineIndex) => {
        const offset = Math.sin(lineIndex * 0.5) * 3;
        const effectivePosition = wavePosition + offset;

        return line
          .split("")
          .map((char, charIndex) => {
            if (charIndex < effectivePosition) {
              return char;
            }
            return " ";
          })
          .join("");
      });

      setDisplayLines(result);
      wavePosition += 2;
      setTimeout(wave, baseSpeed);
    };

    setTimeout(wave, delay);
  };

  // Terminal boot sequence
  const animateTerminal = () => {
    const lines = asciiArt;
    const bootMessages = [
      "INITIALIZING SYSTEM...",
      "LOADING IDENTITY MODULE...",
      "DECRYPTING USER DATA...",
      "RENDERING ASCII...",
      "",
    ];

    let phase = 0;
    setIsAnimating(true);

    const baseSpeed = 300 * speedMultiplier;

    const boot = () => {
      if (phase < bootMessages.length) {
        setDisplayLines([bootMessages[phase]]);
        phase++;
        setTimeout(boot, baseSpeed);
      } else {
        // Now reveal the actual name with typewriter
        let currentLine = 0;
        const result: string[] = [];

        const revealLine = () => {
          if (currentLine >= lines.length) {
            setIsComplete(true);
            setIsAnimating(false);
            onComplete?.();
            return;
          }

          result.push(lines[currentLine]);
          setDisplayLines([...result]);
          currentLine++;
          setTimeout(revealLine, 80 * speedMultiplier);
        };

        revealLine();
      }
    };

    setTimeout(boot, delay);
  };

  // Cascade animation - fall from top
  const animateCascade = () => {
    const lines = asciiArt;
    const offsets = new Array(lines.length).fill(-lines.length);

    setIsAnimating(true);

    const baseSpeed = 50 * speedMultiplier;

    const cascade = () => {
      let allSettled = true;

      offsets.forEach((offset, index) => {
        if (offset < 0) {
          offsets[index] = Math.min(0, offset + 1);
          allSettled = false;
        }
      });

      const result = lines.map((line, index) => {
        if (offsets[index] >= 0) {
          return line;
        }
        return "";
      });

      setDisplayLines(result);

      // Stagger the start of each line
      if (offsets[0] > -lines.length + 2) {
        for (let i = 1; i < offsets.length; i++) {
          if (offsets[i] === -lines.length && offsets[i - 1] > -lines.length) {
            offsets[i]++;
          }
        }
      }

      if (allSettled) {
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
      } else {
        setTimeout(cascade, baseSpeed);
      }
    };

    setTimeout(cascade, delay);
  };

  // Assemble animation - characters fly in
  const animateAssemble = () => {
    const lines = asciiArt;
    const charPositions: {
      targetLine: number;
      targetChar: number;
      currentX: number;
      currentY: number;
      char: string;
    }[] = [];

    // Create position data for each character
    lines.forEach((line, lineIndex) => {
      line.split("").forEach((char, charIndex) => {
        if (char !== " ") {
          charPositions.push({
            targetLine: lineIndex,
            targetChar: charIndex,
            currentX: Math.random() * 80 - 40,
            currentY: Math.random() * 20 - 10,
            char,
          });
        }
      });
    });

    let progress = 0;
    setIsAnimating(true);

    const baseSpeed = 30 * speedMultiplier;

    const assemble = () => {
      if (progress >= 1) {
        setDisplayLines([...lines]);
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      // Ease function
      const ease = (t: number) => t * t * (3 - 2 * t);
      const easedProgress = ease(progress);

      // Build display with characters at interpolated positions
      const grid: string[][] = lines.map((line) =>
        new Array(line.length).fill(" "),
      );

      charPositions.forEach((pos) => {
        const x = Math.round(
          pos.currentX + (pos.targetChar - pos.currentX) * easedProgress,
        );
        const y = Math.round(
          pos.currentY + (pos.targetLine - pos.currentY) * easedProgress,
        );

        if (y >= 0 && y < lines.length && x >= 0 && x < lines[y].length) {
          grid[y][x] = pos.char;
        }
      });

      setDisplayLines(grid.map((row) => row.join("")));
      progress += 0.03;
      setTimeout(assemble, baseSpeed);
    };

    setTimeout(assemble, delay);
  };

  // Start animation based on type
  useEffect(() => {
    if (!animationsEnabled) {
      // Show immediately if animations disabled
      setDisplayLines([...asciiArt]);
      setIsComplete(true);
      return;
    }

    switch (animation) {
      case "typewriter":
        animateTypewriter();
        break;
      case "glitch":
        animateGlitch();
        break;
      case "matrix":
        animateMatrix();
        break;
      case "scanline":
        animateScanline();
        break;
      case "decrypt":
        animateDecrypt();
        break;
      case "wave":
        animateWave();
        break;
      case "terminal":
        animateTerminal();
        break;
      case "cascade":
        animateCascade();
        break;
      case "assemble":
        animateAssemble();
        break;
      default:
        animateTypewriter();
    }
  }, [animation, animationsEnabled, asciiArt]);

  // GSAP glow pulse effect
  useEffect(() => {
    if (!containerRef.current || !enableGlow || !isComplete) return;

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        "--glow-intensity": 1,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [enableGlow, isComplete]);

  return (
    <div
      ref={containerRef}
      className={`font-mono ${className}`}
      style={
        {
          "--glow-intensity": 0.5,
          color: color,
          textShadow: enableGlow
            ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}40, 0 0 30px ${glowColor}20`
            : "none",
          filter: enableGlow
            ? `drop-shadow(0 0 calc(5px * var(--glow-intensity)) ${glowColor})`
            : "none",
        } as React.CSSProperties
      }
    >
      <pre
        className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base leading-none whitespace-pre"
        style={{
          fontFamily: "monospace",
          letterSpacing: "0.05em",
        }}
      >
        {displayLines.map((line, index) => (
          <div
            key={index}
            className={`${isAnimating && animation === "scanline" && index === displayLines.filter((l) => l).length - 1 ? "animate-pulse" : ""}`}
          >
            {line || "\u00A0"}
          </div>
        ))}
      </pre>

      {/* Scanline effect overlay */}
      {isAnimating && animation === "scanline" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)`,
            backgroundSize: "100% 4px",
          }}
        />
      )}
    </div>
  );
}

// Export style and animation options for selection UI
export const ASCII_STYLE_OPTIONS: { value: AsciiStyle; label: string }[] = [
  { value: "block", label: "Block (Classic)" },
  { value: "slant", label: "Slant (Italic)" },
  { value: "cyber", label: "Cyber (Compact)" },
  { value: "banner", label: "Banner (Bold)" },
  { value: "minimal", label: "Minimal (Clean)" },
  { value: "dos", label: "DOS (Retro)" },
  { value: "outline", label: "Outline (Decorative)" },
  { value: "matrix", label: "Matrix (Compact)" },
  { value: "big", label: "Big (Standard)" },
  { value: "neon", label: "Neon (Modern)" },
];

export const ANIMATION_OPTIONS: { value: AnimationType; label: string; description: string }[] = [
  { value: "typewriter", label: "Typewriter", description: "Classic character-by-character reveal" },
  { value: "glitch", label: "Glitch", description: "Corrupted/cyberpunk style reveal" },
  { value: "matrix", label: "Matrix Rain", description: "Matrix-style cascading reveal" },
  { value: "scanline", label: "Scanline", description: "CRT monitor line-by-line reveal" },
  { value: "decrypt", label: "Decrypt", description: "Hacking/decryption random reveal" },
  { value: "wave", label: "Wave", description: "Smooth wave sweep reveal" },
  { value: "terminal", label: "Terminal Boot", description: "Boot sequence then reveal" },
  { value: "cascade", label: "Cascade", description: "Lines fall into place" },
  { value: "assemble", label: "Assemble", description: "Characters fly in and assemble" },
];

export { ASCII_STYLES };
export type { AsciiStyle, AnimationType };
