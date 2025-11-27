"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    incrementAndFetchCount();
  }, []);

  const incrementAndFetchCount = async () => {
    setIsLoading(true);

    try {
      // Check if this visitor has already been counted in this session
      const hasVisited = sessionStorage.getItem("visitor_counted");

      if (!hasVisited) {
        // Increment the counter
        const { data, error } = await supabase.rpc("increment_visitor_count");

        if (error) {
          console.error("Error incrementing visitor count:", error);
          // Try to just fetch the count instead
          await fetchCount();
        } else {
          setCount(data);
          setIsIncrementing(true);
          sessionStorage.setItem("visitor_counted", "true");

          // Animate the increment
          setTimeout(() => setIsIncrementing(false), 500);
        }
      } else {
        // Just fetch the current count
        await fetchCount();
      }
    } catch (err) {
      console.error("Error with visitor count:", err);
      await fetchCount();
    }

    setIsLoading(false);
  };

  const fetchCount = async () => {
    try {
      const { data, error } = await supabase
        .from("visitor_count")
        .select("count")
        .single();

      if (error) {
        console.error("Error fetching visitor count:", error);
        setCount(null);
      } else {
        setCount(data?.count || 0);
      }
    } catch (err) {
      console.error("Error fetching count:", err);
      setCount(null);
    }
  };

  const formatCount = (num: number) => {
    return num.toString().padStart(6, "0");
  };

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 font-mono text-xs">
        <span className="text-[var(--terminal-green)] animate-pulse">
          {">"} loading visitors...
        </span>
      </div>
    );
  }

  if (count === null) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-3 bg-[#161B22] border border-gray-800 rounded-lg px-4 py-2 font-mono text-sm">
      {/* Terminal prompt */}
      <span className="text-[var(--terminal-green)]">$</span>

      {/* Visitor text */}
      <span className="text-[var(--code-comment)]">visitors</span>

      {/* Equals sign */}
      <span className="text-white">=</span>

      {/* Counter display */}
      <div className="relative flex items-center gap-0.5">
        {formatCount(count)
          .split("")
          .map((digit, index) => (
            <span
              key={index}
              className={`
                inline-flex items-center justify-center
                w-5 h-7 bg-[#0D1117] rounded
                text-[var(--terminal-green)] font-bold
                border border-[var(--terminal-green)]/30
                ${isIncrementing ? "animate-pulse" : ""}
              `}
              style={{
                textShadow: "0 0 10px var(--terminal-green)",
                animationDelay: `${index * 50}ms`,
              }}
            >
              {digit}
            </span>
          ))}

        {/* Glow effect when incrementing */}
        {isIncrementing && (
          <div className="absolute inset-0 bg-[var(--terminal-green)]/20 rounded blur-md animate-ping" />
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 ml-2">
        <div className="w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-pulse shadow-[0_0_8px_var(--terminal-green)]" />
        <span className="text-[var(--terminal-green)] text-xs">live</span>
      </div>
    </div>
  );
}
