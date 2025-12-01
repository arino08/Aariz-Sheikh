"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
  useMemo,
} from "react";

// Performance levels
export type PerformanceLevel = "high" | "medium" | "low" | "potato";

// Performance settings interface
export interface PerformanceSettings {
  level: PerformanceLevel;
  // Visual effects
  enableParticles: boolean;
  particleCount: number;
  enableGrain: boolean;
  enableScanlines: boolean;
  enableGlow: boolean;
  enableParallax: boolean;
  enableSmoothScroll: boolean;
  // Animation settings
  enableAnimations: boolean;
  enableAsciiAnimations: boolean;
  enable3DCanvas: boolean;
  enableMatrixRain: boolean;
  enableFloatingElements: boolean;
  // Quality settings
  canvasQuality: number; // 0.5 - 1.0
  targetFPS: number;
  // Auto-detected flags
  isLowPowerMode: boolean;
  isMobile: boolean;
  hasReducedMotion: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number;
}

// Default settings for each performance level
const performanceLevelSettings: Record<
  PerformanceLevel,
  Partial<PerformanceSettings>
> = {
  high: {
    enableParticles: true,
    particleCount: 1000,
    enableGrain: true,
    enableScanlines: true,
    enableGlow: true,
    enableParallax: true,
    enableSmoothScroll: true,
    enableAnimations: true,
    enableAsciiAnimations: true,
    enable3DCanvas: true,
    enableMatrixRain: true,
    enableFloatingElements: true,
    canvasQuality: 1.0,
    targetFPS: 60,
  },
  medium: {
    enableParticles: true,
    particleCount: 400,
    enableGrain: true,
    enableScanlines: true,
    enableGlow: true,
    enableParallax: true,
    enableSmoothScroll: true,
    enableAnimations: true,
    enableAsciiAnimations: true,
    enable3DCanvas: true,
    enableMatrixRain: false, // Disabled for better performance
    enableFloatingElements: true,
    canvasQuality: 0.65,
    targetFPS: 40,
  },
  low: {
    enableParticles: true,
    particleCount: 150,
    enableGrain: false,
    enableScanlines: false,
    enableGlow: false, // Disable glow on low
    enableParallax: false,
    enableSmoothScroll: true,
    enableAnimations: true,
    enableAsciiAnimations: false,
    enable3DCanvas: false, // Disable 3D on low
    enableMatrixRain: false,
    enableFloatingElements: false,
    canvasQuality: 0.5,
    targetFPS: 30,
  },
  potato: {
    enableParticles: false,
    particleCount: 0,
    enableGrain: false,
    enableScanlines: false,
    enableGlow: false,
    enableParallax: false,
    enableSmoothScroll: false,
    enableAnimations: false,
    enableAsciiAnimations: false,
    enable3DCanvas: false,
    enableMatrixRain: false,
    enableFloatingElements: false,
    canvasQuality: 0.5,
    targetFPS: 30,
  },
};

// Context type
interface PerformanceContextType {
  settings: PerformanceSettings;
  currentFPS: number;
  isAutoMode: boolean;
  setPerformanceLevel: (level: PerformanceLevel) => void;
  setAutoMode: (enabled: boolean) => void;
  toggleSetting: (key: keyof PerformanceSettings) => void;
  updateSetting: <K extends keyof PerformanceSettings>(
    key: K,
    value: PerformanceSettings[K],
  ) => void;
  resetToDefaults: () => void;
}

// Create context
const PerformanceContext = createContext<PerformanceContextType | null>(null);

// Storage key
const STORAGE_KEY = "portfolio-performance-settings";
const AUTO_MODE_KEY = "portfolio-performance-auto-mode";

// Default settings
const getDefaultSettings = (): PerformanceSettings => ({
  level: "high",
  enableParticles: true,
  particleCount: 1000,
  enableGrain: true,
  enableScanlines: true,
  enableGlow: true,
  enableParallax: true,
  enableSmoothScroll: true,
  enableAnimations: true,
  enableAsciiAnimations: true,
  enable3DCanvas: true,
  enableMatrixRain: true,
  enableFloatingElements: true,
  canvasQuality: 1.0,
  targetFPS: 60,
  isLowPowerMode: false,
  isMobile: false,
  hasReducedMotion: false,
  deviceMemory: null,
  hardwareConcurrency: 4,
});

// FPS Monitor hook
function useFPSMonitor(onFPSUpdate: (fps: number) => void) {
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let isRunning = true;

    const measureFPS = (currentTime: number) => {
      if (!isRunning) return;

      const delta = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Store frame times (keep last 60 frames)
      frameTimesRef.current.push(delta);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calculate average FPS every 30 frames
      if (
        frameTimesRef.current.length >= 30 &&
        frameTimesRef.current.length % 30 === 0
      ) {
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);
        onFPSUpdate(fps);
      }

      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };

    animationFrameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onFPSUpdate]);
}

// Device detection utilities
function detectDeviceCapabilities(): Partial<PerformanceSettings> {
  if (typeof window === "undefined") {
    return {};
  }

  const capabilities: Partial<PerformanceSettings> = {};

  // Check for reduced motion preference
  capabilities.hasReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Check device memory (Chrome only)
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory) {
    capabilities.deviceMemory = nav.deviceMemory;
  }

  // Check hardware concurrency
  if (navigator.hardwareConcurrency) {
    capabilities.hardwareConcurrency = navigator.hardwareConcurrency;
  }

  // Check if mobile
  capabilities.isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768;

  // Check battery status (if available)
  const batteryNav = navigator as Navigator & {
    getBattery?: () => Promise<{ charging: boolean; level: number }>;
  };

  if (batteryNav.getBattery) {
    batteryNav
      .getBattery()
      .then((battery) => {
        if (!battery.charging && battery.level < 0.2) {
          capabilities.isLowPowerMode = true;
        }
      })
      .catch(() => {
        // Battery API not available or blocked
      });
  }

  return capabilities;
}

// Determine recommended performance level based on device capabilities
function getRecommendedLevel(
  capabilities: Partial<PerformanceSettings>,
): PerformanceLevel {
  // If reduced motion is preferred, use potato mode
  if (capabilities.hasReducedMotion) {
    return "potato";
  }

  // Score-based system
  let score = 100;

  // Mobile devices get a significant penalty - they need more optimization
  if (capabilities.isMobile) {
    score -= 40; // Increased from 30
  }

  // Low memory devices
  if (
    capabilities.deviceMemory !== null &&
    capabilities.deviceMemory !== undefined
  ) {
    if (capabilities.deviceMemory <= 2) {
      score -= 45; // Increased from 40
    } else if (capabilities.deviceMemory <= 4) {
      score -= 25; // Increased from 20
    }
  }

  // Low CPU cores
  if (capabilities.hardwareConcurrency) {
    if (capabilities.hardwareConcurrency <= 2) {
      score -= 35; // Increased from 30
    } else if (capabilities.hardwareConcurrency <= 4) {
      score -= 20; // Increased from 15
    }
  }

  // Low power mode - heavy penalty
  if (capabilities.isLowPowerMode) {
    score -= 40; // Increased from 30
  }

  // Determine level based on score - adjusted thresholds
  if (score >= 85) return "high";
  if (score >= 55) return "medium";
  if (score >= 25) return "low";
  return "potato";
}

// Provider component
interface PerformanceProviderProps {
  children: ReactNode;
  enableFPSMonitor?: boolean;
  autoAdjust?: boolean;
}

export function PerformanceProvider({
  children,
  enableFPSMonitor = true,
  autoAdjust = false, // Default to false - let users manually adjust
}: PerformanceProviderProps) {
  const [settings, setSettings] =
    useState<PerformanceSettings>(getDefaultSettings);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [isAutoMode, setIsAutoMode] = useState(false); // Default to manual mode
  const [isInitialized, setIsInitialized] = useState(false);
  const lowFPSCountRef = useRef(0);
  const lastAdjustTimeRef = useRef(0);

  // Initialize settings from localStorage and detect device
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load saved settings
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    const savedAutoMode = localStorage.getItem(AUTO_MODE_KEY);

    // Detect device capabilities
    const capabilities = detectDeviceCapabilities();

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          ...capabilities,
        }));
      } catch {
        // Invalid JSON, use defaults
      }
    } else {
      // First visit - use recommended level based on device capabilities
      // This provides better out-of-box experience especially on mobile
      const recommendedLevel = getRecommendedLevel(capabilities);
      const levelSettings = performanceLevelSettings[recommendedLevel];
      setSettings((prev) => ({
        ...prev,
        ...levelSettings,
        ...capabilities,
        level: recommendedLevel,
      }));
    }

    if (savedAutoMode !== null) {
      setIsAutoMode(savedAutoMode === "true");
    } else {
      // Default auto mode to false
      setIsAutoMode(false);
    }

    setIsInitialized(true);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isInitialized]);

  // Save auto mode preference
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    localStorage.setItem(AUTO_MODE_KEY, String(isAutoMode));
  }, [isAutoMode, isInitialized]);

  // Handle FPS updates
  const handleFPSUpdate = useCallback(
    (fps: number) => {
      setCurrentFPS(fps);

      // Auto-adjust if enabled
      if (!autoAdjust || !isAutoMode) return;

      const now = Date.now();
      // Don't adjust more than once every 5 seconds
      if (now - lastAdjustTimeRef.current < 5000) return;

      // Track low FPS occurrences
      if (fps < 30) {
        lowFPSCountRef.current++;

        // If FPS is consistently low, reduce performance level
        if (lowFPSCountRef.current >= 3) {
          const levels: PerformanceLevel[] = [
            "high",
            "medium",
            "low",
            "potato",
          ];
          const currentIndex = levels.indexOf(settings.level);

          if (currentIndex < levels.length - 1) {
            const newLevel = levels[currentIndex + 1];
            setSettings((prev) => ({
              ...prev,
              ...performanceLevelSettings[newLevel],
              level: newLevel,
            }));
            lastAdjustTimeRef.current = now;
            lowFPSCountRef.current = 0;
          }
        }
      } else if (fps >= 55) {
        // Reset low FPS counter if performance is good
        lowFPSCountRef.current = 0;
      }
    },
    [autoAdjust, isAutoMode, settings.level],
  );

  // FPS monitor
  useFPSMonitor(enableFPSMonitor ? handleFPSUpdate : () => {});

  // Set performance level
  const setPerformanceLevel = useCallback((level: PerformanceLevel) => {
    const levelSettings = performanceLevelSettings[level];
    setSettings((prev) => ({
      ...prev,
      ...levelSettings,
      level,
    }));
    lowFPSCountRef.current = 0;
  }, []);

  // Toggle auto mode
  const setAutoModeHandler = useCallback((enabled: boolean) => {
    setIsAutoMode(enabled);
  }, []);

  // Toggle a boolean setting
  const toggleSetting = useCallback((key: keyof PerformanceSettings) => {
    setSettings((prev) => {
      const value = prev[key];
      if (typeof value === "boolean") {
        return { ...prev, [key]: !value };
      }
      return prev;
    });
  }, []);

  // Update a specific setting
  const updateSetting = useCallback(
    <K extends keyof PerformanceSettings>(
      key: K,
      value: PerformanceSettings[K],
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const capabilities = detectDeviceCapabilities();
    const recommendedLevel = getRecommendedLevel(capabilities);
    const levelSettings = performanceLevelSettings[recommendedLevel];

    setSettings({
      ...getDefaultSettings(),
      ...levelSettings,
      ...capabilities,
      level: recommendedLevel,
    });
    setIsAutoMode(true);
  }, []);

  const value: PerformanceContextType = {
    settings,
    currentFPS,
    isAutoMode,
    setPerformanceLevel,
    setAutoMode: setAutoModeHandler,
    toggleSetting,
    updateSetting,
    resetToDefaults,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

// Hook to use performance context
export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}

// Hook for conditional rendering based on performance
export function usePerformanceGate(requiredLevel: PerformanceLevel = "low") {
  const { settings } = usePerformance();
  const levels: PerformanceLevel[] = ["potato", "low", "medium", "high"];
  const currentIndex = levels.indexOf(settings.level);
  const requiredIndex = levels.indexOf(requiredLevel);
  return currentIndex >= requiredIndex;
}

// Utility hook to check if a specific feature is enabled
export function useFeatureEnabled(feature: keyof PerformanceSettings): boolean {
  const { settings } = usePerformance();
  const value = settings[feature];
  return typeof value === "boolean" ? value : true;
}

// Export level settings for external use
export { performanceLevelSettings };

// Simple hook to check if animations are enabled (can be used outside provider)
export function useAnimationsEnabled(): boolean {
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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio-performance-settings") {
        checkSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return enabled;
}

// Hook to get performance level (can be used outside provider)
export function usePerformanceLevel(): PerformanceLevel {
  const [level, setLevel] = useState<PerformanceLevel>("high");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSettings = () => {
      try {
        const savedSettings = localStorage.getItem(
          "portfolio-performance-settings",
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setLevel(parsed.level || "high");
        }
      } catch {
        // Use default
      }
    };

    checkSettings();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio-performance-settings") {
        checkSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return level;
}
