"use client";

import { useEffect, useRef } from 'react';

export default function CSSMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+-=[]{}|;:,.<>?/~`';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Animation function
    const draw = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix text
      ctx.fillStyle = '#00ff88';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, 33); // ~30fps

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
