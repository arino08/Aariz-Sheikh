"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface MatrixRainProps {
  particleCount?: number;
  enabled?: boolean;
  quality?: number;
}

export default function MatrixRain({
  particleCount = 1000,
  enabled = true,
  quality = 1.0,
}: MatrixRainProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Adjust particle count based on quality
  const effectiveCount = useMemo(() => {
    return Math.max(50, Math.floor(particleCount * quality));
  }, [particleCount, quality]);

  // Generate matrix rain particles
  const particles = useMemo(() => {
    const positions = new Float32Array(effectiveCount * 3);
    const colors = new Float32Array(effectiveCount * 3);
    const speeds = new Float32Array(effectiveCount);

    for (let i = 0; i < effectiveCount; i++) {
      const i3 = i * 3;

      // Random positions
      positions[i3] = (Math.random() - 0.5) * 20; // x
      positions[i3 + 1] = Math.random() * 20 - 10; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 20; // z

      // Green matrix colors with variation
      const greenIntensity = Math.random() * 0.5 + 0.5;
      colors[i3] = 0; // r
      colors[i3 + 1] = greenIntensity; // g
      colors[i3 + 2] = greenIntensity * 0.3; // b

      // Random fall speeds
      speeds[i] = Math.random() * 0.05 + 0.01;
    }

    return { positions, colors, speeds, count: effectiveCount };
  }, [effectiveCount]);

  // Visibility detection using Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Throttled frame updates for better performance
  const lastUpdateRef = useRef(0);
  const targetFPS = quality >= 0.75 ? 60 : quality >= 0.5 ? 30 : 20;
  const frameInterval = 1000 / targetFPS;

  useFrame((state, delta) => {
    // Skip updates if disabled or not visible
    if (!enabled || !isVisible || !pointsRef.current) return;

    // Throttle updates based on quality
    const now = state.clock.getElapsedTime() * 1000;
    if (now - lastUpdateRef.current < frameInterval) return;
    lastUpdateRef.current = now;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    // Update particle positions for matrix rain effect
    // Use a scaled delta to ensure consistent animation speed regardless of frame rate
    const scaledDelta = delta * (60 / targetFPS);

    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;

      // Move particles down
      positions[i3 + 1] -= particles.speeds[i] * scaledDelta * 60;

      // Reset particles that have fallen below the view
      if (positions[i3 + 1] < -10) {
        positions[i3 + 1] = 10;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Subtle rotation for depth (only at higher quality)
    if (quality >= 0.5) {
      pointsRef.current.rotation.y += scaledDelta * 0.1;
    }
  });

  // Don't render if disabled
  if (!enabled || effectiveCount === 0) return null;

  return (
    <Points ref={pointsRef} frustumCulled>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.1 * quality}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Points>
  );
}

// Lightweight version for potato mode - uses CSS instead of WebGL
export function MatrixRainCSS({ opacity = 0.3 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 30%, rgba(0, 255, 136, 0.05) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 60%, rgba(0, 255, 136, 0.05) 0%, transparent 40%)
          `,
        }}
      />
      {/* Static grid pattern as fallback */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}
