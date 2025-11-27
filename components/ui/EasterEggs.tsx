"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { gsap } from "gsap";

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

// Secret word triggers
const SECRET_WORDS: Record<string, string> = {
  matrix: "matrix",
  hack: "hack",
  sudo: "sudo",
  party: "party",
  coffee: "coffee",
  rust: "rust",
};

interface EasterEggsProps {
  enabled?: boolean;
}

export default function EasterEggs({ enabled = true }: EasterEggsProps) {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [typedWord, setTypedWord] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const matrixAnimationRef = useRef<number | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show notification
  const notify = useCallback((text: string) => {
    setNotificationText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }, []);

  // Matrix rain effect
  const startMatrixRain = useCallback(() => {
    if (matrixCanvasRef.current) return; // Already running

    const canvas = document.createElement("canvas");
    canvas.id = "matrix-easter-egg";
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s;
    `;
    document.body.appendChild(canvas);
    matrixCanvasRef.current = canvas;

    // Fade in
    setTimeout(() => {
      canvas.style.opacity = "0.8";
    }, 50);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(13, 17, 23, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff88";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillStyle = `rgba(0, 255, 136, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      matrixAnimationRef.current = requestAnimationFrame(draw);
    };

    draw();
    notify("🔓 MATRIX MODE ACTIVATED");
  }, [notify]);

  const stopMatrixRain = useCallback(() => {
    if (matrixAnimationRef.current) {
      cancelAnimationFrame(matrixAnimationRef.current);
      matrixAnimationRef.current = null;
    }
    if (matrixCanvasRef.current) {
      matrixCanvasRef.current.style.opacity = "0";
      setTimeout(() => {
        matrixCanvasRef.current?.remove();
        matrixCanvasRef.current = null;
      }, 500);
    }
  }, []);

  // Hack effect - glitch the entire page
  const triggerHackEffect = useCallback(() => {
    notify("💀 SYSTEM COMPROMISED");
    const body = document.body;

    // Add glitch class
    body.style.animation = "glitch-effect 0.3s infinite";

    // Create style for glitch
    const style = document.createElement("style");
    style.id = "hack-effect-style";
    style.textContent = `
      @keyframes glitch-effect {
        0% { transform: translate(0); filter: hue-rotate(0deg); }
        20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
        40% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
        60% { transform: translate(-2px, -2px); filter: hue-rotate(270deg); }
        80% { transform: translate(2px, 2px); filter: hue-rotate(360deg); }
        100% { transform: translate(0); filter: hue-rotate(0deg); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      body.style.animation = "";
      document.getElementById("hack-effect-style")?.remove();
    }, 3000);
  }, [notify]);

  // Sudo effect - temporary "admin" mode visual
  const triggerSudoEffect = useCallback(() => {
    notify("🔐 ROOT ACCESS GRANTED");

    // Add red tint to page
    const overlay = document.createElement("div");
    overlay.id = "sudo-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle at center, transparent 0%, rgba(255, 0, 0, 0.1) 100%);
      pointer-events: none;
      z-index: 99998;
      opacity: 0;
      transition: opacity 0.5s;
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.opacity = "1";
    }, 50);

    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 500);
    }, 5000);
  }, [notify]);

  // Party effect - rainbow colors
  const triggerPartyEffect = useCallback(() => {
    notify("🎉 PARTY MODE!");

    const style = document.createElement("style");
    style.id = "party-effect-style";
    style.textContent = `
      @keyframes rainbow-bg {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      body.party-mode {
        animation: rainbow-bg 2s linear infinite;
      }
      body.party-mode * {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add("party-mode");

    // Add confetti
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti-particle";
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: hsl(${Math.random() * 360}, 100%, 50%);
        top: -10px;
        left: ${Math.random() * 100}vw;
        z-index: 99999;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
      `;
      document.body.appendChild(confetti);

      gsap.to(confetti, {
        y: window.innerHeight + 100,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 720,
        duration: 2 + Math.random() * 2,
        ease: "power1.out",
        onComplete: () => confetti.remove(),
      });
    }

    setTimeout(() => {
      document.body.classList.remove("party-mode");
      document.getElementById("party-effect-style")?.remove();
    }, 5000);
  }, [notify]);

  // Coffee effect
  const triggerCoffeeEffect = useCallback(() => {
    notify("☕ +100 ENERGY BOOST");

    // Speed up all animations temporarily
    const style = document.createElement("style");
    style.id = "coffee-effect-style";
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
    `;
    document.head.appendChild(style);

    // Create floating coffee cups
    for (let i = 0; i < 10; i++) {
      const coffee = document.createElement("div");
      coffee.textContent = "☕";
      coffee.style.cssText = `
        position: fixed;
        font-size: 2rem;
        bottom: -50px;
        left: ${Math.random() * 100}vw;
        z-index: 99999;
        pointer-events: none;
      `;
      document.body.appendChild(coffee);

      gsap.to(coffee, {
        y: -window.innerHeight - 100,
        x: (Math.random() - 0.5) * 100,
        rotation: Math.random() * 360,
        duration: 3 + Math.random() * 2,
        ease: "power1.out",
        onComplete: () => coffee.remove(),
      });
    }

    setTimeout(() => {
      document.getElementById("coffee-effect-style")?.remove();
    }, 3000);
  }, [notify]);

  // Rust effect - ferris crab animation
  const triggerRustEffect = useCallback(() => {
    notify("🦀 FEARLESS CONCURRENCY!");

    // Create Ferris crabs
    for (let i = 0; i < 8; i++) {
      const crab = document.createElement("div");
      crab.textContent = "🦀";
      crab.style.cssText = `
        position: fixed;
        font-size: 2rem;
        left: -50px;
        top: ${Math.random() * 80 + 10}vh;
        z-index: 99999;
        pointer-events: none;
      `;
      document.body.appendChild(crab);

      gsap.to(crab, {
        x: window.innerWidth + 100,
        y: `+=${Math.sin(i) * 50}`,
        duration: 3 + Math.random(),
        ease: "none",
        delay: i * 0.2,
        onComplete: () => crab.remove(),
      });
    }
  }, [notify]);

  // Konami code handler
  const handleKonamiKey = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      if (e.code === KONAMI_CODE[konamiIndex]) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);

        if (newIndex === KONAMI_CODE.length) {
          // Konami code completed!
          setKonamiIndex(0);
          setActiveEffect("konami");
          startMatrixRain();

          // Stop after 10 seconds
          effectTimeoutRef.current = setTimeout(() => {
            stopMatrixRain();
            setActiveEffect(null);
          }, 10000);
        }
      } else {
        setKonamiIndex(0);
      }
    },
    [enabled, konamiIndex, startMatrixRain, stopMatrixRain]
  );

  // Secret word handler
  const handleSecretWord = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (activeEffect) return;

      // Only track letter keys
      if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        const newTyped = (typedWord + e.key.toLowerCase()).slice(-10);
        setTypedWord(newTyped);

        // Check for secret words
        for (const [key, word] of Object.entries(SECRET_WORDS)) {
          if (newTyped.endsWith(word)) {
            setTypedWord("");
            setActiveEffect(key);

            switch (key) {
              case "matrix":
                startMatrixRain();
                effectTimeoutRef.current = setTimeout(() => {
                  stopMatrixRain();
                  setActiveEffect(null);
                }, 10000);
                break;
              case "hack":
                triggerHackEffect();
                effectTimeoutRef.current = setTimeout(
                  () => setActiveEffect(null),
                  3000
                );
                break;
              case "sudo":
                triggerSudoEffect();
                effectTimeoutRef.current = setTimeout(
                  () => setActiveEffect(null),
                  5000
                );
                break;
              case "party":
                triggerPartyEffect();
                effectTimeoutRef.current = setTimeout(
                  () => setActiveEffect(null),
                  5000
                );
                break;
              case "coffee":
                triggerCoffeeEffect();
                effectTimeoutRef.current = setTimeout(
                  () => setActiveEffect(null),
                  3000
                );
                break;
              case "rust":
                triggerRustEffect();
                effectTimeoutRef.current = setTimeout(
                  () => setActiveEffect(null),
                  4000
                );
                break;
            }
            break;
          }
        }
      }
    },
    [
      enabled,
      typedWord,
      activeEffect,
      startMatrixRain,
      stopMatrixRain,
      triggerHackEffect,
      triggerSudoEffect,
      triggerPartyEffect,
      triggerCoffeeEffect,
      triggerRustEffect,
    ]
  );

  // Clear typed word after inactivity
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTypedWord("");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [typedWord]);

  // Setup event listeners
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      handleKonamiKey(e);
      handleSecretWord(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
      stopMatrixRain();
    };
  }, [enabled, handleKonamiKey, handleSecretWord, stopMatrixRain]);

  // Notification component
  if (!showNotification) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[100000] pointer-events-none"
      style={{
        animation: "notification-slide-in 0.3s ease-out",
      }}
    >
      <div className="bg-[#161B22] border border-[var(--terminal-green)] rounded-lg px-6 py-3 shadow-[0_0_30px_rgba(0,255,136,0.3)]">
        <div className="font-mono text-sm text-[var(--terminal-green)] whitespace-nowrap">
          {notificationText}
        </div>
      </div>
      <style jsx>{`
        @keyframes notification-slide-in {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}

// Hook to trigger effects programmatically
export function useEasterEggs() {
  const triggerEffect = (effect: string) => {
    const event = new CustomEvent("easter-egg-trigger", { detail: effect });
    window.dispatchEvent(event);
  };

  return { triggerEffect };
}
