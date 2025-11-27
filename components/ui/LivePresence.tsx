"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Visitor {
  id: string;
  x: number;
  y: number;
  section: string;
  color: string;
  lastSeen: number;
}

interface LivePresenceProps {
  showCursors?: boolean;
  showCounter?: boolean;
  showNotifications?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxCursors?: number;
  className?: string;
}

// Generate a unique visitor ID
const generateVisitorId = () => {
  const stored =
    typeof window !== "undefined" ? sessionStorage.getItem("visitor-id") : null;
  if (stored) return stored;

  const id = `visitor_${Math.random().toString(36).substring(2, 9)}`;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("visitor-id", id);
  }
  return id;
};

// Generate a random cursor color
const generateColor = () => {
  const colors = [
    "#00ff88", // Green
    "#00d4ff", // Blue
    "#ff8c00", // Orange
    "#a855f7", // Purple
    "#ff4444", // Red
    "#ffbb00", // Yellow
    "#00ffd4", // Cyan
    "#ff00aa", // Pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get current section from scroll position
const getCurrentSection = () => {
  if (typeof window === "undefined") return "hero";

  const sections = ["hero", "about", "skills", "projects", "contact"];
  const windowHeight = window.innerHeight;

  for (const sectionId of sections) {
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
        return sectionId;
      }
    }
  }

  return "hero";
};

export default function LivePresence({
  showCursors = true,
  showCounter = true,
  showNotifications = true,
  position = "top-right",
  maxCursors = 10,
  className = "",
}: LivePresenceProps) {
  const [visitors, setVisitors] = useState<Map<string, Visitor>>(new Map());
  const [visitorCount, setVisitorCount] = useState(1);
  const [myId] = useState(generateVisitorId);
  const [myColor] = useState(generateColor);
  const [notification, setNotification] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastBroadcast = useRef(0);
  const cursorThrottle = 50; // ms between cursor updates

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  // Show notification
  const showNotification = useCallback(
    (message: string) => {
      if (!showNotifications) return;
      setNotification(message);
      setTimeout(() => setNotification(null), 3000);
    },
    [showNotifications],
  );

  // Broadcast cursor position
  const broadcastPosition = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastBroadcast.current < cursorThrottle) return;
      lastBroadcast.current = now;

      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "cursor",
          payload: {
            id: myId,
            x,
            y,
            section: getCurrentSection(),
            color: myColor,
            lastSeen: now,
          },
        });
      }
    },
    [myId, myColor],
  );

  // Setup Supabase Realtime channel
  useEffect(() => {
    const channel = supabase.channel("live-presence", {
      config: {
        presence: {
          key: myId,
        },
      },
    });

    // Track presence (who's online)
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      setVisitorCount(Math.max(1, count));
      setIsConnected(true);
    });

    // Handle new visitor joining
    channel.on("presence", { event: "join" }, ({ key }) => {
      if (key !== myId) {
        showNotification(`Someone joined the site`);
      }
    });

    // Handle visitor leaving
    channel.on("presence", { event: "leave" }, ({ key }) => {
      if (key !== myId) {
        setVisitors((prev) => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
      }
    });

    // Handle cursor broadcasts
    channel.on("broadcast", { event: "cursor" }, ({ payload }) => {
      if (payload.id !== myId) {
        setVisitors((prev) => {
          const next = new Map(prev);
          // Limit number of cursors
          if (next.size >= maxCursors && !next.has(payload.id)) {
            // Remove oldest
            const oldest = Array.from(next.entries()).sort(
              (a, b) => a[1].lastSeen - b[1].lastSeen,
            )[0];
            if (oldest) next.delete(oldest[0]);
          }
          next.set(payload.id, payload as Visitor);
          return next;
        });
      }
    });

    // Subscribe and track presence
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          online_at: new Date().toISOString(),
          section: getCurrentSection(),
        });
        setIsConnected(true);
      }
    });

    channelRef.current = channel;

    // Cleanup
    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [myId, maxCursors, showNotification]);

  // Track mouse movement
  useEffect(() => {
    if (!showCursors) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      broadcastPosition(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showCursors, broadcastPosition]);

  // Update section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (channelRef.current) {
        channelRef.current.track({
          online_at: new Date().toISOString(),
          section: getCurrentSection(),
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clean up stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setVisitors((prev) => {
        const next = new Map(prev);
        for (const [id, visitor] of next) {
          if (now - visitor.lastSeen > 5000) {
            next.delete(id);
          }
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Visitor Counter */}
      {showCounter && (
        <div
          className={`fixed ${positionClasses[position]} z-50 ${className}`}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="flex items-center gap-2 bg-[#0D1117]/90 backdrop-blur-sm border border-[#00ff88]/30 rounded-full px-3 py-1.5 shadow-lg"
            style={{
              boxShadow: isConnected
                ? "0 0 20px rgba(0, 255, 136, 0.2)"
                : "none",
            }}
          >
            {/* Connection indicator */}
            <div className="relative">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-[#00ff88]" : "bg-gray-500"
                }`}
              />
              {isConnected && (
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00ff88] animate-ping opacity-75" />
              )}
            </div>

            {/* Counter */}
            <span className="font-mono text-xs text-[#00ff88]">
              <span className="text-white font-bold">{visitorCount}</span>
              <span className="text-[#6b7280] ml-1">
                {visitorCount === 1 ? "viewer" : "viewers"}
              </span>
            </span>

            {/* Live indicator */}
            <span className="font-mono text-[10px] text-[#00ff88] uppercase tracking-wider opacity-70">
              live
            </span>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fadeIn"
          style={{
            animation: "fadeInDown 0.3s ease-out",
          }}
        >
          <div className="bg-[#0D1117]/95 backdrop-blur-sm border border-[#00ff88]/30 rounded-lg px-4 py-2 shadow-lg">
            <span className="font-mono text-sm text-[#00ff88]">
              {notification}
            </span>
          </div>
        </div>
      )}

      {/* Remote Cursors */}
      {showCursors &&
        Array.from(visitors.values()).map((visitor) => (
          <div
            key={visitor.id}
            className="fixed pointer-events-none z-[60] transition-all duration-100 ease-out"
            style={{
              left: `${visitor.x}%`,
              top: `${visitor.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Cursor */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter: `drop-shadow(0 0 4px ${visitor.color})`,
              }}
            >
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z"
                fill={visitor.color}
                stroke="#000"
                strokeWidth="1"
              />
            </svg>

            {/* Label */}
            <div
              className="absolute left-5 top-4 font-mono text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap"
              style={{
                backgroundColor: visitor.color,
                color: "#000",
                boxShadow: `0 0 10px ${visitor.color}50`,
              }}
            >
              {visitor.section}
            </div>
          </div>
        ))}

      {/* Inline styles */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// Export a hook for accessing presence data elsewhere
export function usePresence() {
  const [count, setCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel = supabase.channel("presence-counter");

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      setCount(Math.max(1, Object.keys(state).length));
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ online: true });
        setIsConnected(true);
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { count, isConnected };
}
