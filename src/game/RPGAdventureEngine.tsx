import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { Direction, Position, RoomId, InteractableObject } from './types';
import { ROOMS } from './maps';
import { SpriteRenderer } from './spriteRenderer';
import { soundEngine } from '../audio/soundEngine';

import { LocationId } from '../types/expedition';

interface RPGAdventureEngineProps {
  onTriggerInteraction: (interactable: InteractableObject) => void;
}

export const RPGAdventureEngine: React.FC<RPGAdventureEngineProps> = ({
  onTriggerInteraction,
}) => {
  const { state, navigateTo } = useExpedition();
  const { starsRecovered, recoveredStarIds, secretGardenUnlocked, currentLocation } = state;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Current Room
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>(() => {
    if (currentLocation && currentLocation !== 'boot' && currentLocation !== 'hub') {
      return (currentLocation as RoomId) in ROOMS ? (currentLocation as RoomId) : 'overworld';
    }
    return 'overworld';
  });
  const room = ROOMS[currentRoomId] || ROOMS['overworld'];

  // Player State
  const playerPosRef = useRef<Position>({ ...room.defaultSpawn });
  const playerDirRef = useRef<Direction>('down');
  const isWalkingRef = useRef<boolean>(false);
  const walkFrameRef = useRef<number>(0);

  // Companion (Ted) Follower State
  const tedPosRef = useRef<Position>({ x: room.defaultSpawn.x, y: room.defaultSpawn.y + 28 });
  const tedDirRef = useRef<Direction>('up');
  const trailRef = useRef<Position[]>([]);

  // Controls State
  const keysPressed = useRef<Record<string, boolean>>({});
  const [activeInteractable, setActiveInteractable] = useState<InteractableObject | null>(null);
  const activeInteractableRef = useRef<InteractableObject | null>(null);

  // Target Move (Tap-to-move on mobile/desktop)
  const targetPosRef = useRef<Position | null>(null);

  // Room Transition Helper
  const changeRoom = useCallback((newRoomId: RoomId, spawnPos?: Position, syncNav = true) => {
    soundEngine.playDoorOpen();
    setCurrentRoomId(newRoomId);
    const targetRoom = ROOMS[newRoomId] || ROOMS['overworld'];
    const newSpawn = spawnPos || targetRoom.defaultSpawn;

    playerPosRef.current = { ...newSpawn };
    tedPosRef.current = { x: newSpawn.x, y: newSpawn.y + 24 };
    trailRef.current = [];
    targetPosRef.current = null;
    activeInteractableRef.current = null;
    setActiveInteractable(null);

    if (newRoomId === 'garden') {
      soundEngine.startGardenMelody();
    } else {
      soundEngine.stopGardenMelody();
    }

    if (syncNav) {
      navigateTo(newRoomId === 'overworld' ? 'hub' : (newRoomId as LocationId));
    }
  }, [navigateTo]);

  // Sync room when navigation changes externally (e.g. from Journal Quick-Travel or Header)
  useEffect(() => {
    if (!currentLocation || currentLocation === 'boot') return;
    const targetRoomId: RoomId = currentLocation === 'hub' ? 'overworld' : (currentLocation as RoomId);
    if (ROOMS[targetRoomId] && targetRoomId !== currentRoomId) {
      changeRoom(targetRoomId, undefined, false);
    }
  }, [currentLocation, currentRoomId, changeRoom]);

  // Action Trigger
  const handleAction = useCallback(() => {
    const interactable = activeInteractableRef.current;
    if (!interactable) return;

    if (interactable.type === 'door' && interactable.targetRoom) {
      if (interactable.id === 'door_garden' && !secretGardenUnlocked) {
        soundEngine.playClick();
        onTriggerInteraction(interactable);
        return;
      }
      changeRoom(interactable.targetRoom, interactable.targetPos);
    } else {
      soundEngine.playClick();
      onTriggerInteraction(interactable);
    }
  }, [changeRoom, onTriggerInteraction, secretGardenUnlocked]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 's', 'a', 'd', ' '].includes(key)) {
        e.preventDefault();
      }

      if (key === 'e' || key === ' ' || key === 'enter') {
        handleAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleAction]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const checkCollision = (x: number, y: number): boolean => {
      const pWidth = 16;
      const pHeight = 12;
      const px = x + 4;
      const py = y + 16;

      for (const box of room.collisionBoxes) {
        if (
          px < box.x + box.width &&
          px + pWidth > box.x &&
          py < box.y + box.height &&
          py + pHeight > box.y
        ) {
          return true;
        }
      }
      return false;
    };

    const loop = () => {
      frameCount++;
      const currentRoom = ROOMS[currentRoomId];

      // Canvas dimensions match room
      canvas.width = currentRoom.width;
      canvas.height = currentRoom.height;

      // Handle Movement Input
      let dx = 0;
      let dy = 0;
      const speed = 2.4;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        dy -= speed;
        playerDirRef.current = 'up';
      }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        dy += speed;
        playerDirRef.current = 'down';
      }
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
        dx -= speed;
        playerDirRef.current = 'left';
      }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
        dx += speed;
        playerDirRef.current = 'right';
      }

      // Tap-to-move handling
      if (targetPosRef.current && dx === 0 && dy === 0) {
        const tx = targetPosRef.current.x;
        const ty = targetPosRef.current.y;
        const dist = Math.hypot(tx - playerPosRef.current.x, ty - playerPosRef.current.y);

        if (dist > 4) {
          const angle = Math.atan2(ty - playerPosRef.current.y, tx - playerPosRef.current.x);
          dx = Math.cos(angle) * speed;
          dy = Math.sin(angle) * speed;

          if (Math.abs(dx) > Math.abs(dy)) {
            playerDirRef.current = dx > 0 ? 'right' : 'left';
          } else {
            playerDirRef.current = dy > 0 ? 'down' : 'up';
          }
        } else {
          targetPosRef.current = null;
        }
      }

      const isMoving = dx !== 0 || dy !== 0;
      isWalkingRef.current = isMoving;

      if (isMoving) {
        if (frameCount % 8 === 0) {
          walkFrameRef.current++;
        }

        const nextX = playerPosRef.current.x + dx;
        const nextY = playerPosRef.current.y + dy;

        // X collision check
        if (!checkCollision(nextX, playerPosRef.current.y)) {
          playerPosRef.current.x = Math.max(10, Math.min(currentRoom.width - 34, nextX));
        }
        // Y collision check
        if (!checkCollision(playerPosRef.current.x, nextY)) {
          playerPosRef.current.y = Math.max(10, Math.min(currentRoom.height - 34, nextY));
        }

        // Add to companion trail queue
        trailRef.current.push({ ...playerPosRef.current });
        if (trailRef.current.length > 22) {
          const followPos = trailRef.current.shift();
          if (followPos) {
            tedPosRef.current = { ...followPos };
            tedDirRef.current = playerDirRef.current;
          }
        }
      }

      // Proximity Detection for Interactables
      let closest: InteractableObject | null = null;
      let minDistance = 42;

      for (const item of currentRoom.interactables) {
        const dist = Math.hypot(
          playerPosRef.current.x + 12 - (item.x + item.width / 2),
          playerPosRef.current.y + 16 - (item.y + item.height / 2)
        );
        if (dist < minDistance) {
          closest = item;
          minDistance = dist;
        }
      }

      activeInteractableRef.current = closest;
      setActiveInteractable(closest);

      // --- RENDERING ENVIRONMENT ---
      ctx.imageSmoothingEnabled = false;

      // Floor / Grass
      if (currentRoom.theme === 'valley') {
        ctx.fillStyle = '#1B2042';
        ctx.fillRect(0, 0, currentRoom.width, currentRoom.height);

        // Cobblestone path ribbons
        ctx.fillStyle = '#30385F';
        // Main cross paths
        ctx.fillRect(360, 40, 60, 540);
        ctx.fillRect(120, 160, 520, 50);
        ctx.fillRect(360, 420, 320, 50);

        // Cobblestone stone accents
        ctx.fillStyle = '#666FA0';
        for (let py = 60; py < 560; py += 30) {
          ctx.fillRect(375, py, 12, 6);
          ctx.fillRect(395, py + 12, 10, 6);
        }

        // Buildings facades
        // Bureau (NW)
        ctx.fillStyle = '#1B2042';
        ctx.fillRect(70, 70, 140, 75);
        ctx.strokeStyle = '#30385F';
        ctx.lineWidth = 3;
        ctx.strokeRect(70, 70, 140, 75);
        // Bureau Door
        ctx.fillStyle = '#101329';
        ctx.fillRect(130, 115, 30, 30);
        // Sign
        ctx.fillStyle = '#F3B79C';
        ctx.fillRect(85, 80, 110, 12);
        ctx.fillStyle = '#101329';
        ctx.font = '8px monospace';
        ctx.fillText('01. BUREAU', 115, 89);

        // Museum (North)
        ctx.fillStyle = '#1B2042';
        ctx.fillRect(310, 50, 160, 75);
        ctx.strokeStyle = '#666FA0';
        ctx.strokeRect(310, 50, 160, 75);
        ctx.fillStyle = '#101329';
        ctx.fillRect(375, 95, 40, 30);
        ctx.fillStyle = '#C3A9E8';
        ctx.fillRect(330, 60, 120, 12);
        ctx.fillStyle = '#101329';
        ctx.fillText('02. MUSEUM', 365, 69);

        // Court (NE)
        ctx.fillStyle = '#1B2042';
        ctx.fillRect(550, 70, 140, 75);
        ctx.strokeStyle = '#F6D78B';
        ctx.strokeRect(550, 70, 140, 75);
        ctx.fillStyle = '#101329';
        ctx.fillRect(605, 115, 30, 30);
        ctx.fillStyle = '#F6D78B';
        ctx.fillRect(565, 80, 110, 12);
        ctx.fillStyle = '#101329';
        ctx.fillText('03. COURT', 595, 89);

        // Archive (East)
        ctx.fillStyle = '#1B2042';
        ctx.fillRect(620, 310, 120, 75);
        ctx.strokeStyle = '#9588BD';
        ctx.strokeRect(620, 310, 120, 75);
        ctx.fillStyle = '#101329';
        ctx.fillRect(665, 355, 30, 30);
        ctx.fillStyle = '#9588BD';
        ctx.fillRect(630, 320, 100, 12);
        ctx.fillStyle = '#101329';
        ctx.fillText('04. ARCHIVE', 655, 329);

        // Secret Garden Gate (SE)
        ctx.fillStyle = secretGardenUnlocked ? '#354E50' : '#101329';
        ctx.fillRect(620, 480, 110, 60);
        ctx.strokeStyle = secretGardenUnlocked ? '#E98FAF' : '#30385F';
        ctx.strokeRect(620, 480, 110, 60);
        ctx.fillStyle = secretGardenUnlocked ? '#E98FAF' : '#666FA0';
        ctx.font = '8px monospace';
        ctx.fillText(secretGardenUnlocked ? '🌹 SECRET GARDEN' : '🔒 OVERGROWN GATE', 635, 510);

        // Wildflowers blooming along paths (scales with progress!)
        const isBloomed = starsRecovered >= 3;
        for (let fx = 160; fx < 350; fx += 40) {
          SpriteRenderer.drawFlowerCluster(ctx, fx, 230, isBloomed);
          SpriteRenderer.drawFlowerCluster(ctx, fx + 200, 230, isBloomed);
        }
        for (let fy = 200; fy < 500; fy += 50) {
          SpriteRenderer.drawFlowerCluster(ctx, 440, fy, isBloomed);
        }

      } else {
        // Interior Room Floor & Walls
        ctx.fillStyle = '#1B2042';
        ctx.fillRect(0, 0, currentRoom.width, currentRoom.height);

        // Top Wall
        ctx.fillStyle = '#101329';
        ctx.fillRect(0, 0, currentRoom.width, 45);
        ctx.strokeStyle = '#30385F';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, currentRoom.width, 45);

        // Interior Props depending on room
        if (currentRoom.id === 'bureau') {
          // Desk
          ctx.fillStyle = '#30385F';
          ctx.fillRect(190, 150, 120, 45);
          ctx.strokeStyle = '#F3B79C';
          ctx.strokeRect(190, 150, 120, 45);
          // Desk Lamp
          ctx.fillStyle = '#F6D78B';
          ctx.fillRect(200, 140, 8, 12);
          // Paperwork
          ctx.fillStyle = '#F4EBDD';
          ctx.fillRect(230, 155, 14, 10);
          ctx.fillRect(250, 158, 16, 12);
          // Filing Cabinet
          ctx.fillStyle = '#101329';
          ctx.fillRect(60, 70, 70, 50);
          ctx.strokeStyle = '#666FA0';
          ctx.strokeRect(60, 70, 70, 50);
          ctx.fillStyle = '#F4EBDD';
          ctx.fillText('FILES', 80, 100);
          // Desk Drawer #07
          ctx.fillStyle = '#101329';
          ctx.fillRect(370, 70, 80, 45);
          ctx.strokeStyle = '#F6D78B';
          ctx.strokeRect(370, 70, 80, 45);
          ctx.fillStyle = '#F6D78B';
          ctx.fillText('DRAWER 07', 385, 95);

        } else if (currentRoom.id === 'museum') {
          // Red Carpet Runner
          ctx.fillStyle = '#30385F';
          ctx.fillRect(260, 50, 80, 390);
          ctx.fillStyle = '#E98FAF';
          ctx.fillRect(265, 50, 70, 390);

          // Portrait Frames on Wall
          ctx.fillStyle = '#F6D78B';
          ctx.fillRect(100, 15, 50, 35);
          ctx.fillRect(220, 15, 50, 35);
          ctx.fillStyle = '#101329';
          ctx.fillRect(104, 19, 42, 27);
          ctx.fillRect(224, 19, 42, 27);
          ctx.fillStyle = '#F4EBDD';
          ctx.fillText('P1', 118, 36);
          ctx.fillText('P2 🗝️', 234, 36);

          // Pedestals
          ctx.fillStyle = '#101329';
          ctx.fillRect(350, 140, 60, 45);
          ctx.fillRect(470, 140, 60, 45);
          ctx.strokeStyle = '#C3A9E8';
          ctx.strokeRect(350, 140, 60, 45);
          ctx.strokeRect(470, 140, 60, 45);
          ctx.fillStyle = '#F6D78B';
          ctx.fillText('🏆', 372, 168);
          ctx.fillText('✨', 492, 168);

        } else if (currentRoom.id === 'court') {
          // Judge Bench
          ctx.fillStyle = '#30385F';
          ctx.fillRect(190, 80, 160, 50);
          ctx.strokeStyle = '#F6D78B';
          ctx.strokeRect(190, 80, 160, 50);
          ctx.fillStyle = '#F4EBDD';
          ctx.fillText('⚖️ HON. JUDGE BENCH', 210, 110);

          // Prosecution & Defense Tables
          ctx.fillStyle = '#101329';
          ctx.fillRect(80, 220, 100, 40);
          ctx.fillRect(350, 220, 100, 40);
          ctx.strokeStyle = '#30385F';
          ctx.strokeRect(80, 220, 100, 40);
          ctx.strokeRect(350, 220, 100, 40);
          ctx.fillStyle = '#F4EBDD';
          ctx.fillText('PROSECUTION', 90, 245);
          ctx.fillText('DEFENSE (TED)', 360, 245);

        } else if (currentRoom.id === 'archive') {
          // Floating Memory Crystals!
          const bob = Math.sin(frameCount * 0.06) * 4;
          SpriteRenderer.drawCrystal(ctx, 100, 150, false, bob);
          SpriteRenderer.drawCrystal(ctx, 260, 140, false, -bob);
          SpriteRenderer.drawCrystal(ctx, 420, 150, true, bob);

          // Bookshelves
          ctx.fillStyle = '#101329';
          ctx.fillRect(40, 50, 130, 30);
          ctx.fillRect(210, 50, 130, 30);
          ctx.fillRect(380, 50, 130, 30);
          ctx.strokeStyle = '#9588BD';
          ctx.strokeRect(40, 50, 130, 30);
          ctx.strokeRect(210, 50, 130, 30);
          ctx.strokeRect(380, 50, 130, 30);

        } else if (currentRoom.id === 'observatory') {
          // Telescope
          ctx.fillStyle = '#F6D78B';
          ctx.fillRect(180, 110, 35, 12);
          ctx.fillStyle = '#101329';
          ctx.fillRect(190, 122, 15, 25);
          ctx.fillStyle = '#F4EBDD';
          ctx.fillText('TELESCOPE', 170, 160);

          // Altar for Constellation
          ctx.fillStyle = '#1B2042';
          ctx.fillRect(270, 110, 60, 40);
          ctx.strokeStyle = '#C3A9E8';
          ctx.strokeRect(270, 110, 60, 40);
          ctx.fillStyle = '#C3A9E8';
          ctx.fillText('✦ ALTAR ✦', 280, 135);

        } else if (currentRoom.id === 'garden') {
          // Pond
          ctx.fillStyle = '#101329';
          ctx.beginPath();
          ctx.ellipse(150, 225, 70, 45, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#718C83';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Ancient Tree & Bench
          ctx.fillStyle = '#354E50';
          ctx.beginPath();
          ctx.arc(410, 90, 45, 0, Math.PI * 2);
          ctx.fill();

          // Wooden Bench
          ctx.fillStyle = '#F6D78B';
          ctx.fillRect(370, 145, 60, 20);
          ctx.fillStyle = '#101329';
          ctx.font = '8px monospace';
          ctx.fillText('BENCH 💌', 380, 158);

          // Fireflies in garden
          ctx.fillStyle = '#F6D78B';
          const t = frameCount * 0.05;
          ctx.fillRect(160 + Math.sin(t) * 20, 180 + Math.cos(t) * 15, 3, 3);
          ctx.fillRect(320 + Math.sin(t + 1) * 25, 220 + Math.cos(t + 1) * 20, 3, 3);
          ctx.fillRect(440 + Math.sin(t + 2) * 20, 160 + Math.cos(t + 2) * 15, 3, 3);
        }

        // Exit Door
        ctx.fillStyle = '#F6D78B';
        ctx.fillRect(currentRoom.width / 2 - 20, currentRoom.height - 30, 40, 10);
      }

      // Draw Ted (Companion Follower)
      // If in Overworld or Archive/Observatory, Ted follows her!
      if (currentRoom.id === 'overworld' || currentRoom.id === 'archive' || currentRoom.id === 'observatory') {
        SpriteRenderer.drawTed(
          ctx,
          tedPosRef.current,
          tedDirRef.current,
          isWalkingRef.current,
          walkFrameRef.current
        );
      } else if (currentRoom.id === 'garden') {
        // Ted is sitting waiting on the bench
        SpriteRenderer.drawTed(
          ctx,
          { x: 380, y: 135 },
          'down',
          false,
          0
        );
      } else if (currentRoom.id === 'bureau') {
        // Ted is behind the desk
        SpriteRenderer.drawTed(
          ctx,
          { x: 238, y: 125 },
          'down',
          false,
          0
        );
      } else if (currentRoom.id === 'court') {
        // Ted at defense table
        SpriteRenderer.drawTed(
          ctx,
          { x: 390, y: 200 },
          'down',
          false,
          0
        );
      }

      // Draw Beenish (Player)
      SpriteRenderer.drawBeenish(
        ctx,
        playerPosRef.current,
        playerDirRef.current,
        isWalkingRef.current,
        walkFrameRef.current
      );

      // Draw Action Prompt Bubble above Beenish if an interactable is in range
      if (closest) {
        SpriteRenderer.drawPromptBubble(
          ctx,
          playerPosRef.current.x + 12,
          playerPosRef.current.y,
          closest.promptLabel
        );
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentRoomId, starsRecovered, recoveredStarIds, secretGardenUnlocked]);

  // Handle canvas click / tap for move-to-point
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    targetPosRef.current = { x: clickX, y: clickY };
  };

  // Virtual D-Pad Button Handlers for Mobile
  const handleVirtualDir = (dir: Direction, isDown: boolean) => {
    const keyMap: Record<Direction, string> = {
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
    };
    keysPressed.current[keyMap[dir]] = isDown;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        padding: '12px 10px 40px',
        userSelect: 'none',
      }}
    >
      {/* Current Room Banner & Breadcrumb */}
      <div
        className="pixel-panel pixel-panel-gold font-mono"
        style={{
          width: '100%',
          maxWidth: `${room.width}px`,
          padding: '8px 16px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-midnight-indigo)',
          fontSize: '0.8rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--color-lantern-gold)', fontWeight: 600 }}>LOCATION: </span>
          <span style={{ color: 'var(--color-moon-cream)' }}>{room.name.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentRoomId !== 'overworld' && (
            <button
              onClick={() => changeRoom('overworld')}
              className="pixel-btn pixel-btn-ghost font-mono"
              style={{ padding: '3px 8px', fontSize: '0.75rem', minHeight: '26px' }}
            >
              ← RETURN TO VALLEY
            </button>
          )}
        </div>
      </div>

      {/* Main 2D RPG Adventure Canvas */}
      <div
        style={{
          position: 'relative',
          boxShadow: 'var(--pixel-border-gold), 0 8px 32px rgba(16, 19, 41, 0.9)',
          borderRadius: '0',
          overflow: 'hidden',
          backgroundColor: 'var(--color-void-navy)',
          maxWidth: '100%',
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="pixelated"
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            cursor: 'crosshair',
          }}
        />

        {/* Floating Proximity Action Button on Mobile */}
        {activeInteractable && (
          <button
            onClick={handleAction}
            className="pixel-btn pixel-btn-primary font-display animate-glow"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              padding: '12px 24px',
              fontSize: '0.85rem',
            }}
          >
            {activeInteractable.promptLabel}
          </button>
        )}
      </div>

      {/* Retro Mobile Virtual Controls (Always accessible, great on mobile or mouse) */}
      <div
        style={{
          width: '100%',
          maxWidth: `${room.width}px`,
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* On-Screen D-Pad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 44px)',
            gridTemplateRows: 'repeat(3, 44px)',
            gap: '4px',
          }}
        >
          <div />
          <button
            onMouseDown={() => handleVirtualDir('up', true)}
            onMouseUp={() => handleVirtualDir('up', false)}
            onTouchStart={() => handleVirtualDir('up', true)}
            onTouchEnd={() => handleVirtualDir('up', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ▲
          </button>
          <div />
          <button
            onMouseDown={() => handleVirtualDir('left', true)}
            onMouseUp={() => handleVirtualDir('left', false)}
            onTouchStart={() => handleVirtualDir('left', true)}
            onTouchEnd={() => handleVirtualDir('left', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ◀
          </button>
          <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)' }} />
          <button
            onMouseDown={() => handleVirtualDir('right', true)}
            onMouseUp={() => handleVirtualDir('right', false)}
            onTouchStart={() => handleVirtualDir('right', true)}
            onTouchEnd={() => handleVirtualDir('right', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ▶
          </button>
          <div />
          <button
            onMouseDown={() => handleVirtualDir('down', true)}
            onMouseUp={() => handleVirtualDir('down', false)}
            onTouchStart={() => handleVirtualDir('down', true)}
            onTouchEnd={() => handleVirtualDir('down', false)}
            className="pixel-btn"
            style={{ padding: 0 }}
          >
            ▼
          </button>
          <div />
        </div>

        {/* Action Button & Instructions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>
            <div>Controls: <strong style={{ color: 'var(--color-moon-cream)' }}>WASD / Arrows</strong> to Walk</div>
            <div>Action: <strong style={{ color: 'var(--color-lantern-gold)' }}>[ E ] / Space</strong> to Interact</div>
            <div>Or click anywhere to walk directly!</div>
          </div>

          <button
            onClick={handleAction}
            className="pixel-btn pixel-btn-primary font-display"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '0',
              fontSize: '1rem',
              boxShadow: 'var(--pixel-border-gold)',
            }}
            title="Interact (E)"
          >
            [ E ]
          </button>
        </div>
      </div>
    </div>
  );
};
