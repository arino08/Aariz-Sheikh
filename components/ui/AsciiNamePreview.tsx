"use client";

import { useState } from "react";
import AsciiName, {
  ASCII_STYLE_OPTIONS,
  ANIMATION_OPTIONS,
  AsciiStyle,
  AnimationType,
} from "./AsciiName";

interface AsciiNamePreviewProps {
  onSelect?: (style: AsciiStyle, animation: AnimationType) => void;
}

export default function AsciiNamePreview({ onSelect }: AsciiNamePreviewProps) {
  const [selectedStyle, setSelectedStyle] = useState<AsciiStyle>("block");
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationType>("glitch");
  const [previewKey, setPreviewKey] = useState(0);
  const [enableGlow, setEnableGlow] = useState(true);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");

  const replayAnimation = () => {
    setPreviewKey((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#0D1117] border border-gray-800 rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-mono text-xl text-[var(--terminal-green)] mb-2">
          ASCII Name Preview
        </h2>
        <p className="font-mono text-sm text-gray-500">
          Choose your style and animation
        </p>
      </div>

      {/* Preview Area */}
      <div className="relative bg-[#161B22] border border-gray-800 rounded-lg p-8 mb-8 min-h-[200px] flex items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        <AsciiName
          key={previewKey}
          style={selectedStyle}
          animation={selectedAnimation}
          enableGlow={enableGlow}
          speed={speed}
          delay={100}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Style Selection */}
        <div>
          <label className="block font-mono text-sm text-gray-400 mb-3">
            ASCII Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ASCII_STYLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedStyle(option.value);
                  replayAnimation();
                }}
                className={`px-3 py-2 font-mono text-xs rounded border transition-all ${
                  selectedStyle === option.value
                    ? "border-[var(--terminal-green)] bg-[var(--terminal-green)]/10 text-[var(--terminal-green)]"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Selection */}
        <div>
          <label className="block font-mono text-sm text-gray-400 mb-3">
            Animation
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ANIMATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedAnimation(option.value);
                  replayAnimation();
                }}
                className={`px-3 py-2 font-mono text-xs rounded border transition-all text-left ${
                  selectedAnimation === option.value
                    ? "border-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10 text-[var(--terminal-purple)]"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
                title={option.description}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-gray-800 pt-6">
        <div className="flex gap-4">
          {/* Glow Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableGlow}
              onChange={(e) => setEnableGlow(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors ${
                enableGlow ? "bg-[var(--terminal-green)]" : "bg-gray-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transform transition-transform mt-0.5 ${
                  enableGlow ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="font-mono text-xs text-gray-400">Glow</span>
          </label>

          {/* Speed Selection */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-400">Speed:</span>
            {(["slow", "normal", "fast"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s);
                  replayAnimation();
                }}
                className={`px-2 py-1 font-mono text-xs rounded ${
                  speed === s
                    ? "bg-[var(--terminal-blue)] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {/* Replay Button */}
          <button
            onClick={replayAnimation}
            className="px-4 py-2 font-mono text-sm border border-gray-700 rounded hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)] transition-colors"
          >
            ↻ Replay
          </button>

          {/* Select Button */}
          {onSelect && (
            <button
              onClick={() => onSelect(selectedStyle, selectedAnimation)}
              className="px-4 py-2 font-mono text-sm bg-[var(--terminal-green)] text-black rounded hover:bg-[var(--terminal-green)]/90 transition-colors"
            >
              Use This Style
            </button>
          )}
        </div>
      </div>

      {/* Animation Description */}
      <div className="mt-4 p-3 bg-[#161B22] rounded border border-gray-800">
        <p className="font-mono text-xs text-gray-500">
          <span className="text-[var(--terminal-purple)]">
            {ANIMATION_OPTIONS.find((a) => a.value === selectedAnimation)?.label}
          </span>
          :{" "}
          {
            ANIMATION_OPTIONS.find((a) => a.value === selectedAnimation)
              ?.description
          }
        </p>
      </div>

      {/* Recommendations */}
      <div className="mt-6 border-t border-gray-800 pt-6">
        <h3 className="font-mono text-sm text-[var(--terminal-orange)] mb-3">
          ✨ Awwwards-level Recommendations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setSelectedStyle("block");
              setSelectedAnimation("glitch");
              setSpeed("normal");
              replayAnimation();
            }}
            className="p-3 bg-[#161B22] rounded border border-gray-800 hover:border-[var(--terminal-green)] transition-colors text-left"
          >
            <div className="font-mono text-xs text-[var(--terminal-green)] mb-1">
              Cyberpunk
            </div>
            <div className="font-mono text-[10px] text-gray-500">
              Block + Glitch
            </div>
          </button>
          <button
            onClick={() => {
              setSelectedStyle("dos");
              setSelectedAnimation("terminal");
              setSpeed("fast");
              replayAnimation();
            }}
            className="p-3 bg-[#161B22] rounded border border-gray-800 hover:border-[var(--terminal-green)] transition-colors text-left"
          >
            <div className="font-mono text-xs text-[var(--terminal-green)] mb-1">
              Retro Terminal
            </div>
            <div className="font-mono text-[10px] text-gray-500">
              DOS + Terminal Boot
            </div>
          </button>
          <button
            onClick={() => {
              setSelectedStyle("neon");
              setSelectedAnimation("matrix");
              setSpeed("normal");
              replayAnimation();
            }}
            className="p-3 bg-[#161B22] rounded border border-gray-800 hover:border-[var(--terminal-green)] transition-colors text-left"
          >
            <div className="font-mono text-xs text-[var(--terminal-green)] mb-1">
              Matrix Hacker
            </div>
            <div className="font-mono text-[10px] text-gray-500">
              Neon + Matrix Rain
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
