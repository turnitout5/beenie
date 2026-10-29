import React, { useEffect, useRef } from 'react';
import { useExpedition } from '../state/ExpeditionContext';

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  phase: number;
}

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
}

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { state } = useExpedition();
  const { starsRecovered, currentLocation } = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Number of stars scales with recovery progress!
    // Starts with 30 faint stars at 0 stars, scales up to 160 bright stars at 7 stars
    const starCount = Math.min(180, 30 + starsRecovered * 22);
    const starPalette = ['#F4EBDD', '#F6D78B', '#C3A9E8', '#9588BD', '#F3B79C'];

    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      size: Math.random() < 0.8 ? 2 : 3, // crisp pixel squares!
      color: starPalette[Math.floor(Math.random() * starPalette.length)],
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    // Fireflies in garden & hub
    const hasFireflies = currentLocation === 'garden' || (currentLocation === 'hub' && starsRecovered >= 3);
    const fireflyCount = currentLocation === 'garden' ? 24 : 10;
    const fireflies: Firefly[] = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * width,
      y: height * 0.4 + Math.random() * height * 0.5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: 3,
      alpha: Math.random(),
      targetAlpha: Math.random(),
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render background stars (pixel blocks)
      for (let i = 0; i < starCount; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const opacity = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(star.phase));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        // Crisp pixel square rendering
        ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
      }

      // Render fireflies
      if (hasFireflies) {
        for (const fly of fireflies) {
          fly.x += fly.vx;
          fly.y += fly.vy;

          if (fly.x < 0) fly.x = width;
          if (fly.x > width) fly.x = 0;
          if (fly.y < height * 0.3) fly.y = height * 0.85;
          if (fly.y > height * 0.9) fly.y = height * 0.4;

          fly.alpha += (fly.targetAlpha - fly.alpha) * 0.05;
          if (Math.abs(fly.targetAlpha - fly.alpha) < 0.05) {
            fly.targetAlpha = Math.random() > 0.3 ? 0.7 + Math.random() * 0.3 : 0.1;
          }

          ctx.fillStyle = '#F6D78B';
          ctx.globalAlpha = fly.alpha;
          ctx.fillRect(Math.floor(fly.x), Math.floor(fly.y), fly.size, fly.size);

          // Subtle warm glow around firefly
          ctx.fillStyle = 'rgba(243, 183, 156, 0.2)';
          ctx.fillRect(Math.floor(fly.x - 2), Math.floor(fly.y - 2), fly.size + 4, fly.size + 4);
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [starsRecovered, currentLocation]);

  return (
    <canvas
      ref={canvasRef}
      className="pixel-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
