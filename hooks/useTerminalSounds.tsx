"use client";

import {
  useRef,
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import type { ReactNode } from "react";

type SoundType =
  | "keypress"
  | "success"
  | "error"
  | "click"
  | "beep"
  | "boot"
  | "whoosh"
  | "glitch"
  | "notification";

interface SoundOptions {
  volume?: number;
  pitch?: number;
  duration?: number;
}

interface UseTerminalSoundsOptions {
  enabled?: boolean;
  masterVolume?: number;
}

export default function useTerminalSounds(
  options: UseTerminalSoundsOptions = {}
) {
  const { enabled: initialEnabled = true, masterVolume = 0.3 } = options;

  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio context on first user interaction
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
        setIsInitialized(true);
      }
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }

    return audioContextRef.current;
  }, []);

  // Resume audio context if suspended (required for some browsers)
  const ensureAudioContext = useCallback(async () => {
    const ctx = initAudioContext();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx;
  }, [initAudioContext]);

  // Initialize on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudioContext();
      // Remove listeners after first interaction
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [initAudioContext]);

  // Base oscillator sound
  const playTone = useCallback(
    async (
      frequency: number,
      duration: number,
      type: OscillatorType = "square",
      volume: number = 0.1
    ) => {
      if (!isEnabled) return;

      const ctx = await ensureAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      const finalVolume = volume * masterVolume;

      // Envelope for smoother sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        finalVolume,
        ctx.currentTime + 0.005
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [isEnabled, masterVolume, ensureAudioContext]
  );

  // Noise generator for glitch/static effects
  const playNoise = useCallback(
    async (duration: number, volume: number = 0.1) => {
      if (!isEnabled) return;

      const ctx = await ensureAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      noise.buffer = buffer;

      filter.type = "highpass";
      filter.frequency.value = 1000;

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      const finalVolume = volume * masterVolume;
      gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration
      );

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + duration);
    },
    [isEnabled, masterVolume, ensureAudioContext]
  );

  // Keypress sound - quick, subtle click
  const playKeypress = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.08, pitch = 1 } = opts;
      const baseFreq = 600 + Math.random() * 200; // Slight variation
      await playTone(baseFreq * pitch, 0.05, "square", volume);
    },
    [playTone]
  );

  // Success sound - ascending tones
  const playSuccess = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.12, pitch = 1 } = opts;

      await playTone(800 * pitch, 0.1, "sine", volume);
      setTimeout(() => playTone(1000 * pitch, 0.1, "sine", volume), 80);
      setTimeout(() => playTone(1200 * pitch, 0.15, "sine", volume), 160);
    },
    [playTone]
  );

  // Error sound - descending harsh tones
  const playError = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.1, pitch = 1 } = opts;

      await playTone(400 * pitch, 0.15, "sawtooth", volume);
      setTimeout(() => playTone(300 * pitch, 0.2, "sawtooth", volume), 100);
    },
    [playTone]
  );

  // Click sound - short pop
  const playClick = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.06, pitch = 1 } = opts;
      await playTone(500 * pitch, 0.03, "sine", volume);
    },
    [playTone]
  );

  // Beep sound - classic terminal beep
  const playBeep = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.1, pitch = 1, duration = 0.1 } = opts;
      await playTone(880 * pitch, duration, "square", volume);
    },
    [playTone]
  );

  // Boot sound - startup sequence
  const playBoot = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.08 } = opts;

      // BIOS-style boot beep
      await playTone(800, 0.1, "square", volume);

      // Ascending boot tones
      setTimeout(() => playTone(400, 0.08, "sine", volume * 0.8), 200);
      setTimeout(() => playTone(500, 0.08, "sine", volume * 0.8), 280);
      setTimeout(() => playTone(600, 0.08, "sine", volume * 0.8), 360);
      setTimeout(() => playTone(800, 0.12, "sine", volume), 440);
    },
    [playTone]
  );

  // Whoosh sound - for transitions
  const playWhoosh = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.06, duration = 0.3 } = opts;

      if (!isEnabled) return;

      const ctx = await ensureAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        800,
        ctx.currentTime + duration * 0.3
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        100,
        ctx.currentTime + duration
      );

      const finalVolume = volume * masterVolume;
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        finalVolume,
        ctx.currentTime + duration * 0.1
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [isEnabled, masterVolume, ensureAudioContext]
  );

  // Glitch sound - digital distortion
  const playGlitch = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.08, duration = 0.2 } = opts;

      // Random noise burst
      await playNoise(duration, volume);

      // Add some random tones
      const randomFreq = 200 + Math.random() * 1000;
      await playTone(randomFreq, duration * 0.5, "sawtooth", volume * 0.5);
    },
    [playNoise, playTone]
  );

  // Notification sound - gentle alert
  const playNotification = useCallback(
    async (opts: SoundOptions = {}) => {
      const { volume = 0.1, pitch = 1 } = opts;

      await playTone(523 * pitch, 0.1, "sine", volume); // C5
      setTimeout(() => playTone(659 * pitch, 0.15, "sine", volume), 100); // E5
    },
    [playTone]
  );

  // Generic play function
  const play = useCallback(
    async (type: SoundType, opts: SoundOptions = {}) => {
      switch (type) {
        case "keypress":
          return playKeypress(opts);
        case "success":
          return playSuccess(opts);
        case "error":
          return playError(opts);
        case "click":
          return playClick(opts);
        case "beep":
          return playBeep(opts);
        case "boot":
          return playBoot(opts);
        case "whoosh":
          return playWhoosh(opts);
        case "glitch":
          return playGlitch(opts);
        case "notification":
          return playNotification(opts);
        default:
          console.warn(`Unknown sound type: ${type}`);
      }
    },
    [
      playKeypress,
      playSuccess,
      playError,
      playClick,
      playBeep,
      playBoot,
      playWhoosh,
      playGlitch,
      playNotification,
    ]
  );

  // Toggle sound on/off
  const toggle = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  // Enable sounds
  const enable = useCallback(() => {
    setIsEnabled(true);
  }, []);

  // Disable sounds
  const disable = useCallback(() => {
    setIsEnabled(false);
  }, []);

  return {
    // State
    isEnabled,
    isInitialized,

    // Individual sound functions
    playKeypress,
    playSuccess,
    playError,
    playClick,
    playBeep,
    playBoot,
    playWhoosh,
    playGlitch,
    playNotification,

    // Generic play function
    play,

    // Low-level functions
    playTone,
    playNoise,

    // Controls
    toggle,
    enable,
    disable,

    // Initialize manually if needed
    init: initAudioContext,
  };
}

// Sound context for global sound state (optional)
interface SoundContextType {
  sounds: ReturnType<typeof useTerminalSounds>;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider(props: {
  children: ReactNode;
  options?: UseTerminalSoundsOptions;
}) {
  const { children, options } = props;
  const sounds = useTerminalSounds(options);

  return (
    <SoundContext.Provider value={{ sounds }}>{children}</SoundContext.Provider>
  );
}

export function useSounds() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSounds must be used within a SoundProvider");
  }
  return context.sounds;
}
