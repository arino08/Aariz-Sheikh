"use client";

import { useEffect, useRef } from 'react';

interface TerminalMatrixRainProps {
  isActive: boolean;
}

export default function TerminalMatrixRain({ isActive }: TerminalMatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain configuration
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Characters to use
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`";

    // Animation loop
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw characters
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Gradient effect - brighter at the tip
        const gradient = ctx.createLinearGradient(0, drops[i] * fontSize - 50, 0, drops[i] * fontSize);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 1)');

        ctx.fillStyle = gradient;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
      style={{ opacity: isActive ? 0.4 : 0 }}
    />
  );
}
