"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  usePerformance,
  PerformanceLevel,
  PerformanceSettings,
} from "./PerformanceProvider";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Setting toggle component
function SettingToggle({
  label,
  description,
  enabled,
  onChange,
  disabled = false,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 border-b border-gray-800/50 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1 pr-4">
        <div className="font-mono text-sm text-white">{label}</div>
        {description && (
          <div className="font-mono text-xs text-gray-500 mt-0.5">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`flex-shrink-0 rounded-full ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        style={{
          position: "relative",
          display: "inline-block",
          width: 28,
          height: 14,
          minHeight: 14,
          maxHeight: 14,
          minWidth: 28,
          backgroundColor: enabled ? "#00ff88" : "#374151",
          borderRadius: 9999,
        }}
        aria-checked={enabled}
        role="switch"
      >
        <span
          style={{
            position: "absolute",
            display: "block",
            width: 10,
            height: 10,
            top: 2,
            left: enabled ? 16 : 2,
            backgroundColor: "#fff",
            borderRadius: 9999,
            transition: "left 0.2s ease",
          }}
        />
      </button>
    </div>
  );
}

// Performance level selector
function PerformanceLevelSelector({
  currentLevel,
  onChange,
  disabled = false,
}: {
  currentLevel: PerformanceLevel;
  onChange: (level: PerformanceLevel) => void;
  disabled?: boolean;
}) {
  const levels: {
    value: PerformanceLevel;
    label: string;
    description: string;
  }[] = [
    { value: "high", label: "HIGH", description: "All effects enabled" },
    { value: "medium", label: "MED", description: "Reduced particles" },
    { value: "low", label: "LOW", description: "Minimal effects" },
    { value: "potato", label: "POTATO", description: "Static only" },
  ];

  return (
    <div className={`py-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="font-mono text-xs text-gray-500 mb-3">
        PERFORMANCE PRESET
      </div>
      <div className="grid grid-cols-4 gap-2">
        {levels.map(({ value, label, description }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            disabled={disabled}
            className={`relative p-2 rounded border transition-all duration-200 ${
              currentLevel === value
                ? "border-[var(--terminal-green)] bg-[var(--terminal-green)]/10"
                : "border-gray-700 hover:border-gray-600"
            } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div
              className={`font-mono text-xs font-bold ${
                currentLevel === value
                  ? "text-[var(--terminal-green)]"
                  : "text-gray-400"
              }`}
            >
              {label}
            </div>
            <div className="font-mono text-[10px] text-gray-500 mt-1 hidden sm:block">
              {description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Slider component
function SettingSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  suffix?: string;
}) {
  return (
    <div
      className={`py-3 border-b border-gray-800/50 ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-sm text-white">{label}</span>
        <span className="font-mono text-xs text-[var(--terminal-green)]">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[var(--terminal-green)]
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--terminal-green)]
          [&::-moz-range-thumb]:w-3
          [&::-moz-range-thumb]:h-3
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[var(--terminal-green)]
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  );
}

// FPS Monitor display
function FPSMonitor({ fps }: { fps: number }) {
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return "var(--terminal-green)";
    if (fps >= 30) return "var(--terminal-orange)";
    return "#ff4444";
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-800/50">
      <div className="flex-1">
        <div className="font-mono text-sm text-white">Current FPS</div>
        <div className="font-mono text-xs text-gray-500">
          Real-time performance
        </div>
      </div>
      <div
        className="font-mono text-2xl font-bold"
        style={{ color: getFPSColor(fps) }}
      >
        {fps}
      </div>
    </div>
  );
}

// Device info display
function DeviceInfo({ settings }: { settings: PerformanceSettings }) {
  return (
    <div className="py-3 border-b border-gray-800/50">
      <div className="font-mono text-xs text-gray-500 mb-2">DEVICE INFO</div>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="text-gray-400">
          Memory:{" "}
          <span className="text-white">
            {settings.deviceMemory || "N/A"} GB
          </span>
        </div>
        <div className="text-gray-400">
          Cores:{" "}
          <span className="text-white">{settings.hardwareConcurrency}</span>
        </div>
        <div className="text-gray-400">
          Mobile:{" "}
          <span className="text-white">{settings.isMobile ? "Yes" : "No"}</span>
        </div>
        <div className="text-gray-400">
          Reduced Motion:{" "}
          <span className="text-white">
            {settings.hasReducedMotion ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const {
    settings,
    currentFPS,
    isAutoMode,
    setPerformanceLevel,
    setAutoMode,
    toggleSetting,
    updateSetting,
    resetToDefaults,
  } = usePerformance();
  const [activeTab, setActiveTab] = useState<
    "performance" | "visual" | "about"
  >("performance");

  // Animation on open/close
  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return;

    if (isOpen) {
      // Open animation
      gsap.set(panelRef.current, { x: "100%" });
      gsap.set(backdropRef.current, { opacity: 0, display: "block" });

      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(panelRef.current, {
        x: "0%",
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      // Close animation
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(backdropRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    panel.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      panel.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] hidden cursor-auto"
        onClick={onClose}
        aria-hidden="true"
        data-cursor-restore="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0D1117] border-l border-gray-800 z-[10001] overflow-hidden flex flex-col cursor-auto"
        style={{ transform: "translateX(100%)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        data-cursor-restore="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-[var(--terminal-green)] text-xl">⚙</span>
            <h2 className="font-mono text-lg font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-800 transition-colors"
            aria-label="Close settings"
          >
            <span className="text-gray-400 text-xl">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {(["performance", "visual", "about"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "text-[var(--terminal-green)] border-b-2 border-[var(--terminal-green)]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "performance" && (
            <div className="space-y-1">
              {/* FPS Monitor */}
              <FPSMonitor fps={currentFPS} />

              {/* Device Info */}
              <DeviceInfo settings={settings} />

              {/* Auto Mode Toggle */}
              <SettingToggle
                label="Auto Performance"
                description="Automatically adjust settings based on FPS"
                enabled={isAutoMode}
                onChange={() => setAutoMode(!isAutoMode)}
              />

              {/* Performance Level */}
              <PerformanceLevelSelector
                currentLevel={settings.level}
                onChange={setPerformanceLevel}
                disabled={isAutoMode}
              />

              {/* Particle Count */}
              <SettingSlider
                label="Particle Count"
                value={settings.particleCount}
                min={0}
                max={2000}
                step={100}
                onChange={(value) => updateSetting("particleCount", value)}
                disabled={isAutoMode}
              />

              {/* Canvas Quality */}
              <SettingSlider
                label="Canvas Quality"
                value={Math.round(settings.canvasQuality * 100)}
                min={25}
                max={100}
                step={25}
                onChange={(value) =>
                  updateSetting("canvasQuality", value / 100)
                }
                disabled={isAutoMode}
                suffix="%"
              />

              {/* Reset Button */}
              <div className="pt-4">
                <button
                  onClick={resetToDefaults}
                  className="w-full py-2 px-4 font-mono text-sm border border-gray-700 rounded hover:border-[var(--terminal-orange)] hover:text-[var(--terminal-orange)] transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}

          {activeTab === "visual" && (
            <div className="space-y-1">
              <SettingToggle
                label="3D Canvas"
                description="Enable Three.js background effects"
                enabled={settings.enable3DCanvas}
                onChange={() => toggleSetting("enable3DCanvas")}
              />

              <SettingToggle
                label="Matrix Rain"
                description="Animated matrix rain particles"
                enabled={settings.enableMatrixRain}
                onChange={() => toggleSetting("enableMatrixRain")}
              />

              <SettingToggle
                label="Film Grain"
                description="CRT-style noise overlay"
                enabled={settings.enableGrain}
                onChange={() => toggleSetting("enableGrain")}
              />

              <SettingToggle
                label="Scanlines"
                description="Retro scanline effect"
                enabled={settings.enableScanlines}
                onChange={() => toggleSetting("enableScanlines")}
              />

              <SettingToggle
                label="Glow Effects"
                description="Neon glow on text and elements"
                enabled={settings.enableGlow}
                onChange={() => toggleSetting("enableGlow")}
              />

              <SettingToggle
                label="Parallax"
                description="Depth-based scroll effects"
                enabled={settings.enableParallax}
                onChange={() => toggleSetting("enableParallax")}
              />

              <SettingToggle
                label="Smooth Scroll"
                description="Lenis smooth scrolling"
                enabled={settings.enableSmoothScroll}
                onChange={() => toggleSetting("enableSmoothScroll")}
              />

              <SettingToggle
                label="Animations"
                description="General UI animations"
                enabled={settings.enableAnimations}
                onChange={() => toggleSetting("enableAnimations")}
              />

              <SettingToggle
                label="ASCII Animations"
                description="Animated ASCII dividers"
                enabled={settings.enableAsciiAnimations}
                onChange={() => toggleSetting("enableAsciiAnimations")}
              />

              <SettingToggle
                label="Floating Elements"
                description="Decorative floating items"
                enabled={settings.enableFloatingElements}
                onChange={() => toggleSetting("enableFloatingElements")}
              />
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-4 font-mono text-sm">
              <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
                <div className="text-[var(--terminal-green)] mb-2">
                  Performance Tips
                </div>
                <ul className="text-gray-400 space-y-2 text-xs">
                  <li>• Lower particle count for smoother scrolling</li>
                  <li>• Disable 3D canvas on mobile devices</li>
                  <li>• Turn off grain & scanlines on low-power mode</li>
                  <li>• Use {"'Potato'"} mode for maximum compatibility</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
                <div className="text-[var(--terminal-purple)] mb-2">
                  Keyboard Shortcuts
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">Settings</div>
                  <div className="text-white">Ctrl + ,</div>
                  <div className="text-gray-400">Command Bar</div>
                  <div className="text-white">Ctrl + Space</div>
                  <div className="text-gray-400">Toggle Sound</div>
                  <div className="text-white">Ctrl + M</div>
                </div>
              </div>

              <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
                <div className="text-[var(--terminal-blue)] mb-2">
                  Easter Eggs 🥚
                </div>
                <div className="text-gray-400 text-xs">
                  Try typing secret words or the Konami code...
                </div>
              </div>

              <div className="text-center text-gray-600 text-xs pt-4">
                Built with Next.js, Three.js, GSAP & ❤️
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div className="font-mono text-xs text-gray-500">
            Level:{" "}
            <span className="text-[var(--terminal-green)] uppercase">
              {settings.level}
            </span>
          </div>
          <div className="font-mono text-xs text-gray-500">
            <span
              className="inline-block w-2 h-2 rounded-full mr-1"
              style={{
                backgroundColor:
                  currentFPS >= 55
                    ? "var(--terminal-green)"
                    : currentFPS >= 30
                      ? "var(--terminal-orange)"
                      : "#ff4444",
              }}
            />
            {currentFPS} FPS
          </div>
        </div>
      </div>
    </>
  );
}

// Settings button component for easy inclusion
export function SettingsButton({ onClick }: { onClick: () => void }) {
  const { currentFPS, settings } = usePerformance();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 z-[9990] flex items-center gap-2 px-3 py-2 bg-[#161B22] border border-gray-800 rounded-lg hover:border-[var(--terminal-green)] transition-colors group"
      aria-label="Open settings"
    >
      <span className="text-gray-400 group-hover:text-[var(--terminal-green)] transition-colors">
        ⚙
      </span>
      <span className="font-mono text-xs text-gray-500 hidden sm:inline">
        {currentFPS} FPS
      </span>
      <span
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor:
            settings.level === "high"
              ? "var(--terminal-green)"
              : settings.level === "medium"
                ? "var(--terminal-blue)"
                : settings.level === "low"
                  ? "var(--terminal-orange)"
                  : "#ff4444",
        }}
      />
    </button>
  );
}
