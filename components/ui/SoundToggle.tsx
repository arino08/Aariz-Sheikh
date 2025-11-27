"use client";

import { useState, useEffect, useCallback } from "react";
import useTerminalSounds from "@/hooks/useTerminalSounds";

interface SoundToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SoundToggle({
  className = "",
  showLabel = true,
  size = "md",
}: SoundToggleProps) {
  const { isEnabled, toggle, playClick, playSuccess } = useTerminalSounds();
  const [isAnimating, setIsAnimating] = useState(false);

  // Keyboard shortcut: Ctrl+M to toggle sound
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggle = useCallback(() => {
    setIsAnimating(true);
    toggle();

    // Play sound after toggle (will only play if enabled)
    setTimeout(() => {
      if (!isEnabled) {
        playSuccess({ volume: 0.08 });
      }
    }, 50);

    setTimeout(() => setIsAnimating(false), 300);
  }, [toggle, isEnabled, playSuccess]);

  const handleClick = () => {
    playClick({ volume: 0.05 });
    handleToggle();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        className={`
          relative ${sizeClasses[size]} rounded-lg
          flex items-center justify-center
          font-mono transition-all duration-300
          border
          ${
            isEnabled
              ? "bg-[var(--terminal-green)]/10 border-[var(--terminal-green)]/50 text-[var(--terminal-green)]"
              : "bg-gray-800/50 border-gray-700 text-gray-500"
          }
          hover:border-[var(--terminal-green)] hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]
          active:scale-95
          ${isAnimating ? "scale-110" : ""}
        `}
        title={`${isEnabled ? "Disable" : "Enable"} sounds (Ctrl+M)`}
        aria-label={`${isEnabled ? "Disable" : "Enable"} terminal sounds`}
      >
        {/* Sound on icon */}
        {isEnabled ? (
          <svg
            className={`${iconSizes[size]} transition-transform ${isAnimating ? "scale-125" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        ) : (
          <svg
            className={`${iconSizes[size]} transition-transform ${isAnimating ? "scale-125" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        )}

        {/* Pulse effect when enabled */}
        {isEnabled && (
          <span
            className="absolute inset-0 rounded-lg border border-[var(--terminal-green)] opacity-50 animate-ping"
            style={{ animationDuration: "2s" }}
          />
        )}

        {/* Glitch effect on toggle */}
        {isAnimating && (
          <>
            <span
              className="absolute inset-0 rounded-lg bg-[var(--terminal-blue)] opacity-30"
              style={{ transform: "translate(-2px, 1px)" }}
            />
            <span
              className="absolute inset-0 rounded-lg bg-[var(--terminal-purple)] opacity-30"
              style={{ transform: "translate(2px, -1px)" }}
            />
          </>
        )}
      </button>

      {/* Label */}
      {showLabel && (
        <div className="flex flex-col">
          <span
            className={`font-mono text-xs ${isEnabled ? "text-[var(--terminal-green)]" : "text-gray-500"}`}
          >
            {isEnabled ? "Sound ON" : "Sound OFF"}
          </span>
          <span className="font-mono text-[10px] text-gray-600">Ctrl+M</span>
        </div>
      )}
    </div>
  );
}
